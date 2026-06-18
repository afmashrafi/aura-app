"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function LikedYouPage() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <h2 className="font-display font-black mb-1" style={{ fontSize: "clamp(24px, 7vw, 30px)", color: "#1E1040" }}>
        People who liked you
      </h2>
      <p className="text-sm mb-8" style={{ color: "#9080B8" }}>
        Complete your profile to unlock who's interested in you.
      </p>

      {/* Blurred preview cards */}
      <div className="relative">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="mb-3 rounded-3xl overflow-hidden relative"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 2px 16px rgba(155,127,232,0.10)",
              filter: i === 1 ? "none" : "blur(6px)",
              opacity: i === 1 ? 1 : 0.5 - i * 0.1,
            }}
          >
            <div className="p-5 flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${["#EDE8FF,#C4AFF5", "#FDE8EF,#FBC8D8", "#E8F5FF,#C8DFF5"][i - 1]})` }}
              >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="10" r="6" fill="rgba(155,127,232,0.5)"/>
                  <path d="M4 26c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="rgba(155,127,232,0.4)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-4 rounded-full mb-2 w-24" style={{ background: "#E3D9FF" }} />
                <div className="h-3 rounded-full w-16" style={{ background: "#EDE8FF" }} />
              </div>
              <div
                className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "#EDE8FF", color: "#9B7FE8" }}
              >
                {85 + i * 4}%
              </div>
            </div>
          </motion.div>
        ))}

        {/* Unlock overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl">
          <div
            className="rounded-3xl p-6 mx-4 flex flex-col items-center text-center gap-3"
            style={{ background: "rgba(255,255,255,0.95)", boxShadow: "0 8px 40px rgba(155,127,232,0.18)" }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: "#EDE8FF" }}>
              💜
            </div>
            <h3 className="font-display font-bold text-lg" style={{ color: "#1E1040" }}>
              People who liked you
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#9080B8" }}>
              Answer more questions and complete your profile to see who&apos;s interested in you.
            </p>
            <Link
              href="/profile-setup"
              className="btn-glass-primary px-6 py-3 rounded-full text-sm font-bold mt-1"
            >
              Complete profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
