"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimeItem {
  id: number;
  title: string;
  image: string;
  score: number;
  status: string;
  url: string;
}

interface FilmItem {
  title: string;
  year: string;
  rating: string;
  image: string | null;
  url: string | null;
}

type Platform = "myanimelist" | "letterboxd" | "spotify" | "goodreads";

const PLATFORM_META: Record<Platform, { label: string; emoji: string; color: string }> = {
  myanimelist: { label: "Anime",   emoji: "⛩️",  color: "#2E51A2" },
  letterboxd:  { label: "Films",   emoji: "🎬",  color: "#00C030" },
  spotify:     { label: "Spotify", emoji: "🎵",  color: "#1DB954" },
  goodreads:   { label: "Books",   emoji: "📚",  color: "#553B08" },
};

function StarRating({ text }: { text: string }) {
  if (!text) return null;
  const stars = (text.match(/[★½]/g) ?? []).length;
  const hasHalf = text.includes("½");
  const full = hasHalf ? stars - 1 : stars;
  return (
    <span className="text-amber-400 text-xs">
      {"★".repeat(Math.min(full, 5))}
      {hasHalf && "½"}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="shrink-0 w-28 rounded-2xl overflow-hidden animate-pulse">
      <div className="w-28 h-40 bg-divider rounded-2xl" />
      <div className="mt-2 h-3 bg-divider rounded w-3/4" />
      <div className="mt-1.5 h-3 bg-divider rounded w-1/2" />
    </div>
  );
}

function AnimeShelf({ username }: { username: string }) {
  const [items, setItems] = useState<AnimeItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/social/mal?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setError(true));
  }, [username]);

  const meta = PLATFORM_META.myanimelist;

  return (
    <ShelfWrapper label={`${meta.emoji} ${meta.label}`} color={meta.color} username={username} platform="myanimelist">
      {error ? (
        <p className="text-sm text-ink-muted py-2">Couldn't load list — make sure the profile is public.</p>
      ) : items === null ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : items.length === 0 ? (
        <p className="text-sm text-ink-muted py-2">No anime found.</p>
      ) : (
        items.map((item, i) => (
          <motion.a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="shrink-0 w-28 group"
          >
            <div className="w-28 h-40 rounded-2xl overflow-hidden bg-surface shadow-sm group-hover:shadow-md transition-shadow">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="mt-2 text-xs font-medium text-ink leading-snug line-clamp-2">{item.title}</p>
            {item.score > 0 && (
              <p className="text-amber-400 text-xs mt-0.5">{"★".repeat(Math.round(item.score / 2))}</p>
            )}
          </motion.a>
        ))
      )}
    </ShelfWrapper>
  );
}

function FilmShelf({ username }: { username: string }) {
  const [items, setItems] = useState<FilmItem[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/social/letterboxd?username=${encodeURIComponent(username)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => setError(true));
  }, [username]);

  const meta = PLATFORM_META.letterboxd;

  return (
    <ShelfWrapper label={`${meta.emoji} ${meta.label}`} color={meta.color} username={username} platform="letterboxd">
      {error ? (
        <p className="text-sm text-ink-muted py-2">Couldn't load — make sure the Letterboxd profile is public.</p>
      ) : items === null ? (
        Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
      ) : items.length === 0 ? (
        <p className="text-sm text-ink-muted py-2">No films found.</p>
      ) : (
        items.map((item, i) => (
          <motion.a
            key={i}
            href={item.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="shrink-0 w-28 group"
          >
            <div className="w-28 h-40 rounded-2xl overflow-hidden bg-surface shadow-sm group-hover:shadow-md transition-shadow flex items-end">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-surface-deep to-primary-pale flex items-center justify-center">
                  <span className="text-3xl">🎬</span>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-ink leading-snug line-clamp-2">
              {item.title}
              {item.year && <span className="text-ink-muted"> {item.year}</span>}
            </p>
            {item.rating && <StarRating text={item.rating} />}
          </motion.a>
        ))
      )}
    </ShelfWrapper>
  );
}

function ShelfWrapper({
  label,
  color,
  username,
  platform,
  children,
}: {
  label: string;
  color: string;
  username: string;
  platform: Platform;
  children: React.ReactNode;
}) {
  const profileUrl: Record<Platform, string> = {
    myanimelist: `https://myanimelist.net/profile/${username}`,
    letterboxd:  `https://letterboxd.com/${username}`,
    spotify:     `https://open.spotify.com/user/${username}`,
    goodreads:   `https://goodreads.com/${username}`,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-ink">{label}</h3>
        <a
          href={profileUrl[platform]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium transition-colors"
          style={{ color }}
        >
          View profile →
        </a>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {children}
      </div>
    </div>
  );
}

export function SocialMediaShelf({
  platform,
  username,
}: {
  platform: Platform;
  username: string;
}) {
  if (platform === "myanimelist") return <AnimeShelf username={username} />;
  if (platform === "letterboxd") return <FilmShelf username={username} />;

  // Spotify and Goodreads: just a profile link card for now
  const meta = PLATFORM_META[platform];
  const urls: Record<Platform, string> = {
    myanimelist: `https://myanimelist.net/profile/${username}`,
    letterboxd:  `https://letterboxd.com/${username}`,
    spotify:     `https://open.spotify.com/user/${username}`,
    goodreads:   `https://goodreads.com/${username}`,
  };

  return (
    <a
      href={urls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-divider hover:border-current transition-colors group"
      style={{ "--hover-color": meta.color } as React.CSSProperties}
    >
      <span className="text-2xl">{meta.emoji}</span>
      <div>
        <p className="text-sm font-semibold text-ink">{meta.label}</p>
        <p className="text-xs text-ink-muted">@{username}</p>
      </div>
      <svg className="w-4 h-4 text-ink-muted ml-auto group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
}
