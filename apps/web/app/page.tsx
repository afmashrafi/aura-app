"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Floating orb — purely decorative background shape
function Orb({ cx, cy, r, color, opacity, delay = 0 }: {
  cx: string; cy: string; r: string; color: string; opacity: number; delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: cx, top: cy, width: r, height: r,
        background: `radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
      animate={{ scale: [1, 1.08, 1], opacity: [opacity, opacity * 1.3, opacity] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0D0820 0%, #1A1040 40%, #0F0B2E 100%)" }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <Orb cx="20%"  cy="25%"  r="420px" color="#8080FF" opacity={0.18} delay={0} />
        <Orb cx="80%"  cy="15%"  r="320px" color="#ABABFF" opacity={0.12} delay={2} />
        <Orb cx="55%"  cy="70%"  r="500px" color="#6060CC" opacity={0.15} delay={1} />
        <Orb cx="90%"  cy="85%"  r="260px" color="#C0A0FF" opacity={0.10} delay={3} />
        {/* Noise-like grain layer */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "128px" }} />
      </div>

      {/* Top brand strip */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 pt-14 pb-2"
      >
        <span className="font-brand text-2xl text-white/90 tracking-tight">Aura</span>
        <Link
          href="/sign-in"
          className="text-sm font-semibold text-white/60 hover:text-white transition-colors"
        >
          Sign in
        </Link>
      </motion.div>

      {/* Hero — fills the rest of the screen */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 pb-12 pt-8">

        {/* Big headline */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-[0.9] tracking-tight uppercase"
            style={{ fontSize: "clamp(56px, 16vw, 88px)", color: "#FFFFFF" }}
          >
            FIND
            <br />
            <span style={{ color: "#ABABFF" }}>YOUR</span>
            <br />
            AURA
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mt-5 text-base leading-relaxed max-w-xs"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            No photos. No swiping. Real compatibility — based entirely on who you actually are.
          </motion.p>
        </div>

        {/* Floating personality badges — scattered around middle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="hidden sm:block relative h-40 my-4"
          aria-hidden="true"
        >
          {[
            { text: "INTJ",         left: "3%",  top: "10%", r: "-6deg"  },
            { text: "bookworm",     left: "55%", top: "0%",  r: "4deg"   },
            { text: "deep thinker", left: "68%", top: "50%", r: "-5deg"  },
            { text: "music lover",  left: "5%",  top: "60%", r: "7deg"   },
            { text: "ENFP",         left: "38%", top: "72%", r: "-3deg"  },
            { text: "night owl",    left: "78%", top: "15%", r: "5deg"   },
          ].map((p, i) => (
            <motion.span
              key={p.text}
              className="absolute inline-block px-4 py-2 rounded-full text-sm font-semibold select-none"
              style={{
                left: p.left, top: p.top, rotate: p.r,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(171,171,255,0.25)",
                color: "rgba(171,171,255,0.85)",
                backdropFilter: "blur(10px)",
              }}
              animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              {p.text}
            </motion.span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <Link
              href="/sign-up"
              className="flex items-center justify-center w-full h-14 rounded-full font-bold text-base text-white transition-all active:scale-[0.97]"
              style={{ background: "#8080FF", boxShadow: "0 8px 32px rgba(128,128,255,0.45)" }}
            >
              Create account
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.5 }}
          >
            <Link
              href="/sign-in"
              className="flex items-center justify-center w-full h-14 rounded-full font-bold text-base transition-all active:scale-[0.97]"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Sign in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Personality-first · Privacy-focused · No photos
          </motion.p>
        </div>
      </div>
    </div>
  );
}
