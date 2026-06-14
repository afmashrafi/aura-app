"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CompatibilityBadge } from "./CompatibilityBadge";
import type { MatchWithPartner } from "@aura/api";

interface MatchCardProps {
  matchWithPartner: MatchWithPartner;
  currentUserId: string;
  onConnect: () => void;
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

export function MatchCard({ matchWithPartner, currentUserId, onConnect }: MatchCardProps) {
  const { match, partner } = matchWithPartner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card className="p-5">
        {/* Header: avatars + name + badge */}
        <div className="flex items-center gap-4 mb-4">
          {/* Interlocking circles avatar */}
          <div className="relative flex shrink-0">
            <InitialsAvatar name="Me" size="sm" />
            <div className="-ml-3">
              <InitialsAvatar name={partner.first_name} size="sm" />
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
            {match.shared_highlights.slice(0, 3).map((highlight, i) => (
              <span
                key={i}
                className="text-xs text-ink-secondary bg-surface rounded-full px-3 py-1 border border-divider"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}

        <Button
          variant="primary"
          size="sm"
          onClick={onConnect}
          className="w-full"
        >
          Start conversation
        </Button>
      </Card>
    </motion.div>
  );
}

export { InitialsAvatar };
