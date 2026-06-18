"use client";
import { motion } from "framer-motion";

const LETTERS = ["A", "B", "C", "D"] as const;

interface AnswerOptionProps {
  label: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}

export function AnswerOption({ label, index, selected, onSelect }: AnswerOptionProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.12 }}
      className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-left transition-all"
      style={{
        background: selected ? "#000" : "#F5F5F5",
        border: `2px solid ${selected ? "#000" : "transparent"}`,
      }}
    >
      {/* Letter badge */}
      <span
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold transition-colors"
        style={{
          background: selected ? "rgba(255,255,255,0.15)" : "#E5E5E5",
          color: selected ? "#fff" : "#6B7280",
        }}
      >
        {LETTERS[index as 0 | 1 | 2 | 3]}
      </span>

      {/* Label */}
      <span
        className="flex-1 text-sm font-medium leading-snug transition-colors"
        style={{ color: selected ? "#fff" : "#000" }}
      >
        {label}
      </span>

      {/* Selection indicator */}
      <motion.span
        animate={{ scale: selected ? 1 : 0.8, opacity: selected ? 1 : 0.45 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
        style={{
          background: selected ? "#fff" : "transparent",
          borderColor: selected ? "#fff" : "#D1D5DB",
        }}
      >
        {selected && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-5" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </motion.span>
    </motion.button>
  );
}
