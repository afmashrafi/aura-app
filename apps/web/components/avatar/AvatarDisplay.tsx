"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import type { AvatarConfig, HairStyle, EyeStyle, Accessory } from "@aura/types";
import { DEFAULT_AVATAR } from "@aura/types";

export type AvatarAnimation = "idle" | "wave" | "celebrate" | "walk";

interface AvatarDisplayProps {
  config?: AvatarConfig | null;
  size?: number;
  animation?: AvatarAnimation;
  className?: string;
}

// ── Hair path definitions (clipped to head circle) ──────────────────────────
function HairPaths({ style, color }: { style: HairStyle; color: string }) {
  const clipId = `hair-clip-${Math.random().toString(36).slice(2, 7)}`;
  const commonProps = { fill: color };

  const paths: Record<HairStyle, ReactElement> = {
    short: (
      <>
        <clipPath id={clipId}><circle cx="40" cy="34" r="20" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L60 20 C60 4 20 4 20 20 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
    long: (
      <>
        <clipPath id={clipId}><rect x="16" y="4" width="48" height="70" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L62 58 Q60 66 55 70 L45 72 L35 72 Q30 66 28 58 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
    curly: (
      <>
        <clipPath id={clipId}><circle cx="40" cy="34" r="22" /></clipPath>
        <path
          d="M18 30 C16 20 20 8 28 6 C26 10 24 16 26 20 C24 14 30 8 38 6 C36 12 34 18 36 24 C34 16 42 8 50 8 C46 14 44 20 46 26 C44 18 52 10 58 12 C56 18 54 24 56 30 L60 20 C58 6 22 2 18 20 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
    bun: (
      <>
        <clipPath id={clipId}><circle cx="40" cy="34" r="20" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L60 24 C60 8 20 8 20 24 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
        {/* Bun on top */}
        <circle cx="40" cy="8" r="8" {...commonProps} />
        <path d="M34 14 Q40 18 46 14" stroke={color} strokeWidth="3" fill="none" />
      </>
    ),
    wavy: (
      <>
        <clipPath id={clipId}><rect x="16" y="4" width="48" height="68" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L62 50 Q58 58 54 54 Q50 50 46 56 Q42 62 38 56 Q34 50 30 56 Q26 62 22 56 Q18 50 20 44 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
    braids: (
      <>
        <clipPath id={clipId}><circle cx="40" cy="34" r="20" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L60 20 C60 4 20 4 20 20 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
        {/* Left braid */}
        <path d="M22 44 Q18 50 20 56 Q22 62 20 68" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Right braid */}
        <path d="M58 44 Q62 50 60 56 Q58 62 60 68" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" />
      </>
    ),
    bob: (
      <>
        <clipPath id={clipId}><rect x="14" y="4" width="52" height="52" /></clipPath>
        <path
          d="M20 30 C20 12 60 12 60 30 L62 46 Q60 52 50 54 Q40 56 30 54 Q20 52 18 46 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
    fade: (
      <>
        <clipPath id={clipId}><circle cx="40" cy="34" r="20" /></clipPath>
        <path
          d="M22 26 C22 16 58 16 58 26 L58 22 C58 12 22 12 22 22 Z"
          clipPath={`url(#${clipId})`}
          {...commonProps}
        />
      </>
    ),
  };

  return <>{paths[style] ?? paths.short}</>;
}

// ── Eye SVG elements ─────────────────────────────────────────────────────────
function Eyes({ style }: { style: EyeStyle }) {
  if (style === "almond") return (
    <>
      <path d="M32 33 Q36 30 40 33 Q36 36 32 33 Z" fill="#1E1B4B" />
      <path d="M44 33 Q48 30 52 33 Q48 36 44 33 Z" fill="#1E1B4B" />
      <circle cx="35" cy="32.5" r="1" fill="white" />
      <circle cx="47" cy="32.5" r="1" fill="white" />
    </>
  );
  if (style === "wide") return (
    <>
      <circle cx="35" cy="34" r="5" fill="#1E1B4B" />
      <circle cx="45" cy="34" r="5" fill="#1E1B4B" />
      <circle cx="36.5" cy="32.5" r="1.8" fill="white" />
      <circle cx="46.5" cy="32.5" r="1.8" fill="white" />
    </>
  );
  if (style === "sleepy") return (
    <>
      <path d="M31 34 Q35 31 39 34" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M43 34 Q47 31 51 34" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </>
  );
  // default: round
  return (
    <>
      <circle cx="35" cy="34" r="3.5" fill="#1E1B4B" />
      <circle cx="45" cy="34" r="3.5" fill="#1E1B4B" />
      <circle cx="36.2" cy="32.8" r="1.2" fill="white" />
      <circle cx="46.2" cy="32.8" r="1.2" fill="white" />
    </>
  );
}

// ── Accessory overlays ───────────────────────────────────────────────────────
function AccessoryLayer({ type, skinTone }: { type: Accessory; skinTone: string }) {
  if (type === "glasses") return (
    <>
      <rect x="30" y="31" width="10" height="7" rx="3.5" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
      <rect x="42" y="31" width="10" height="7" rx="3.5" fill="none" stroke="#1E1B4B" strokeWidth="1.5" />
      <line x1="40" y1="34.5" x2="42" y2="34.5" stroke="#1E1B4B" strokeWidth="1.5" />
      <line x1="28" y1="34.5" x2="30" y2="34.5" stroke="#1E1B4B" strokeWidth="1" />
      <line x1="52" y1="34.5" x2="54" y2="34.5" stroke="#1E1B4B" strokeWidth="1" />
    </>
  );
  if (type === "sunglasses") return (
    <>
      <rect x="29" y="31" width="12" height="8" rx="4" fill="rgba(0,0,0,0.7)" />
      <rect x="41" y="31" width="12" height="8" rx="4" fill="rgba(0,0,0,0.7)" />
      <line x1="41" y1="35" x2="43" y2="35" stroke="#555" strokeWidth="1.5" />
      <line x1="27" y1="35" x2="29" y2="35" stroke="#555" strokeWidth="1" />
      <line x1="53" y1="35" x2="55" y2="35" stroke="#555" strokeWidth="1" />
    </>
  );
  if (type === "cap") return (
    <>
      <path d="M18 28 C18 16 62 16 62 28 L62 24 C62 12 18 12 18 24 Z" fill="#333" />
      <path d="M14 28 L66 28" stroke="#333" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 14 L42 14" stroke="#555" strokeWidth="2" strokeLinecap="round" />
    </>
  );
  if (type === "beanie") return (
    <>
      <path d="M18 30 C18 14 62 14 62 30 L60 26 Q50 18 40 18 Q30 18 20 26 Z" fill="#CC4444" />
      <rect x="18" y="29" width="44" height="6" rx="3" fill="#AA2222" />
      <circle cx="40" cy="13" r="6" fill="#CC4444" />
    </>
  );
  return null;
}

// ── Outfit / body shape ──────────────────────────────────────────────────────
function OutfitShape({ style, color, skinTone }: { style: string; color: string; skinTone: string }) {
  if (style === "hoodie") return (
    <>
      <path
        d="M28 58 C20 58 14 64 12 72 L12 82 L68 82 L68 72 C66 64 60 58 52 58 L48 66 L40 68 L32 66 Z"
        fill={color}
      />
      {/* Hood */}
      <path d="M28 58 C22 52 20 46 24 42 Q32 56 40 57 Q48 56 56 42 C60 46 58 52 52 58" fill={color} opacity="0.7" />
      {/* Pocket */}
      <rect x="32" y="70" width="16" height="10" rx="4" fill={color} opacity="0.6" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
      {/* Neck / skin */}
      <rect x="36" y="53" width="8" height="8" rx="3" fill={skinTone} />
    </>
  );
  if (style === "blazer") return (
    <>
      <path
        d="M28 58 C20 58 14 64 12 72 L12 82 L68 82 L68 72 C66 64 60 58 52 58 L46 64 L40 66 L34 64 Z"
        fill={color}
      />
      {/* Lapels */}
      <path d="M40 66 L34 58 L28 62 Z" fill="white" opacity="0.3" />
      <path d="M40 66 L46 58 L52 62 Z" fill="white" opacity="0.3" />
      {/* Button */}
      <circle cx="40" cy="72" r="2" fill="white" opacity="0.5" />
      {/* Neck */}
      <rect x="36" y="53" width="8" height="8" rx="3" fill={skinTone} />
    </>
  );
  if (style === "sweater") return (
    <>
      <path
        d="M28 58 C20 58 14 64 12 72 L12 82 L68 82 L68 72 C66 64 60 58 52 58 L48 62 L40 64 L32 62 Z"
        fill={color}
      />
      {/* Ribbed collar */}
      <path d="M32 62 Q40 66 48 62 Q44 58 40 58 Q36 58 32 62 Z" fill={color} opacity="0.7" stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
      {/* Knit texture lines */}
      <path d="M20 70 L60 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <path d="M16 75 L64 75" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* Neck */}
      <rect x="36" y="53" width="8" height="8" rx="3" fill={skinTone} />
    </>
  );
  if (style === "tank") return (
    <>
      <path
        d="M32 58 C24 58 16 64 14 72 L14 82 L66 82 L66 72 C64 64 56 58 48 58 L48 60 L40 62 L32 60 Z"
        fill={color}
      />
      {/* Straps */}
      <rect x="34" y="53" width="6" height="8" rx="2" fill={color} />
      <rect x="40" y="53" width="6" height="8" rx="2" fill={color} />
    </>
  );
  // default: tshirt
  return (
    <>
      <path
        d="M28 58 C20 58 12 62 10 70 L14 72 L20 66 L20 82 L60 82 L60 66 L66 72 L70 70 C68 62 60 58 52 58 L48 64 L40 66 L32 64 Z"
        fill={color}
      />
      {/* Neck */}
      <rect x="36" y="53" width="8" height="8" rx="3" fill={skinTone} />
    </>
  );
}

// ── Main avatar SVG ──────────────────────────────────────────────────────────
function AvatarSVG({ config, wave = false }: { config: AvatarConfig; wave?: boolean }) {
  const {
    skinTone, hairStyle, hairColor, eyeStyle,
    outfitStyle, outfitColor, accessory, bgColor,
  } = config;

  const rightArmVariants = {
    rest: { rotate: 0, originX: "68px", originY: "60px" },
    wave: {
      rotate: [-10, -40, -10, -40, -10],
      transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity },
    },
  };

  return (
    <svg viewBox="0 0 80 82" fill="none" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      {/* Background circle */}
      <circle cx="40" cy="40" r="40" fill={bgColor} />

      {/* Body / outfit */}
      <OutfitShape style={outfitStyle} color={outfitColor} skinTone={skinTone} />

      {/* Left arm */}
      <path d="M12 66 Q8 72 10 78 Q12 80 14 78 L18 70 Z" fill={skinTone} />

      {/* Right arm — animated for wave */}
      <motion.g
        variants={rightArmVariants}
        animate={wave ? "wave" : "rest"}
        style={{ transformOrigin: "68px 60px" }}
      >
        <path d="M62 68 Q68 74 66 80 Q64 82 62 80 L58 72 Z" fill={skinTone} />
        {/* Hand */}
        <circle cx="66" cy="79" r="4" fill={skinTone} />
      </motion.g>

      {/* Head */}
      <circle cx="40" cy="34" r="20" fill={skinTone} />

      {/* Hair */}
      <HairPaths style={hairStyle} color={hairColor} />

      {/* Ears */}
      <ellipse cx="20.5" cy="34" rx="2.5" ry="3.5" fill={skinTone} />
      <ellipse cx="59.5" cy="34" rx="2.5" ry="3.5" fill={skinTone} />

      {/* Eyebrows */}
      <path d="M31 29 Q35 27 39 29" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M41 29 Q45 27 49 29" stroke={hairColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Eyes */}
      <Eyes style={eyeStyle} />

      {/* Nose */}
      <path d="M39 38 Q40 41 41 38" stroke={skinTone === '#F1C27D' || skinTone === '#FFDBB4' ? '#CC9966' : skinTone} strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Mouth */}
      <path d="M35 44 Q40 49 45 44" stroke="#CC7755" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Cheek blushes */}
      <ellipse cx="27" cy="41" rx="4" ry="2.5" fill="#FFB0B0" opacity="0.35" />
      <ellipse cx="53" cy="41" rx="4" ry="2.5" fill="#FFB0B0" opacity="0.35" />

      {/* Accessory */}
      <AccessoryLayer type={accessory} skinTone={skinTone} />
    </svg>
  );
}

// ── Public component ─────────────────────────────────────────────────────────
export function AvatarDisplay({
  config,
  size = 80,
  animation = "idle",
  className = "",
}: AvatarDisplayProps) {
  const cfg = config ?? DEFAULT_AVATAR;

  const idleVariants = {
    idle: {
      y: [0, -6, 0],
      transition: {
        duration: 2.8,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
    walk: {
      y: [0, -4, 0, -4, 0],
      x: [0, 2, 0, -2, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
    wave: { y: 0 },
    celebrate: {
      y: [0, -12, 0, -8, 0],
      rotate: [-3, 3, -3, 3, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: 3,
      },
    },
  };

  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      variants={idleVariants}
      animate={animation}
    >
      <AvatarSVG config={cfg} wave={animation === "wave" || animation === "celebrate"} />
    </motion.div>
  );
}
