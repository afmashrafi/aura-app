"use client";
import { AnimatePresence, motion } from "framer-motion";
import type { Question } from "@aura/types";
import { AnswerOption } from "./AnswerOption";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalInCategory: number;
  categoryLabel: string;
  selectedAnswer: 0 | 1 | 2 | 3 | undefined;
  onSelect: (index: 0 | 1 | 2 | 3) => void;
  direction: 1 | -1;
}

const CATEGORY_LABELS: Record<string, string> = {
  values:       "♡ Values",
  lifestyle:    "⌂ Lifestyle",
  goals:        "✦ Relationship Goals",
  dealbreakers: "⊗ Dealbreakers",
};

export function QuestionCard({ question, selectedAnswer, onSelect, direction }: QuestionCardProps) {
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 28 : -28, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -28 : 28, opacity: 0 }),
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={question.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Category */}
        <p className="text-xs font-semibold text-[#6B7280] mb-3 tracking-wide uppercase">
          {CATEGORY_LABELS[question.category] ?? question.category}
        </p>

        {/* Question */}
        <h2 className="font-display font-black text-[22px] leading-tight text-black mb-2">
          {question.text}
        </h2>
        <p className="text-sm text-[#9CA3AF] mb-6">There are no right or wrong answers. Be honest with yourself.</p>

        {/* Options */}
        <div role="radiogroup" aria-label={question.text} className="flex flex-col gap-2.5">
          {question.options.map((option, i) => (
            <AnswerOption
              key={i}
              label={option}
              index={i}
              selected={selectedAnswer === i}
              onSelect={() => onSelect(i as 0 | 1 | 2 | 3)}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
