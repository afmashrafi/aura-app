import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  try {
    const res = await fetch(
      `https://api.jikan.moe/v4/users/${encodeURIComponent(username)}/animelist?limit=6&order_by=updated_at&sort=desc`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ error: "User not found or list is private" }, { status: 404 });

    const json = await res.json();
    const items = (json.data ?? []).map((item: {
      entry: { mal_id: number; title: string; images: { jpg: { image_url: string } }; url: string };
      score: number;
      status: string;
    }) => ({
      id: item.entry.mal_id,
      title: item.entry.title,
      image: item.entry.images.jpg.image_url,
      score: item.score,
      status: item.status,
      url: item.entry.url,
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
