"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PILLS = [
  { text: "INTJ",          rotate: "-6deg",  delay: 0,    x: "8%",   y: "12%" },
  { text: "bookworm",      rotate: "5deg",   delay: 0.1,  x: "72%",  y: "8%"  },
  { text: "anime fan",     rotate: "-4deg",  delay: 0.15, x: "80%",  y: "28%" },
  { text: "night owl",     rotate: "7deg",   delay: 0.2,  x: "5%",   y: "38%" },
  { text: "music lover",   rotate: "-8deg",  delay: 0.05, x: "62%",  y: "55%" },
  { text: "film buff",     rotate: "4deg",   delay: 0.25, x: "10%",  y: "62%" },
  { text: "deep thinker",  rotate: "-5deg",  delay: 0.3,  x: "74%",  y: "72%" },
  { text: "coffee addict", rotate: "6deg",   delay: 0.1,  x: "15%",  y: "80%" },
  { text: "ENFP",          rotate: "-3deg",  delay: 0.35, x: "55%",  y: "85%" },
  { text: "poet",          rotate: "8deg",   delay: 0.2,  x: "82%",  y: "88%" },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(145deg, #2D1B69 0%, #4C1D95 35%, #6D28D9 70%, #7C3AED 100%)" }}
    >
      {/* Soft glow orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 -top-48 -left-48"
          style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 -bottom-32 -right-32"
          style={{ background: "radial-gradient(circle, #C4B5FD, transparent 70%)" }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, #DDD6FE, transparent 70%)" }} />
      </div>

      {/* Floating personality pills */}
      {PILLS.map((pill, i) => (
        <motion.div
          key={pill.text}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + pill.delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute hidden sm:block pointer-events-none select-none"
          style={{ left: pill.x, top: pill.y }}
        >
          <motion.span
            animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
            transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            className="inline-block px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border"
            style={{
              rotate: pill.rotate,
              background: "rgba(255,255,255,0.12)",
              borderColor: "rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {pill.text}
          </motion.span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto rounded-[28px] flex items-center justify-center mb-0"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
              <circle cx="11" cy="16" r="9" fill="white" opacity="0.7" />
              <circle cx="21" cy="16" r="9" fill="white" opacity="0.45" />
            </svg>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-brand text-[72px] leading-none text-white mb-4 tracking-tight"
        >
          Aura
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-[22px] font-display font-medium leading-snug mb-3"
          style={{ color: "rgba(255,255,255,0.9)" }}
        >
          Connect beyond the surface.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="text-base leading-relaxed mb-10"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          No photos. No swiping. Just real compatibility<br />based on who you actually are.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="flex flex-col gap-3 w-full"
        >
          <Link
            href="/sign-up"
            className="h-14 flex items-center justify-center rounded-2xl font-semibold text-base transition-all duration-200 active:scale-[0.97] hover:opacity-95"
            style={{ background: "white", color: "#5B21B6" }}
          >
            Create your account
          </Link>
          <Link
            href="/sign-in"
            className="h-14 flex items-center justify-center rounded-2xl font-semibold text-base transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "white",
              border: "1.5px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
            }}
          >
            Sign in
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 flex items-center gap-6"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          {["Personality-first", "Privacy-focused", "No photos"].map((tag, i) => (
            <span key={tag} className="flex items-center gap-2 text-xs font-medium">
              {i !== 0 && <span className="w-1 h-1 rounded-full bg-white/30" />}
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
