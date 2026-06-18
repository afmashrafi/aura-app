"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getMatchesWithPartners, getUserAnswers, QUESTIONS } from "@aura/api";
import { useAuth } from "@/app/providers";
import { MatchCard } from "@/components/match/MatchCard";
import { MatchReveal } from "@/components/match/MatchReveal";
import type { MatchWithPartner } from "@aura/api";

function nameToColor(name: string) {
  const colors = ["#FFB3C6", "#FFD6A5", "#CAFFBF", "#A0C4FF", "#D4B8FF", "#FFC8DD", "#BDE0FE"];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return colors[Math.abs(h) % colors.length];
}

function DonutChart({ pct }: { pct: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#EFEFEF" strokeWidth="9" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="#000" strokeWidth="9"
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 44 44)"
        style={{ transition: "stroke-dasharray 0.9s ease-out" }}
      />
      <text x="44" y="44" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="800" fill="#000">
        {pct}%
      </text>
    </svg>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const w = 100, h = 36;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 6) + 3;
    const y = h - 3 - ((v - min) / range) * (h - 10);
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h}>
      <polyline fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * (w - 6) + 3;
        const y = h - 3 - ((v - min) / range) * (h - 10);
        return i === data.length - 1 ? <circle key={i} cx={x} cy={y} r="3" fill="#000" /> : null;
      })}
    </svg>
  );
}

export default function MatchesPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchWithPartner[]>([]);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revealMatch, setRevealMatch] = useState<MatchWithPartner | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMatchesWithPartners(user.id),
      getUserAnswers(user.id),
    ]).then(([m, a]) => {
      setMatches(m);
      setAnsweredCount(a.length);
    }).finally(() => setLoading(false));
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

  const journeyPct = Math.round((answeredCount / QUESTIONS.length) * 100);
  const avgCompat = matches.length > 0
    ? Math.round(matches.reduce((s, m) => s + m.match.compatibility_score, 0) / matches.length)
    : 0;

  const sparkData = avgCompat > 0
    ? [avgCompat - 14, avgCompat - 9, avgCompat - 5, avgCompat - 11, avgCompat - 4, avgCompat - 1, avgCompat].map(v => Math.max(0, Math.min(100, v)))
    : [30, 38, 29, 48, 52, 57, 63];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const firstName = profile?.first_name ?? "there";
  const currentQ = QUESTIONS[answeredCount] ?? QUESTIONS[QUESTIONS.length - 1];

  return (
    <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display font-black text-[24px] leading-tight text-black">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-sm text-[#6B7280] mt-0.5">Ready to make meaningful connections today?</p>
        </div>
        <button className="w-9 h-9 rounded-full bg-[#F5F5F5] flex items-center justify-center text-base shrink-0">
          🔔
        </button>
      </motion.div>

      {/* Pulse + Journey cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-[#F5F5F5] rounded-2xl p-4 flex flex-col"
        >
          <p className="text-[10px] font-semibold text-[#6B7280] mb-0.5 uppercase tracking-wide">Compatibility pulse</p>
          <p className="font-black text-[28px] text-black leading-none">{avgCompat > 0 ? `${avgCompat}%` : "--"}</p>
          <p className="text-[10px] text-[#9CA3AF] mb-2">Match potential</p>
          <div className="mt-auto">
            <Sparkline data={sparkData} />
            {avgCompat > 0 && (
              <span className="mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded-full">
                ↑ Growing
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#F5F5F5] rounded-2xl p-4 flex flex-col items-center text-center"
        >
          <p className="text-[10px] font-semibold text-[#6B7280] mb-2 uppercase tracking-wide">Your journey</p>
          <DonutChart pct={journeyPct} />
          <p className="font-bold text-xs text-black mt-1.5">Keep going!</p>
          <p className="text-[10px] text-[#6B7280] mt-0.5 leading-tight">Answer more to unlock better matches.</p>
          <button
            onClick={() => router.push("/questionnaire")}
            className="mt-2.5 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#111] transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </div>

      {/* Recommended for you */}
      {matches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mb-3"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-sm text-black">Recommended for you</h2>
            <button onClick={() => router.push("/liked")} className="text-xs text-[#6B7280] hover:text-black transition-colors">View all →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5" style={{ scrollbarWidth: "none" }}>
            {matches.slice(0, 6).map((mwp, idx) => {
              const color = nameToColor(mwp.partner.first_name);
              const score = Math.round(mwp.match.compatibility_score);
              return (
                <motion.button
                  key={mwp.match.id}
                  onClick={() => handleConnect(mwp)}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  className="flex-none w-[120px] bg-[#F5F5F5] rounded-2xl p-3 text-left hover:bg-[#EFEFEF] transition-colors"
                >
                  <div className="relative mb-2">
                    <div
                      className="w-full aspect-square rounded-xl flex items-center justify-center text-2xl font-black leading-none"
                      style={{ background: color }}
                    >
                      {mwp.partner.first_name[0]}
                    </div>
                    <span className="absolute top-1.5 left-1.5 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {score}%
                    </span>
                  </div>
                  <p className="font-semibold text-xs text-black truncate">{mwp.partner.first_name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="text-[9px] bg-white rounded-full px-1.5 py-0.5 text-[#6B7280]">Compatible</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Continue answering */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        onClick={() => router.push("/questionnaire")}
        className="w-full bg-[#F5F5F5] rounded-2xl p-4 text-left hover:bg-[#EFEFEF] transition-colors mb-3 flex items-center gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-black">Continue answering</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">Question {Math.min(answeredCount + 1, QUESTIONS.length)} / {QUESTIONS.length}</p>
          {currentQ && <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">{currentQ.text}</p>}
        </div>
        <div className="shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm">→</div>
      </motion.button>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="grid grid-cols-3 border border-[#E5E5E5] rounded-2xl overflow-hidden mb-6"
      >
        {[
          { icon: "♡", value: matches.length, label: "New Matches" },
          { icon: "💬", value: 0,             label: "Conversations" },
          { icon: "✦", value: `${avgCompat}%`, label: "Avg Compat." },
        ].map((s, i) => (
          <div key={s.label} className={`py-3.5 flex flex-col items-center ${i < 2 ? "border-r border-[#E5E5E5]" : ""}`}>
            <span className="text-sm mb-0.5">{s.icon}</span>
            <span className="font-black text-base text-black leading-none">{s.value}</span>
            <span className="text-[9px] text-[#6B7280] mt-0.5 text-center">{s.label}</span>
          </div>
        ))}
      </motion.div>

      {/* Full match list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
        </div>
      ) : matches.length > 0 ? (
        <div>
          <h2 className="text-sm font-bold text-black mb-3">All matches</h2>
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
        <div className="text-center py-10">
          <div className="w-14 h-14 bg-[#F5F5F5] rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">✦</div>
          <p className="font-bold text-sm text-black mb-1">Finding your match</p>
          <p className="text-xs text-[#6B7280] max-w-xs mx-auto">Answer more questions to improve your compatibility score and unlock matches.</p>
          <button onClick={() => router.push("/questionnaire")} className="mt-4 bg-black text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#111] transition-colors">
            Start answering →
          </button>
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
