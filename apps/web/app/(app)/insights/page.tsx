"use client";
import { motion } from "framer-motion";

const STATS = [
  { label: "Questions answered", value: "--", icon: "❓" },
  { label: "Matches found",      value: "--", icon: "♡" },
  { label: "Avg compatibility",  value: "--", icon: "✦" },
  { label: "Days active",        value: "--", icon: "🔥" },
];

export default function InsightsPage() {
  return (
    <div className="px-5 pt-6 pb-10 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-black text-[26px] text-black mb-1">Your Insights</h1>
        <p className="text-sm text-[#6B7280] mb-8">A deeper look at your compatibility journey.</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-[#F5F5F5] rounded-2xl p-5 flex flex-col"
          >
            <span className="text-xl mb-2">{s.icon}</span>
            <p className="font-black text-2xl text-black leading-none mb-1">{s.value}</p>
            <p className="text-xs text-[#6B7280]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-black rounded-2xl p-6 text-center"
      >
        <p className="text-white font-bold text-base mb-1">Full insights coming soon</p>
        <p className="text-white/60 text-sm">We&apos;re building detailed personality analytics, compatibility breakdowns, and trend charts.</p>
      </motion.div>
    </div>
  );
}
