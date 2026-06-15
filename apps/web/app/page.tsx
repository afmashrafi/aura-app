"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const PILLS = [
  { text: "INTJ",          rotate: "-6deg",  delay: 0,    x: "6%",   y: "10%" },
  { text: "bookworm",      rotate: "5deg",   delay: 0.1,  x: "70%",  y: "7%"  },
  { text: "anime fan",     rotate: "-4deg",  delay: 0.15, x: "78%",  y: "26%" },
  { text: "night owl",     rotate: "7deg",   delay: 0.2,  x: "4%",   y: "36%" },
  { text: "music lover",   rotate: "-8deg",  delay: 0.05, x: "60%",  y: "54%" },
  { text: "film buff",     rotate: "4deg",   delay: 0.25, x: "8%",   y: "60%" },
  { text: "deep thinker",  rotate: "-5deg",  delay: 0.3,  x: "72%",  y: "70%" },
  { text: "coffee addict", rotate: "6deg",   delay: 0.1,  x: "12%",  y: "78%" },
  { text: "ENFP",          rotate: "-3deg",  delay: 0.35, x: "54%",  y: "84%" },
  { text: "poet",          rotate: "8deg",   delay: 0.2,  x: "80%",  y: "88%" },
];

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(160deg, #ABABFF 0%, #BFBFFF 30%, #D3D3FF 60%, #F3F3FF 100%)" }}
    >
      {/* Soft radial glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute w-[560px] h-[560px] rounded-full -top-40 -left-40 opacity-40"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent 65%)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -bottom-24 -right-24 opacity-30"
          style={{ background: "radial-gradient(circle, #E6E6FF, transparent 65%)" }} />
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
            animate={{ y: [0, i % 2 === 0 ? -7 : 7, 0] }}
            transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            className="glass-float inline-block px-4 py-2 rounded-full text-sm font-semibold"
            style={{ rotate: pill.rotate, color: "#5B5B8A" }}
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
          className="mb-7"
        >
          <div
            className="glass w-20 h-20 mx-auto rounded-[28px] flex items-center justify-center"
          >
            <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
              <circle cx="11" cy="16" r="9" fill="#8080FF" opacity="0.7" />
              <circle cx="21" cy="16" r="9" fill="#ABABFF" opacity="0.65" />
            </svg>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="font-brand text-[76px] leading-none mb-4 tracking-tight"
          style={{ color: "#1E1B4B" }}
        >
          Aura
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="text-[22px] font-display font-semibold leading-snug mb-3"
          style={{ color: "#3D3A7A" }}
        >
          Connect beyond the surface.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="text-base leading-relaxed mb-10"
          style={{ color: "#7070AA" }}
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
            className="btn-glass-primary h-14 flex items-center justify-center rounded-2xl font-semibold text-base text-white"
          >
            Create your account
          </Link>
          <Link
            href="/sign-in"
            className="btn-glass-ghost h-14 flex items-center justify-center rounded-2xl font-semibold text-base"
            style={{ color: "#3D3A7A" }}
          >
            Sign in
          </Link>
        </motion.div>

        {/* Trust tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-10 flex items-center gap-5"
        >
          {["Personality-first", "Privacy-focused", "No photos"].map((tag, i) => (
            <span key={tag} className="flex items-center gap-2 text-xs font-medium" style={{ color: "#9090BB" }}>
              {i !== 0 && <span className="w-1 h-1 rounded-full" style={{ background: "#BFBFFF" }} />}
              {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
