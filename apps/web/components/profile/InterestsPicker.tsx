"use client";

import { motion } from "framer-motion";
import { INTEREST_CATEGORIES, INTERESTS } from "@aura/api";

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
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-muted text-center">
        {selected.length} / {MAX_INTERESTS} selected
      </p>

      {INTEREST_CATEGORIES.map((cat) => {
        const items = INTERESTS.filter((i) => i.category === cat);
        return (
          <div key={cat}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
              {cat}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {items.map((interest) => {
                const isSelected = selected.includes(interest.id);
                const isDisabled = !isSelected && selected.length >= MAX_INTERESTS;

                return (
                  <motion.button
                    key={interest.id}
                    type="button"
                    onClick={() => toggle(interest.id)}
                    disabled={isDisabled}
                    whileTap={{ scale: 0.94 }}
                    transition={{ duration: 0.12 }}
                    className={`relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring
                      ${isSelected
                        ? "border-primary bg-primary-pale shadow-[0_2px_12px_rgba(124,58,237,0.15)]"
                        : isDisabled
                        ? "border-divider bg-surface opacity-40 cursor-not-allowed"
                        : "border-divider bg-white hover:border-primary-light hover:bg-surface"
                      }`}
                  >
                    {/* Selected checkmark */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                      >
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </motion.div>
                    )}

                    <span className="text-2xl leading-none">{interest.emoji}</span>
                    <span className={`text-xs font-medium text-center leading-tight ${isSelected ? "text-primary" : "text-ink"}`}>
                      {interest.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
