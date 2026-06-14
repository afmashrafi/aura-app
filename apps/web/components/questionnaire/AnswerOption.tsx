"use client";

import { motion } from "framer-motion";

interface AnswerOptionProps {
  label: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function AnswerOption({
  label,
  index,
  selected,
  onSelect,
}: AnswerOptionProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className={`w-full text-left px-5 py-4 rounded-[16px] border-2 transition-all duration-150 flex items-center gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring ${
        selected
          ? "border-primary bg-primary-pale"
          : "border-divider bg-surface hover:border-primary-light hover:bg-white"
      }`}
    >
      {/* Index bubble */}
      <span
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-150 ${
          selected ? "bg-primary text-white" : "bg-white text-ink-muted border border-divider"
        }`}
      >
        {selected ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
            <path
              d="M2.5 7l3 3 6-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          String.fromCharCode(65 + index)
        )}
      </span>
      <span
        className={`text-base leading-snug ${
          selected ? "text-primary font-medium" : "text-ink"
        }`}
      >
        {label}
      </span>
    </motion.button>
  );
}
