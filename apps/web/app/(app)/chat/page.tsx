"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getMatchesWithPartners } from "@aura/api";
import { useAuth } from "@/app/providers";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import type { MatchWithPartner } from "@aura/api";

export default function ChatListPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchWithPartner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMatchesWithPartners(user.id).then((data) => {
      setMatches(data);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2
        className="font-display font-black mb-5"
        style={{ fontSize: "clamp(24px, 7vw, 32px)", color: "#1E1B4B" }}
      >
        Chats
      </h2>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#F0F0FF" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke="#8080FF"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="font-semibold text-ink mb-1">No chats yet</p>
          <p className="text-sm text-ink-muted">
            When you match with someone, your conversations will appear here.
          </p>
          <Link
            href="/matches"
            className="mt-5 text-sm font-semibold underline-offset-2 underline"
            style={{ color: "#8080FF" }}
          >
            View matches
          </Link>
        </div>
      )}

      {!loading && matches.length > 0 && (
        <div className="flex flex-col gap-2">
          {matches.map(({ match, partner }, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <Link
                href={`/chat/${match.id}`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98]"
                style={{ background: "#FFFFFF", boxShadow: "0 1px 8px rgba(128,128,255,0.08)" }}
              >
                <div className="shrink-0">
                  <Avatar3D
                    avatarConfig={partner.avatar_config}
                    avatarUrl={partner.avatar_url}
                    size={48}
                    name={partner.first_name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">{partner.first_name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {Math.round((match.compatibility_score ?? 0) * 100)}% compatibility
                  </p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-ink-muted">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
