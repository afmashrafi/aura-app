"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getMatchesWithPartners } from "@aura/api";
import { useAuth } from "@/app/providers";
import { MatchCard } from "@/components/match/MatchCard";
import { MatchReveal } from "@/components/match/MatchReveal";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import type { MatchWithPartner } from "@aura/api";
import type { AvatarConfig } from "@aura/types";

function JourneyProgress({ completed, total }: { completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1.5">
        <span>Your journey</span>
        <span className="font-semibold text-black">{pct}% complete</span>
      </div>
      <div className="h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-black rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FloatingAvatarDisplay({ myConfig, partnerConfig, myName, partnerName }: {
  myConfig: AvatarConfig | null;
  partnerConfig: AvatarConfig | null;
  myName: string; partnerName: string;
}) {
  return (
    <div className="relative flex items-center justify-center" style={{ height: 200 }}>
      {/* Dotted ring */}
      <div
        className="absolute rounded-full border-2 border-dashed border-[#E5E5E5]"
        style={{ width: 220, height: 220 }}
      />
      {/* My avatar */}
      <motion.div
        className="absolute"
        style={{ left: "10%" }}
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Avatar3D avatarUrl={null} avatarConfig={myConfig} name={myName} size={88} animate />
      </motion.div>
      {/* Diamond */}
      <div className="absolute z-10 w-8 h-8 bg-white border border-[#E5E5E5] rounded-lg flex items-center justify-center text-sm rotate-45">
        <span className="-rotate-45">✦</span>
      </div>
      {/* Partner avatar */}
      <motion.div
        className="absolute"
        style={{ right: "10%" }}
        animate={{ y: [4, -4, 4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Avatar3D avatarUrl={null} avatarConfig={partnerConfig} name={partnerName} size={88} animate />
      </motion.div>
      {/* Caption */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <p className="text-xs font-medium text-[#6B7280]">Matches that matter</p>
        <p className="text-xs text-[#6B7280]">We focus on compatibility, values,</p>
        <p className="text-xs text-[#6B7280]">and real connections.</p>
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
    getMatchesWithPartners(user.id).then(setMatches).finally(() => setLoading(false));
  }, [user]);

  const handleConnect = useCallback((mwp: MatchWithPartner) => {
    const key = `reveal-${mwp.match.id}`;
    if (sessionStorage.getItem(key)) {
      router.push(`/chat/${mwp.match.id}`);
    } else {
      setRevealMatch(mwp);
    }
  }, [router]);

  const handleStartChat = useCallback(() => {
    if (!revealMatch) return;
    sessionStorage.setItem(`reveal-${revealMatch.match.id}`, "1");
    router.push(`/chat/${revealMatch.match.id}`);
  }, [revealMatch, router]);

  const TOTAL_Q = 30;
  const completed = 15; // placeholder

  const firstMatch = matches[0];

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm text-[#6B7280] mb-1">Welcome back,</p>
        <h1 className="font-display font-black text-[32px] leading-tight text-black mb-6">
          Find your<br />perfect match
        </h1>
        <p className="text-sm text-[#6B7280] mb-6">We match you based on who you are, not what you look like.</p>

        {/* Answer CTA */}
        <button
          onClick={() => router.push("/questionnaire")}
          className="bg-black text-white text-sm font-semibold px-5 py-3 rounded-xl mb-8 hover:bg-[#111] transition-colors"
        >
          Answer new questions
        </button>
      </motion.div>

      {/* Avatar display */}
      <div className="bg-[#F5F5F5] rounded-3xl p-6 mb-6">
        <FloatingAvatarDisplay
          myConfig={profile?.avatar_config ?? null}
          partnerConfig={firstMatch?.partner.avatar_config ?? null}
          myName={profile?.first_name ?? "Me"}
          partnerName={firstMatch?.partner.first_name ?? "?"}
        />
      </div>

      {/* Journey */}
      <div className="bg-[#F5F5F5] rounded-2xl p-5 mb-4">
        <JourneyProgress completed={completed} total={TOTAL_Q} />
        <div className="mt-4">
          <button
            onClick={() => router.push("/questionnaire")}
            className="w-full flex items-center justify-between py-3 border-t border-[#E5E5E5] text-sm font-medium text-black hover:bg-[#EFEFEF] -mx-5 px-5 transition-colors rounded-b-2xl"
          >
            <div>
              <p className="font-semibold">Continue answering</p>
              <p className="text-xs text-[#6B7280] font-normal">Discover matches that truly align with you.</p>
            </div>
            <span className="text-[#6B7280]">→</span>
          </button>
        </div>
      </div>

      {/* Today's progress */}
      <div className="bg-[#F5F5F5] rounded-2xl px-5 py-4 mb-6 flex gap-6">
        <div className="flex items-center gap-2 text-sm">
          <span>♡</span>
          <span className="font-semibold text-black">{matches.length}</span>
          <span className="text-[#6B7280]">new matches</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>💬</span>
          <span className="font-semibold text-black">0</span>
          <span className="text-[#6B7280]">conversations</span>
        </div>
      </div>

      {/* Matches */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div>
          <h2 className="text-base font-bold text-black mb-3">Your matches</h2>
          <div className="flex flex-col gap-3">
            {matches.map((mwp) => (
              <MatchCard
                key={mwp.match.id}
                matchWithPartner={mwp}
                currentUserId={user?.id ?? ""}
                onConnect={() => handleConnect(mwp)}
                myAvatarConfig={profile?.avatar_config}
                myAvatarUrl={null}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">♡</div>
          <p className="font-semibold text-black mb-1">Finding your match</p>
          <p className="text-sm text-[#6B7280]">Answer more questions to improve your compatibility score.</p>
        </div>
      )}

      {revealMatch && (
        <MatchReveal
          partnerName={revealMatch.partner.first_name}
          score={Math.round(revealMatch.match.compatibility_score)}
          sharedHighlight={revealMatch.match.shared_highlights?.[0]}
          onStartChat={handleStartChat}
          myAvatarConfig={profile?.avatar_config}
          myAvatarUrl={null}
          partnerAvatarConfig={revealMatch.partner.avatar_config}
          partnerAvatarUrl={null}
        />
      )}
    </div>
  );
}
