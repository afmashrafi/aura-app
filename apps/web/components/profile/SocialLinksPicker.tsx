"use client";

import { motion } from "framer-motion";
import type { SocialLink } from "@aura/types";

const PLATFORMS: {
  id: SocialLink["platform"];
  name: string;
  placeholder: string;
  color: string;
  bg: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "spotify",
    name: "Spotify",
    placeholder: "your username",
    color: "#1DB954",
    bg: "#F0FDF4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    id: "letterboxd",
    name: "Letterboxd",
    placeholder: "your username",
    color: "#00C030",
    bg: "#F0FFF4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M8.5 5a7 7 0 100 14A7 7 0 008.5 5zm7 0a7 7 0 100 14 7 7 0 000-14z"/>
      </svg>
    ),
  },
  {
    id: "myanimelist",
    name: "MyAnimeList",
    placeholder: "your username",
    color: "#2E51A2",
    bg: "#EFF6FF",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M4.26 3.46L0 20.54h4.12l.88-3.46H9.6l.88 3.46h4.12L10.34 3.46zm2.59 10.34l1.15-4.5 1.15 4.5zm9.15-7.26v14h3.88V6.54zM22 3.46h-2.12v3.08H22z"/>
      </svg>
    ),
  },
  {
    id: "goodreads",
    name: "Goodreads",
    placeholder: "your username",
    color: "#553B08",
    bg: "#FFFBEB",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M11.43 23.995c-3.608-.208-6.274-2.077-6.448-5.219h2.Temple c.174 1.705 1.553 2.874 3.785 3.012 3.133.195 4.8-1.577 4.8-4.812v-1.348c-.796 1.177-2.077 2.021-4.068 2.021-3.43 0-5.787-2.632-5.787-6.317 0-3.88 2.357-6.316 5.787-6.316 1.992 0 3.273.844 4.068 2.021V5.4h2.045v11.394c0 4.572-2.425 7.201-6.182 7.201zm.13-8.972c2.07 0 3.61-1.577 3.61-4.086 0-2.508-1.54-4.087-3.61-4.087-2.1 0-3.673 1.579-3.673 4.087s1.573 4.086 3.673 4.086z"/>
      </svg>
    ),
  },
];

interface SocialLinksPickerProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export function SocialLinksPicker({ links, onChange }: SocialLinksPickerProps) {
  function getUsername(platform: SocialLink["platform"]) {
    return links.find((l) => l.platform === platform)?.username ?? "";
  }

  function setUsername(platform: SocialLink["platform"], username: string) {
    const filtered = links.filter((l) => l.platform !== platform);
    if (username.trim()) {
      onChange([...filtered, { platform, username: username.trim() }]);
    } else {
      onChange(filtered);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {PLATFORMS.map((p, i) => {
        const username = getUsername(p.id);
        const connected = username.length > 0;

        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
              connected ? "border-[color:var(--c)]" : "border-divider"
            }`}
            style={{ "--c": p.color } as React.CSSProperties}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: p.bg, color: p.color }}
              >
                {p.icon}
              </div>

              {/* Input */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink-muted mb-0.5">{p.name}</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(p.id, e.target.value)}
                  placeholder={p.placeholder}
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="w-full text-sm text-ink placeholder-ink-muted bg-transparent outline-none"
                />
              </div>

              {/* Status dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
                  connected ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{ backgroundColor: p.color }}
              />
            </div>
          </motion.div>
        );
      })}
      <p className="text-xs text-ink-muted text-center mt-1">
        All optional — only your username is shown, not your full library.
      </p>
    </div>
  );
}
