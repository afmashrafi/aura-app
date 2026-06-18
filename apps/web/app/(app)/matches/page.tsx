"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMatchesWithPartners } from "@aura/api";
import { useAuth } from "@/app/providers";
import { MatchCard } from "@/components/match/MatchCard";
import { MatchReveal } from "@/components/match/MatchReveal";
import type { MatchWithPartner } from "@aura/api";

function WaitingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      {/* Pulsing interlocking circles */}
      <div className="relative mb-8" aria-hidden="true">
        <motion.div
          animate={{ x: [-4, 4, -4], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 top-0 w-16 h-16 rounded-full bg-primary-pale"
        />
        <motion.div
          animate={{ x: [4, -4, 4], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
          className="relative ml-8 w-16 h-16 rounded-full bg-surface-deep"
        />
      </div>

      <h1 className="font-display text-[30px] text-ink leading-tight mb-3 mt-4">
        Finding your people…
      </h1>
      <p className="text-ink-secondary text-base leading-relaxed max-w-xs">
        We&apos;re looking for people who align with your answers. You&apos;ll be
        notified the moment we find a great match.
      </p>
    </div>
  );
}

export default function MatchesPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealMatch, setRevealMatch] = useState<MatchWithPartner | null>(null);

  useEffect(() => {
    if (!user) return;
    getMatchesWithPartners(user.id)
      .then(setMatches)
      .finally(() => setLoading(false));
  }, [user]);

  const handleConnect = useCallback(
    (mwp: MatchWithPartner) => {
      const key = `reveal-${mwp.match.id}`;
      if (sessionStorage.getItem(key)) {
        router.push(`/chat/${mwp.match.id}`);
      } else {
        setRevealMatch(mwp);
      }
    },
    [router]
  );

  const handleStartChat = useCallback(() => {
    if (!revealMatch) return;
    sessionStorage.setItem(`reveal-${revealMatch.match.id}`, "1");
    router.push(`/chat/${revealMatch.match.id}`);
  }, [revealMatch, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {matches.length === 0 ? (
        <WaitingScreen />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="font-display text-[22px] text-ink mb-1">Your matches</h1>
          <p className="text-sm text-ink-secondary mb-6">
            {matches.length} {matches.length === 1 ? "person" : "people"} aligned
            with your personality
          </p>
          <div className="flex flex-col gap-4">
            {matches.map((mwp) => (
              <MatchCard
                key={mwp.match.id}
                matchWithPartner={mwp}
                currentUserId={user?.id ?? ""}
                onConnect={() => handleConnect(mwp)}
                myAvatarConfig={profile?.avatar_config}
                myAvatarUrl={profile?.avatar_url}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Match reveal modal */}
      {revealMatch && (
        <MatchReveal
          partnerName={revealMatch.partner.first_name}
          score={Math.round(revealMatch.match.compatibility_score)}
          sharedHighlight={revealMatch.match.shared_highlights?.[0]}
          onStartChat={handleStartChat}
          myAvatarConfig={profile?.avatar_config}
          myAvatarUrl={profile?.avatar_url}
          partnerAvatarConfig={revealMatch.partner.avatar_config}
          partnerAvatarUrl={revealMatch.partner.avatar_url}
        />
      )}
    </div>
  );
}
