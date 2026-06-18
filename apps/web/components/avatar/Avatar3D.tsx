"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AvatarConfig } from "@aura/types";
import { DEFAULT_AVATAR } from "@aura/types";
import { AvatarDisplay } from "./AvatarDisplay";

interface Avatar3DProps {
  avatarUrl?: string | null;
  avatarConfig?: AvatarConfig | null;
  size?: number;
  name?: string;
  className?: string;
  animate?: boolean;
}

// Ready Player Me render API: swap .glb for .png with a portrait scene
function rpmRenderUrl(glbUrl: string, px: number): string {
  const base = glbUrl.replace(/\.glb(\?.*)?$/, "");
  const size = Math.min(Math.max(px * 2, 128), 1024); // 2× for retina, capped
  return `${base}.png?scene=fullbody-portrait-v1-transparent&quality=high&w=${size}`;
}

function InitialsFallback({ name, size }: { name: string; size: number }) {
  const initial = name.charAt(0).toUpperCase();
  const fontSize = Math.round(size * 0.38);
  return (
    <div
      className="rounded-full bg-primary-pale flex items-center justify-center font-display font-semibold text-primary shrink-0"
      style={{ width: size, height: size, fontSize }}
    >
      {initial}
    </div>
  );
}

export function Avatar3D({
  avatarUrl,
  avatarConfig,
  size = 80,
  name = "?",
  className = "",
  animate = true,
}: Avatar3DProps) {
  const [imgError, setImgError] = useState(false);

  const idleFloat = animate
    ? { y: [0, -5, 0], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
    : {};

  // If we have a Ready Player Me URL and it hasn't errored, show the 3D render
  if (avatarUrl && !imgError) {
    const src = rpmRenderUrl(avatarUrl, size);
    return (
      <motion.div
        className={`shrink-0 rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        animate={idleFloat}
      >
        <img
          src={src}
          alt={`${name}'s 3D avatar`}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </motion.div>
    );
  }

  // Fall back to SVG avatar if available
  if (avatarConfig) {
    return (
      <div className={`shrink-0 rounded-full overflow-hidden ${className}`} style={{ width: size, height: size }}>
        <AvatarDisplay config={avatarConfig} size={size} animation={animate ? "idle" : undefined} />
      </div>
    );
  }

  // Last resort: initials
  return (
    <motion.div className={className} animate={idleFloat}>
      <InitialsFallback name={name} size={size} />
    </motion.div>
  );
}
