"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import type { MatchWithPartner } from "@aura/api";
import type { AvatarConfig } from "@aura/types";

interface MatchCardProps {
  matchWithPartner: MatchWithPartner;
  currentUserId: string;
  onConnect: () => void;
  myAvatarConfig?: AvatarConfig | null;
  myAvatarUrl?: string | null;
}

export function MatchCard({ matchWithPartner, onConnect, myAvatarConfig }: MatchCardProps) {
  const { match, partner } = matchWithPartner;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F5F5F5] rounded-2xl overflow-hidden"
    >
      <div className="p-4 flex items-center gap-4">
        <div className="shrink-0">
          <Avatar3D avatarUrl={null} avatarConfig={partner.avatar_config} name={partner.first_name} size={56} animate />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-black text-sm">{partner.first_name}</p>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {Math.round(match.compatibility_score)}%
            </span>
          </div>
          {match.shared_highlights && match.shared_highlights.length > 0 && (
            <p className="text-xs text-[#6B7280] truncate">{match.shared_highlights.slice(0, 2).join(" · ")}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          {(partner.bio || (partner.prompt_responses && partner.prompt_responses.length > 0)) ? (
            <button
              onClick={() => setExpanded(v => !v)}
              className="text-xs text-[#6B7280] font-medium px-3 py-1.5 border border-[#E5E5E5] rounded-lg bg-white hover:bg-[#F5F5F5] transition-colors"
            >
              {expanded ? "Less" : "View"}
            </button>
          ) : null}
          <button
            onClick={onConnect}
            className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#111] transition-colors"
          >
            Chat
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-[#E5E5E5] px-4 py-4 flex flex-col gap-3">
              {partner.bio && (
                <p className="text-sm text-[#111] leading-relaxed">{partner.bio}</p>
              )}
              {partner.prompt_responses && partner.prompt_responses.slice(0, 2).map((pr, i) => (
                <div key={i} className="bg-white rounded-xl p-3">
                  <p className="text-xs text-[#6B7280] mb-1">{pr.prompt}</p>
                  <p className="text-sm text-black font-medium">{pr.answer}</p>
                </div>
              ))}
              <button onClick={onConnect} className="w-full bg-black text-white font-bold py-3 rounded-xl text-sm hover:bg-[#111] transition-colors mt-1">
                Start conversation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export { MatchCard as default };
