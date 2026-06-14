"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimeItem {
  id: number;
  title: string;
  image: string;
  score: number;
  status: string;
}

interface FilmItem {
  title: string;
  year: string;
  rating: string;
  image: string | null;
}

type Platform = "myanimelist" | "letterboxd" | "spotify" | "goodreads";

const PLATFORM_META: Record<Platform, { label: string; emoji: string; color: string }> = {
  myanimelist: { label: "Anime",   emoji: "⛩️", color: "#2E51A2" },
  letterboxd:  { label: "Films",   emoji: "🎬", color: "#00C030" },
  spotify:     { label: "Music",   emoji: "🎵", color: "#1DB954" },
  goodreads:   { label: "Books",   emoji: "📚", color: "#553B08" },
};

function StarRating({ text }: { text: string }) {
  if (!text) return null;
  const hasHalf = text.includes("½");
  const fullStars = (text.match(/★/g) ?? []).length;
  const display = "★".repeat(fullStars) + (hasHalf ? "½" : "");
  return <span className="text-amber-400 text-[11px]">{display}</span>;
}

function SkeletonCard() {
  return (
    <div className="shrink-0 w-28 animate-pulse">
      <div className="w-28 h-40 bg-divider rounded-2xl" />
      <div className="mt-2 h-3 bg-divider rounded w-3/4" />
      <div className="mt-1.5 h-3 bg-divider rounded w-1/2" />
    </div>
  );
}

function ShelfSection({
  platform,
  children,
  empty,
}: {
  platform: Platform;
  children: React.ReactNode;
  empty?: boolean;
}) {
  const meta = PLATFORM_META[platform];
  return (
    <div>
      <p className="text-sm font-bold text-ink mb-3">
        {meta.emoji} {meta.label}
      </p>
      {empty ? (
        <p className="text-sm text-ink-muted">Nothing to show yet.</p>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {children}
        </div>
      )}
    </div>
  );
}

function AnimeShelf({ username }: { username: string }) {
  const [items, setItems] = useState<AnimeItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/social/mal?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setItems(d.items ?? []);
      })
      .catch(() => setError("Failed to load"));
  }, [username]);

  if (error) {
    return (
      <ShelfSection platform="myanimelist" empty>
        <p className="text-sm text-ink-muted">{error}</p>
      </ShelfSection>
    );
  }

  return (
    <ShelfSection platform="myanimelist" empty={items !== null && items.length === 0}>
      {items === null
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 w-28"
            >
              <div className="w-28 h-40 rounded-2xl overflow-hidden bg-surface shadow-sm">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">⛩️</div>
                )}
              </div>
              <p className="mt-2 text-xs font-medium text-ink leading-snug line-clamp-2">{item.title}</p>
              {item.score > 0 && (
                <p className="text-amber-400 text-[11px] mt-0.5">
                  {"★".repeat(Math.min(Math.round(item.score / 2), 5))}
                  <span className="text-ink-muted ml-1">{item.score}/10</span>
                </p>
              )}
            </motion.div>
          ))}
    </ShelfSection>
  );
}

function FilmShelf({ username }: { username: string }) {
  const [items, setItems] = useState<FilmItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/social/letterboxd?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setItems(d.items ?? []);
      })
      .catch(() => setError("Failed to load"));
  }, [username]);

  if (error) {
    return (
      <ShelfSection platform="letterboxd" empty>
        <p className="text-sm text-ink-muted">{error}</p>
      </ShelfSection>
    );
  }

  return (
    <ShelfSection platform="letterboxd" empty={items !== null && items.length === 0}>
      {items === null
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="shrink-0 w-28"
            >
              <div className="w-28 h-40 rounded-2xl overflow-hidden bg-surface shadow-sm">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-surface-deep to-primary-pale flex items-center justify-center text-3xl">
                    🎬
                  </div>
                )}
              </div>
              <p className="mt-2 text-xs font-medium text-ink leading-snug line-clamp-2">
                {item.title}
                {item.year && <span className="text-ink-muted"> {item.year}</span>}
              </p>
              {item.rating && <StarRating text={item.rating} />}
            </motion.div>
          ))}
    </ShelfSection>
  );
}

function SimpleShelf({ platform, username }: { platform: Platform; username: string }) {
  const meta = PLATFORM_META[platform];
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface border border-divider">
      <span className="text-2xl">{meta.emoji}</span>
      <div>
        <p className="text-sm font-semibold text-ink">{meta.label}</p>
        <p className="text-xs text-ink-muted">@{username}</p>
      </div>
    </div>
  );
}

export function SocialMediaShelf({ platform, username }: { platform: Platform; username: string }) {
  if (platform === "myanimelist") return <AnimeShelf username={username} />;
  if (platform === "letterboxd") return <FilmShelf username={username} />;
  return <SimpleShelf platform={platform} username={username} />;
}
