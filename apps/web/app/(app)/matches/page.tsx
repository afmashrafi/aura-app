"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getMatchesWithPartners } from "@aura/api";
import { useAuth } from "@/app/providers";
import { MatchCard } from "@/components/match/MatchCard";
import { MatchReveal } from "@/components/match/MatchReveal";
import type { MatchWithPartner } from "@aura/api";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function HeartOrb() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 200, height: 200, background: "radial-gradient(circle, rgba(196,175,245,0.35) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 160, height: 160, background: "radial-gradient(circle, rgba(155,127,232,0.25) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* Glass sphere */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 120, height: 120,
          background: "radial-gradient(circle at 38% 32%, rgba(255,255,255,0.95) 0%, rgba(196,175,245,0.7) 35%, rgba(123,91,224,0.5) 70%, rgba(100,60,200,0.3) 100%)",
          boxShadow: "0 8px 40px rgba(155,127,232,0.45), inset 0 -4px 16px rgba(100,60,200,0.2)",
        }}
        animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Heart inside orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.svg
            width="44" height="44" viewBox="0 0 44 44" fill="none"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <path
              d="M22 37s-17-10.4-17-22a9.5 9.5 0 0119 0 9.5 9.5 0 0119 0c0 11.6-21 22-21 22z"
              fill="white"
              opacity="0.92"
            />
          </motion.svg>
        </div>
      </motion.div>
      {/* Sparkles */}
      {[[0, 30], [170, 20], [155, 145], [15, 145]].map(([x, y], i) => (
        <motion.span
          key={i}
          className="absolute text-base select-none"
          style={{ left: x, top: y, color: "#C4AFF5" }}
          animate={{ opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
        >✦</motion.span>
      ))}
    </div>
  );
}

function FindingScreen() {
  const [progress] = useState(() => 60 + Math.floor(Math.random() * 30));
  return (
    <div className="flex flex-col items-center justify-center min-h-[55vh] px-8 text-center gap-6">
      <HeartOrb />
      <div>
        <h2 className="font-display font-bold text-[26px] mb-1" style={{ color: "#1E1040" }}>
          Finding your perfect aura…
        </h2>
        <p className="text-sm" style={{ color: "#9080B8" }}>This may take a few seconds ✦</p>
      </div>
      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#E3D9FF" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #9B7FE8, #C4AFF5)" }}
            initial={{ width: "40%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs mt-2 text-right font-medium" style={{ color: "#9B7FE8" }}>{progress}%</p>
      </div>
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
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#C4AFF5", borderTopColor: "#9B7FE8" }} />
      </div>
    );
  }

  const noMatches = matches.length === 0;

  return (
    <>
      <div className="max-w-lg mx-auto px-4 pb-24">
        {/* Greeting header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-5 pb-4"
        >
          <p className="text-base font-medium" style={{ color: "#9080B8" }}>
            {getGreeting()}, {profile?.first_name ?? "there"} 👋
          </p>
          <p className="text-sm" style={{ color: "#C4AFF5" }}>Ready for real connection?</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {noMatches ? (
            <motion.div
              key="finding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <FindingScreen />
              <p className="text-sm mt-2 max-w-xs leading-relaxed" style={{ color: "#9080B8" }}>
                We&apos;re looking for people who align with your answers. You&apos;ll be notified the moment we find a great match.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="matches"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Hero card — heart orb + CTA */}
              <div
                className="rounded-3xl p-6 mb-6 flex flex-col items-center text-center overflow-hidden relative"
                style={{ background: "linear-gradient(145deg, #EDE8FF 0%, #F5F0FF 50%, #EDE8FF 100%)" }}
              >
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 30%, rgba(196,175,245,0.4) 0%, transparent 70%)" }} />
                <HeartOrb />
                <h2 className="font-display font-bold text-[22px] mt-2 mb-1" style={{ color: "#1E1040" }}>
                  Let&apos;s find your next aura
                </h2>
                <p className="text-sm mb-5" style={{ color: "#9080B8" }}>
                  We&apos;ll find someone who truly vibes with you.
                </p>
                <button
                  className="btn-glass-primary px-7 py-3 rounded-full font-bold text-base flex items-center gap-2"
                  onClick={() => router.push("/matches")}
                >
                  Find my match
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              {/* Matches list */}
              <div className="mb-4">
                <h3 className="font-display font-bold text-[18px] mb-1" style={{ color: "#1E1040" }}>
                  Your matches
                </h3>
                <p className="text-sm" style={{ color: "#9080B8" }}>
                  {matches.length} {matches.length === 1 ? "person" : "people"} aligned with your personality
                </p>
              </div>

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
        </AnimatePresence>
      </div>

      {/* Match reveal modal */}
      {revealMatch && (
        <MatchReveal
          partnerName={revealMatch.partner.first_name}
          score={Math.round(revealMatch.match.compatibility_score)}
          sharedHighlight={revealMatch.match.shared_highlights?.[0]}
          onStartChat={handleStartChat}
          myAvatarConfig={profile?.avatar_config}
          myAvatarUrl={profile?.avatar_url ?? null}
          partnerAvatarConfig={revealMatch.partner.avatar_config}
          partnerAvatarUrl={revealMatch.partner.avatar_url}
        />
      )}
    </>
  );
}
