"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface MatchRevealProps {
  partnerName: string;
  score: number;
  sharedHighlight?: string;
  onStartChat: () => void;
}

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

export function MatchReveal({
  partnerName,
  score,
  sharedHighlight,
  onStartChat,
}: MatchRevealProps) {
  const displayScore = useCountUp(score, 800);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-8 text-center overflow-hidden"
      >
        {/* Radial glow pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: [0, 0.28, 0], scale: [0.95, 1.05, 1] }}
          transition={{ duration: 2.5, ease: "easeInOut", times: [0, 0.4, 1] }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, #A78BFA 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Interlocking circles avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative mb-8 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-20 h-20 rounded-full bg-primary-pale flex items-center justify-center font-display text-2xl text-primary font-semibold">
            M
          </div>
          <div className="w-20 h-20 rounded-full bg-surface-deep flex items-center justify-center font-display text-2xl text-primary font-semibold -ml-6">
            {partnerName.charAt(0).toUpperCase()}
          </div>
        </motion.div>

        {/* Score counter */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="font-display text-[42px] text-primary font-bold leading-none mb-2"
          aria-label={`${score}% compatibility score`}
        >
          {displayScore}%
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="font-display text-[22px] text-ink leading-snug mb-2"
        >
          You and {partnerName} are a match
        </motion.p>

        {sharedHighlight && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.35 }}
            className="text-sm text-ink-secondary mb-10"
          >
            You both said &ldquo;{sharedHighlight}&rdquo;
          </motion.p>
        )}

        {!sharedHighlight && <div className="mb-10" />}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.35 }}
          className="w-full max-w-xs"
        >
          <Button onClick={onStartChat} className="w-full">
            Start chatting
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
