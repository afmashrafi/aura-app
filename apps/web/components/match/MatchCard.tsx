"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CompatibilityBadge } from "./CompatibilityBadge";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import type { MatchWithPartner } from "@aura/api";
import type { AvatarConfig } from "@aura/types";

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  music:     { label: "Music",     emoji: "🎵" },
  artists:   { label: "Artists",   emoji: "🎤" },
  movies:    { label: "Movies",    emoji: "🎬" },
  shows:     { label: "TV Shows",  emoji: "📺" },
  anime:     { label: "Anime",     emoji: "⛩️" },
  books:     { label: "Books",     emoji: "📚" },
  games:     { label: "Games",     emoji: "🎮" },
  podcasts:  { label: "Podcasts",  emoji: "🎙️" },
  albums:    { label: "Albums",    emoji: "💿" },
  directors: { label: "Directors", emoji: "🎥" },
};

interface MatchCardProps {
  matchWithPartner: MatchWithPartner;
  currentUserId: string;
  onConnect: () => void;
  myAvatarConfig?: AvatarConfig | null;
  myAvatarUrl?: string | null;
}

function InitialsAvatar({ name, size = "lg" }: { name: string; size?: "sm" | "lg" }) {
  const initial = name.charAt(0).toUpperCase();
  const dim = size === "lg" ? "w-14 h-14 text-xl" : "w-10 h-10 text-base";
  return (
    <div
      className={`${dim} rounded-full bg-primary-pale flex items-center justify-center font-display font-semibold text-primary shrink-0`}
      aria-label={`${name}'s avatar`}
    >
      {initial}
    </div>
  );
}

export function MatchCard({ matchWithPartner, currentUserId, onConnect, myAvatarConfig, myAvatarUrl }: MatchCardProps) {
  const { match, partner } = matchWithPartner;
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hasExtra =
    partner.bio ||
    (partner.interests && partner.interests.length > 0) ||
    (partner.prompt_responses && partner.prompt_responses.length > 0) ||
    (partner.favorites && partner.favorites.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            {/* Duo avatar display */}
            <div className="relative flex shrink-0 items-end">
              <Avatar3D
                avatarUrl={myAvatarUrl}
                avatarConfig={myAvatarConfig}
                name="Me"
                size={44}
                animate={!hovered}
              />
              <div className="-ml-3 ring-2 ring-white rounded-full">
                <Avatar3D
                  avatarUrl={partner.avatar_url}
                  avatarConfig={partner.avatar_config}
                  name={partner.first_name}
                  size={44}
                  animate
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <p className="font-semibold text-ink text-base leading-tight">
                {partner.first_name}
              </p>
              <CompatibilityBadge score={Math.round(match.compatibility_score)} size="sm" />
            </div>
          </div>

          {/* Shared highlights */}
          {match.shared_highlights && match.shared_highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {match.shared_highlights.slice(0, 3).map((h, i) => (
                <span
                  key={i}
                  className="text-xs text-ink-secondary bg-surface rounded-full px-3 py-1 border border-divider capitalize"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* View profile toggle */}
          {hasExtra && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-full text-sm text-primary font-medium flex items-center justify-center gap-1.5 py-2 rounded-xl hover:bg-primary-pale transition-colors mb-3"
            >
              {expanded ? "Hide profile" : "View profile"}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          <Button variant="primary" size="sm" onClick={onConnect} className="w-full">
            Start conversation
          </Button>
        </div>

        {/* Expandable profile */}
        <AnimatePresence initial={false}>
          {expanded && hasExtra && (
            <motion.div
              key="profile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="border-t border-divider px-5 py-4 flex flex-col gap-5">

                {/* Partner avatar showcase */}
                {(partner.avatar_url || partner.avatar_config) && (
                  <div className="flex flex-col items-center gap-2 pb-2">
                    <Avatar3D
                      avatarUrl={partner.avatar_url}
                      avatarConfig={partner.avatar_config}
                      name={partner.first_name}
                      size={96}
                      animate
                    />
                    <p className="text-xs text-ink-muted">{partner.first_name}'s avatar</p>
                  </div>
                )}

                {/* Bio */}
                {partner.bio && (
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">About</p>
                    <p className="text-sm text-ink leading-relaxed">{partner.bio}</p>
                  </div>
                )}

                {/* Interests */}
                {partner.interests && partner.interests.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {partner.interests.map((interest) => (
                        <span
                          key={interest}
                          className="text-xs bg-primary-pale text-primary font-medium px-3 py-1.5 rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prompts */}
                {partner.prompt_responses && partner.prompt_responses.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {partner.prompt_responses.map((pr, i) => (
                      <div key={i} className="bg-surface rounded-2xl p-4">
                        <p className="text-xs text-ink-muted mb-1">{pr.prompt}</p>
                        <p className="text-sm text-ink font-medium leading-snug">{pr.answer}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Favourites */}
                {partner.favorites && partner.favorites.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-3">Favourites</p>
                    <div className="flex flex-col gap-3">
                      {partner.favorites.map((fav) => {
                        const meta = CATEGORY_META[fav.category];
                        return (
                          <div key={fav.category}>
                            <p className="text-xs text-ink-secondary font-medium mb-1.5">
                              {meta?.emoji} {meta?.label ?? fav.category}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {fav.items.map((item) => (
                                <span
                                  key={item}
                                  className="text-xs bg-surface border border-divider text-ink px-2.5 py-1 rounded-full"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export { InitialsAvatar };
