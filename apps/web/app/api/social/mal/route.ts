import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const SAFE_USERNAME = /^[a-zA-Z0-9_\-.]{1,50}$/;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username || !SAFE_USERNAME.test(username)) {
    return NextResponse.json({ error: "invalid username" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/animelist?limit=6&order_by=updated_at&sort=desc`
    );

    if (!res.ok) {
      return NextResponse.json({ error: "User not found or list is private" }, { status: 404 });
    }

    const json = await res.json();
    const items = (json.data ?? []).map((item: {
      entry: { mal_id: number; title: string; images: { jpg: { image_url: string } } };
      score: number;
      status: string;
    }) => ({
      id: item.entry.mal_id,
      title: item.entry.title,
      image: item.entry.images?.jpg?.image_url ?? null,
      score: item.score ?? 0,
      status: item.status ?? "",
    }));

    return NextResponse.json({ items }, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (e) {
    console.error("MAL fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
