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
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * target));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return count;
}

export function MatchReveal({ partnerName, score, sharedHighlight, onStartChat, myAvatarConfig, partnerAvatarConfig }: MatchRevealProps) {
  const displayScore = useCountUp(score);
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 400); return () => clearTimeout(t); }, []);

  const highlights = ["Similar values", "Shared interests", "Great conversations ahead"];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <p className="text-sm text-[#6B7280] mb-1">Finding your match</p>
          <h1 className="font-display font-black text-[28px] text-black mb-1">It&apos;s a match! ✦</h1>
          <p className="text-sm text-[#6B7280]">You and {partnerName} have great compatibility.</p>
        </motion.div>

        {/* Score pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 px-5 py-2 rounded-full font-bold text-sm bg-black text-white"
        >
          {displayScore}% Compatibility
        </motion.div>

        {/* Avatar duo in circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 200, damping: 20 }}
          className="relative mb-8"
          style={{ width: 240, height: 140 }}
        >
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#E5E5E5]"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ width: 220, height: 120, top: 10, left: 10, borderRadius: 999 }}
          />
          <div className="absolute left-0 w-28 h-28 rounded-full bg-[#F5F5F5] border-4 border-white flex items-center justify-center" style={{ top: 6 }}>
            <Avatar3D avatarUrl={null} avatarConfig={myAvatarConfig} name="Me" size={80} animate={show} />
          </div>
          <div className="absolute right-0 w-28 h-28 rounded-full bg-[#F5F5F5] border-4 border-white flex items-center justify-center" style={{ top: 6 }}>
            <Avatar3D avatarUrl={null} avatarConfig={partnerAvatarConfig} name={partnerName} size={80} animate={show} />
          </div>
          <motion.div
            className="absolute z-10 w-9 h-9 bg-black rounded-full flex items-center justify-center text-white text-sm"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            ♡
          </motion.div>
        </motion.div>

        {/* Highlights */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-8 text-left">
          {highlights.map((h, i) => (
            <motion.div
              key={h}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="flex items-center gap-2 mb-2 text-sm text-[#111]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              {h}
            </motion.div>
          ))}
          {sharedHighlight && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-2 mb-2 text-sm text-[#111]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
              You both said &ldquo;{sharedHighlight}&rdquo;
            </motion.div>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="w-full max-w-xs flex flex-col gap-3">
          <button onClick={onStartChat} className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base hover:bg-[#111] transition-colors">
            Start a conversation
          </button>
          <button onClick={onStartChat} className="text-sm text-[#6B7280] font-medium">
            Keep discovering
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
