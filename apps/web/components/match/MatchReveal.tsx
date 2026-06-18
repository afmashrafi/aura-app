"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar3D } from "@/components/avatar/Avatar3D";
import type { AvatarConfig } from "@aura/types";

interface MatchRevealProps {
  partnerName: string;
  score: number;
  sharedHighlight?: string;
  onStartChat: () => void;
  myAvatarConfig?: AvatarConfig | null;
  myAvatarUrl?: string | null;
  partnerAvatarConfig?: AvatarConfig | null;
  partnerAvatarUrl?: string | null;
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ left: x, top: y, background: ["#C4AFF5", "#FFB0CC", "#9B7FE8", "#FFF"][Math.floor(Math.random() * 4)] }}
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 0.8, 0], rotate: [0, 180, 360] }}
      transition={{ delay, duration: 1.4, ease: "easeOut" }}
    />
  );
}

const SHARED_TAGS = ["Values", "Vibes", "Thoughts"];
const TAG_ICONS = ["💜", "✨", "💭"];

export function MatchReveal({
  partnerName,
  score,
  sharedHighlight,
  onStartChat,
  myAvatarConfig,
  myAvatarUrl,
  partnerAvatarConfig,
  partnerAvatarUrl,
}: MatchRevealProps) {
  const displayScore = useCountUp(score, 900);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCelebrate(true), 600);
    return () => clearTimeout(t);
  }, []);

  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 20 + Math.random() * 260,
    y: 20 + Math.random() * 180,
    delay: 0.5 + i * 0.06,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #F5F0FF 0%, #F9F7FF 50%, #FDE8EF 100%)" }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-40"
            style={{ background: "radial-gradient(circle, #C4AFF5, transparent 70%)" }} />
        </div>

        {/* Sparkles burst */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {sparkles.map((s) => <Sparkle key={s.id} {...s} />)}
        </div>

        {/* "It's a match!" */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="font-display font-black text-[32px] mb-1" style={{ color: "#1E1040" }}>
            It&apos;s a match! ✨
          </h1>
          <p className="text-base" style={{ color: "#9080B8" }}>
            You and {partnerName} vibe really well.
          </p>
        </motion.div>

        {/* Compatibility pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="mb-8 px-5 py-2 rounded-full font-bold text-sm text-white"
          style={{ background: "linear-gradient(135deg, #9B7FE8, #7B5BE0)" }}
        >
          {displayScore}% Compatibility
        </motion.div>

        {/* Avatar duo — in overlapping circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative flex items-center justify-center mb-8"
          style={{ width: 240, height: 130 }}
        >
          {/* My avatar circle */}
          <motion.div
            className="absolute left-0 w-[110px] h-[110px] rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EDE8FF 0%, #DDD6FE 100%)", boxShadow: "0 4px 20px rgba(155,127,232,0.25)" }}
            animate={celebrate ? { x: [0, -6, 0] } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Avatar3D avatarUrl={myAvatarUrl ?? null} avatarConfig={myAvatarConfig} name="Me" size={80} animate={celebrate} />
          </motion.div>

          {/* Heart center */}
          <motion.div
            className="absolute z-10"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "white" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 17s-8-5-8-11a4.5 4.5 0 019 0 4.5 4.5 0 019 0c0 6-10 11-10 11z" fill="#FF6B9D" />
              </svg>
            </div>
          </motion.div>

          {/* Partner avatar circle */}
          <motion.div
            className="absolute right-0 w-[110px] h-[110px] rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #FDE8EF 0%, #FBD0E0 100%)", boxShadow: "0 4px 20px rgba(255,107,157,0.2)" }}
            animate={celebrate ? { x: [0, 6, 0] } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Avatar3D avatarUrl={partnerAvatarUrl ?? null} avatarConfig={partnerAvatarConfig} name={partnerName} size={80} animate={celebrate} />
          </motion.div>
        </motion.div>

        {/* Shared traits pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex gap-5 mb-8"
        >
          {SHARED_TAGS.map((tag, i) => (
            <div key={tag} className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: "#EDE8FF" }}>
                {TAG_ICONS[i]}
              </div>
              <span className="text-xs font-medium" style={{ color: "#9080B8" }}>{tag}</span>
            </div>
          ))}
        </motion.div>

        {sharedHighlight && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.35 }}
            className="text-sm mb-6 px-4 py-2 rounded-2xl"
            style={{ color: "#4A3870", background: "rgba(155,127,232,0.1)" }}
          >
            You both said &ldquo;{sharedHighlight}&rdquo;
          </motion.p>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.35 }}
          className="w-full max-w-xs flex flex-col gap-3"
        >
          <button
            onClick={onStartChat}
            className="btn-glass-primary w-full py-4 rounded-2xl text-base font-bold"
          >
            Start Conversation
          </button>
          <button
            onClick={onStartChat}
            className="text-sm font-semibold"
            style={{ color: "#9B7FE8" }}
          >
            Maybe Later
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
