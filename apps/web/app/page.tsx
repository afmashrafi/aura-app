"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Floating blobs */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary-light opacity-[0.06] -top-32 -left-32 animate-blob" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-primary opacity-[0.05] top-1/2 -right-24 animate-blob-delay" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-primary-light opacity-[0.06] -bottom-24 left-1/3 animate-blob-slow" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="relative z-10 flex flex-col items-center text-center max-w-sm w-full"
      >
        {/* Logo mark */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8 flex items-center justify-center w-16 h-16 rounded-[20px] bg-primary-pale"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="11" cy="16" r="9" fill="#7C3AED" opacity="0.6" />
            <circle cx="21" cy="16" r="9" fill="#A78BFA" opacity="0.6" />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="font-display text-[42px] leading-tight text-ink mb-3"
        >
          Aura
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="text-lg text-ink-secondary mb-10 leading-relaxed"
        >
          Meet someone who actually gets you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-col gap-3 w-full"
        >
          <Link
            href="/sign-up"
            className="inline-flex h-13 items-center justify-center rounded-[14px] bg-primary text-white font-medium text-base transition-all duration-150 active:scale-[0.97] hover:bg-[#6D28D9] shadow-[0_2px_16px_rgba(124,58,237,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Create account
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-13 items-center justify-center rounded-[14px] bg-transparent text-primary border border-primary font-medium text-base transition-all duration-150 active:scale-[0.97] hover:bg-primary-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            Sign in
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-8 text-sm text-ink-muted"
        >
          No photos. No swiping. Just real compatibility.
        </motion.p>
      </motion.div>
    </div>
  );
}
