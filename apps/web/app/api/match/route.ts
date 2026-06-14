import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const THRESHOLD = 70; // percent

const WEIGHTS: Record<string, number> = {
  dealbreakers: 4,
  values: 3,
  goals: 2,
  lifestyle: 1,
};

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
