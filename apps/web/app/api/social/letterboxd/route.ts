import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username");
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  try {
    const res = await fetch(`https://letterboxd.com/${encodeURIComponent(username)}/rss/`);

    if (!res.ok) {
      return NextResponse.json({ error: "Profile not found or is private" }, { status: 404 });
    }

    const xml = await res.text();

    const items: {
      title: string;
      year: string;
      rating: string;
      image: string | null;
    }[] = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 6) {
      const block = match[1];

      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      if (!titleMatch) continue;

      // Extract poster from description HTML
      const imgMatch = block.match(/<img[^>]+src="([^"]+)"/);

      const raw = titleMatch[1]; // e.g. "The Dark Knight, 2008 - ★★★★½"
      const dashIdx = raw.lastIndexOf(" - ");
      const titleYear = dashIdx !== -1 ? raw.slice(0, dashIdx) : raw;
      const rating = dashIdx !== -1 ? raw.slice(dashIdx + 3) : "";

      const commaIdx = titleYear.lastIndexOf(", ");
      const title = commaIdx !== -1 ? titleYear.slice(0, commaIdx) : titleYear;
      const year = commaIdx !== -1 ? titleYear.slice(commaIdx + 2) : "";

      // Skip non-film entries (diary entries without a clear title)
      if (!title || title.length < 2) continue;

      items.push({
        title,
        year,
        rating,
        image: imgMatch ? imgMatch[1] : null,
      });
    }

    return NextResponse.json({ items }, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (e) {
    console.error("Letterboxd fetch error:", e);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
