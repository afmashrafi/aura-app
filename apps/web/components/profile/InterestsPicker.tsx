"use client";

import { motion } from "framer-motion";
import { INTEREST_CATEGORIES, INTERESTS } from "@aura/api";

const MIN_INTERESTS = 3;
const MAX_INTERESTS = 6;

interface InterestsPickerProps {
  selected: string[];
  onChange: (ids: string[]) => void;
}

export function InterestsPicker({ selected, onChange }: InterestsPickerProps) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else if (selected.length < MAX_INTERESTS) {
      onChange([...selected, id]);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Count indicator */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          {selected.length < MIN_INTERESTS
            ? `Pick at least ${MIN_INTERESTS - selected.length} more`
            : selected.length === MAX_INTERESTS
            ? "You're all set!"
            : `${MAX_INTERESTS - selected.length} more you can add`}
        </p>
        <div className="flex gap-1">
          {Array.from({ length: MAX_INTERESTS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                i < selected.length ? "bg-primary" : "bg-divider"
              }`}
            />
          ))}
        </div>
      </div>

      {INTEREST_CATEGORIES.map((cat, catIdx) => {
        const items = INTERESTS.filter((i) => i.category === cat);
        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.06, duration: 0.3 }}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
              {cat}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((interest) => {
                const isSelected = selected.includes(interest.id);
                const isDisabled = !isSelected && selected.length >= MAX_INTERESTS;

                return (
                  <motion.button
                    key={interest.id}
                    type="button"
                    onClick={() => toggle(interest.id)}
                    disabled={isDisabled}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.1 }}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium
                      transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
                      ${isSelected
                        ? "border-primary bg-primary text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                        : isDisabled
                        ? "border-divider bg-surface text-ink-muted opacity-40 cursor-not-allowed"
                        : "border-divider bg-white text-ink hover:border-primary-light hover:bg-primary-pale hover:text-primary"
                      }
                    `}
                  >
                    <span className="text-base leading-none">{interest.emoji}</span>
                    <span>{interest.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
