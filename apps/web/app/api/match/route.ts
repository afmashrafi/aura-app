import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const THRESHOLD = 70; // percent

const WEIGHTS: Record<string, number> = {
  dealbreakers: 4,
  values: 3,
  goals: 2,
  lifestyle: 1,
};

// Admin endpoint — re-runs matching for ALL users
// Call: GET /api/match?secret=YOUR_ADMIN_SECRET
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );

  // Get all completed users
  const { data: profiles } = await admin
    .from("profiles")
    .select("id")
    .eq("questionnaire_completed", true);

  if (!profiles || profiles.length < 2) {
    return NextResponse.json({ message: "Not enough users", matches: 0 });
  }

  const allUserIds = profiles.map((p) => p.id);

  // Fetch all answers in one query
  const { data: allAnswers } = await admin
    .from("answers")
    .select("user_id, question_id, category, answer_index")
    .in("user_id", allUserIds);

  // Group answers by user
  const byUser: Record<string, { question_id: number; category: string; answer_index: number }[]> = {};
  for (const a of allAnswers ?? []) {
    (byUser[a.user_id] ??= []).push(a);
  }

  const newMatches: { user_a: string; user_b: string; compatibility_score: number; shared_highlights: string[] }[] = [];

  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const idA = profiles[i].id;
      const idB = profiles[j].id;
      const answersA = byUser[idA] ?? [];
      const answersB = byUser[idB] ?? [];
      if (answersA.length < 10 || answersB.length < 10) continue;

      const mapA: Record<number, { category: string; answer_index: number }> = {};
      for (const a of answersA) mapA[a.question_id] = a;

      let score = 0;
      let maxScore = 0;
      const catScore: Record<string, number> = {};

      for (const b of answersB) {
        const a = mapA[b.question_id];
        if (!a) continue;
        const w = WEIGHTS[b.category] ?? 1;
        maxScore += w;
        if (a.answer_index === b.answer_index) {
          score += w;
          catScore[b.category] = (catScore[b.category] ?? 0) + w;
        }
      }

      if (maxScore === 0) continue;
      const pct = Math.round((score / maxScore) * 100);
      if (pct < THRESHOLD) continue;

      const highlights = Object.entries(catScore)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([cat]) => cat);

      const [userA, userB] = idA < idB ? [idA, idB] : [idB, idA];
      newMatches.push({ user_a: userA, user_b: userB, compatibility_score: pct, shared_highlights: highlights });
    }
  }

  if (newMatches.length > 0) {
    await admin.from("matches").upsert(newMatches, { onConflict: "user_a,user_b" });
  }

  return NextResponse.json({ message: "Done", matches: newMatches.length, users: profiles.length });
}

export async function POST(req: NextRequest) {
  // Verify the caller is authenticated and is the user they claim to be
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Validate the JWT against Supabase using the anon key (no service key needed here)
  const verifyClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } }
  );
  const { data: { user: caller }, error: authErr } = await verifyClient.auth.getUser();
  if (authErr || !caller) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (caller.id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false } }
  );

  // All other completed users
  const { data: profiles, error: pe } = await admin
    .from("profiles")
    .select("id")
    .eq("questionnaire_completed", true)
    .neq("id", userId);

  if (pe) return NextResponse.json({ error: pe.message }, { status: 500 });
  if (!profiles || profiles.length === 0) return NextResponse.json({ matches: 0 });

  // Current user's answers
  const { data: myAnswers, error: me } = await admin
    .from("answers")
    .select("question_id, category, answer_index")
    .eq("user_id", userId);

  if (me) return NextResponse.json({ error: me.message }, { status: 500 });
  if (!myAnswers || myAnswers.length === 0) return NextResponse.json({ matches: 0 });

  // Build my answer lookup
  const myMap: Record<number, { category: string; answer_index: number }> = {};
  for (const a of myAnswers) myMap[a.question_id] = a;

  // All other users' answers in one query
  const otherIds = profiles.map((p) => p.id);
  const { data: allAnswers, error: ae } = await admin
    .from("answers")
    .select("user_id, question_id, category, answer_index")
    .in("user_id", otherIds);

  if (ae) return NextResponse.json({ error: ae.message }, { status: 500 });

  // Group by user
  const byUser: Record<string, { question_id: number; category: string; answer_index: number }[]> = {};
  for (const a of allAnswers ?? []) {
    (byUser[a.user_id] ??= []).push(a);
  }

  const newMatches: {
    user_a: string;
    user_b: string;
    compatibility_score: number;
    shared_highlights: string[];
  }[] = [];

  for (const { id: otherId } of profiles) {
    const theirAnswers = byUser[otherId] ?? [];
    if (theirAnswers.length < 10) continue; // skip barely-started profiles

    let score = 0;
    let maxScore = 0;
    const catScore: Record<string, number> = {};

    for (const t of theirAnswers) {
      const m = myMap[t.question_id];
      if (!m) continue;
      const w = WEIGHTS[t.category] ?? 1;
      maxScore += w;
      if (m.answer_index === t.answer_index) {
        score += w;
        catScore[t.category] = (catScore[t.category] ?? 0) + w;
      }
    }

    if (maxScore === 0) continue;
    const pct = Math.round((score / maxScore) * 100);
    if (pct < THRESHOLD) continue;

    const highlights = Object.entries(catScore)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([cat]) => cat);

    // Constraint: user_a < user_b lexicographically
    const [userA, userB] = userId < otherId ? [userId, otherId] : [otherId, userId];

    newMatches.push({
      user_a: userA,
      user_b: userB,
      compatibility_score: pct,
      shared_highlights: highlights,
    });
  }

  if (newMatches.length > 0) {
    await admin
      .from("matches")
      .upsert(newMatches, { onConflict: "user_a,user_b" });
  }

  return NextResponse.json({ matches: newMatches.length });
}
