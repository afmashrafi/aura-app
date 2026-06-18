"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
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

// Particle that flies out from center on celebrate
function ConfettiParticle({ delay, color }: { delay: number; color: string }) {
  const angle = Math.random() * 360;
  const distance = 60 + Math.random() * 80;
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad) * distance;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-sm"
      style={{ background: color, top: "50%", left: "50%", marginLeft: -4, marginTop: -4 }}
      initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, x * 0.5, x],
        y: [0, y * 0.5, y],
        rotate: [0, angle],
        scale: [0, 1, 0.6],
      }}
      transition={{ delay, duration: 1.2, ease: "easeOut" }}
    />
  );
}

const CONFETTI_COLORS = ["#8080FF", "#ABABFF", "#FFB0B0", "#FFE0B0", "#B0FFB0", "#B0E0FF"];

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
    const t = setTimeout(() => setCelebrate(true), 700);
    return () => clearTimeout(t);
  }, []);

  const confettiParticles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    delay: 0.6 + i * 0.04,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));

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
            style={{ background: "radial-gradient(ellipse at center, #A78BFA 0%, transparent 70%)" }}
          />
        </motion.div>

        {/* Avatar duo with celebration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative mb-8 flex items-end justify-center gap-2"
        >
          {/* Confetti burst */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {confettiParticles.map((p) => (
              <ConfettiParticle key={p.id} delay={p.delay} color={p.color} />
            ))}
          </div>

          {/* My avatar — bounce left */}
          <motion.div
            animate={celebrate ? { x: [0, -8, 0], rotate: [-4, 4, -4, 0] } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Avatar3D
              avatarUrl={myAvatarUrl}
              avatarConfig={myAvatarConfig}
              name="Me"
              size={96}
              animate={celebrate}
            />
          </motion.div>

          {/* Heart in the middle */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: [0, 1.3, 1] }}
            transition={{ delay: 0.8, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-4 shrink-0"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 24s-9-6-9-13a5 5 0 0110 0 5 5 0 0110 0c0 7-11 13-11 13z" fill="#FF6B9D" />
            </svg>
          </motion.div>

          {/* Partner avatar — bounce right */}
          <motion.div
            animate={celebrate ? { x: [0, 8, 0], rotate: [4, -4, 4, 0] } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Avatar3D
              avatarUrl={partnerAvatarUrl}
              avatarConfig={partnerAvatarConfig}
              name={partnerName}
              size={96}
              animate={celebrate}
            />
          </motion.div>
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
