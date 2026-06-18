"use client";

import { motion } from "framer-motion";
import type { AvatarConfig, HairStyle, EyeStyle, OutfitStyle, Accessory } from "@aura/types";
import { DEFAULT_AVATAR } from "@aura/types";
import { AvatarDisplay } from "./AvatarDisplay";

interface AvatarBuilderProps {
  value: AvatarConfig;
  onChange: (cfg: AvatarConfig) => void;
}

const SKIN_TONES = [
  "#FFDBB4", "#F1C27D", "#E0A87A", "#C68642", "#8D5524", "#4A2506",
];

const HAIR_STYLES: { id: HairStyle; label: string }[] = [
  { id: "short",  label: "Short"  },
  { id: "long",   label: "Long"   },
  { id: "curly",  label: "Curly"  },
  { id: "bun",    label: "Bun"    },
  { id: "wavy",   label: "Wavy"   },
  { id: "braids", label: "Braids" },
  { id: "bob",    label: "Bob"    },
  { id: "fade",   label: "Fade"   },
];

const HAIR_COLORS = [
  "#1A0A00", "#4A3000", "#7B4A00", "#C17D3C",
  "#D4A44C", "#E8C88A", "#C0392B", "#7D3C98",
];

const EYE_STYLES: { id: EyeStyle; label: string; emoji: string }[] = [
  { id: "round",  label: "Round",  emoji: "👁️" },
  { id: "almond", label: "Almond", emoji: "😌" },
  { id: "wide",   label: "Wide",   emoji: "😲" },
  { id: "sleepy", label: "Sleepy", emoji: "😴" },
];

const OUTFIT_STYLES: { id: OutfitStyle; label: string; emoji: string }[] = [
  { id: "tshirt",  label: "T-Shirt",  emoji: "👕" },
  { id: "hoodie",  label: "Hoodie",   emoji: "🧥" },
  { id: "blazer",  label: "Blazer",   emoji: "🥼" },
  { id: "sweater", label: "Sweater",  emoji: "🧶" },
  { id: "tank",    label: "Tank",     emoji: "🎽" },
];

const OUTFIT_COLORS = [
  "#8080FF", "#FF6B9D", "#FFB347", "#4CAF50",
  "#2196F3", "#9C27B0", "#FF5722", "#607D8B",
];

const BG_COLORS = [
  "#E6E6FF", "#FFE6F0", "#FFF3E0", "#E8F5E9",
  "#E3F2FD", "#F3E5F5", "#FBE9E7", "#ECEFF1",
];

const ACCESSORIES: { id: Accessory; label: string; emoji: string }[] = [
  { id: "none",       label: "None",        emoji: "✨" },
  { id: "glasses",    label: "Glasses",     emoji: "🤓" },
  { id: "sunglasses", label: "Sunnies",     emoji: "😎" },
  { id: "cap",        label: "Cap",         emoji: "🧢" },
  { id: "beanie",     label: "Beanie",      emoji: "🎿" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-ink-muted uppercase tracking-wide mb-2.5">
      {children}
    </p>
  );
}

function ColorSwatch({
  color,
  selected,
  onClick,
  size = 32,
}: {
  color: string;
  selected: boolean;
  onClick: () => void;
  size?: number;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="rounded-full relative flex-shrink-0 focus:outline-none"
      style={{ width: size, height: size, background: color }}
      aria-label={color}
    >
      {selected && (
        <motion.div
          layoutId="swatch-ring"
          className="absolute inset-0 rounded-full ring-2 ring-offset-1 ring-primary"
          initial={false}
        />
      )}
    </motion.button>
  );
}

function ChoicePill<T extends string>({
  id,
  label,
  emoji,
  selected,
  onClick,
}: {
  id: T;
  label: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
        selected
          ? "bg-primary text-white"
          : "bg-surface text-ink-secondary border border-divider"
      }`}
    >
      <span className="text-lg leading-none">{emoji}</span>
      <span className="leading-none">{label}</span>
    </motion.button>
  );
}

export function AvatarBuilder({ value, onChange }: AvatarBuilderProps) {
  function set<K extends keyof AvatarConfig>(key: K, val: AvatarConfig[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Live preview */}
      <div className="flex justify-center">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AvatarDisplay config={value} size={130} animation="idle" />
        </motion.div>
      </div>

      {/* Skin tone */}
      <div>
        <SectionLabel>Skin tone</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {SKIN_TONES.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={value.skinTone === c}
              onClick={() => set("skinTone", c)}
              size={36}
            />
          ))}
        </div>
      </div>

      {/* Hair style */}
      <div>
        <SectionLabel>Hair style</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {HAIR_STYLES.map((h) => (
            <motion.button
              key={h.id}
              type="button"
              onClick={() => set("hairStyle", h.id)}
              whileTap={{ scale: 0.93 }}
              className={`py-2 px-1 rounded-xl text-xs font-medium transition-colors ${
                value.hairStyle === h.id
                  ? "bg-primary text-white"
                  : "bg-surface text-ink-secondary border border-divider"
              }`}
            >
              {h.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Hair color */}
      <div>
        <SectionLabel>Hair color</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {HAIR_COLORS.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={value.hairColor === c}
              onClick={() => set("hairColor", c)}
              size={32}
            />
          ))}
        </div>
      </div>

      {/* Eyes */}
      <div>
        <SectionLabel>Eyes</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {EYE_STYLES.map((e) => (
            <ChoicePill
              key={e.id}
              id={e.id}
              label={e.label}
              emoji={e.emoji}
              selected={value.eyeStyle === e.id}
              onClick={() => set("eyeStyle", e.id)}
            />
          ))}
        </div>
      </div>

      {/* Outfit style */}
      <div>
        <SectionLabel>Outfit</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {OUTFIT_STYLES.map((o) => (
            <ChoicePill
              key={o.id}
              id={o.id}
              label={o.label}
              emoji={o.emoji}
              selected={value.outfitStyle === o.id}
              onClick={() => set("outfitStyle", o.id)}
            />
          ))}
        </div>
      </div>

      {/* Outfit color */}
      <div>
        <SectionLabel>Outfit color</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {OUTFIT_COLORS.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={value.outfitColor === c}
              onClick={() => set("outfitColor", c)}
              size={32}
            />
          ))}
        </div>
      </div>

      {/* Accessory */}
      <div>
        <SectionLabel>Accessory</SectionLabel>
        <div className="flex gap-2 flex-wrap">
          {ACCESSORIES.map((a) => (
            <ChoicePill
              key={a.id}
              id={a.id}
              label={a.label}
              emoji={a.emoji}
              selected={value.accessory === a.id}
              onClick={() => set("accessory", a.id)}
            />
          ))}
        </div>
      </div>

      {/* Background color */}
      <div>
        <SectionLabel>Background</SectionLabel>
        <div className="flex gap-3 flex-wrap">
          {BG_COLORS.map((c) => (
            <ColorSwatch
              key={c}
              color={c}
              selected={value.bgColor === c}
              onClick={() => set("bgColor", c)}
              size={32}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { DEFAULT_AVATAR };
