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

const CATEGORY_NAMES: Record<string, string> = {
  values: "Values",
  lifestyle: "Lifestyle",
  goals: "Relationship goals",
  dealbreakers: "Dealbreakers",
};

export function QuestionCard({
  question,
  questionIndex,
  totalInCategory,
  categoryLabel,
  selectedAnswer,
  onSelect,
  direction,
}: QuestionCardProps) {
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
    }),
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
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Category label */}
        <p className="text-sm font-medium text-ink-muted mb-1">
          {CATEGORY_NAMES[question.category]} · {questionIndex} of {totalInCategory}
        </p>

        {/* Question text */}
        <h2 className="font-display text-[22px] text-ink leading-snug mb-6">
          {question.text}
        </h2>

        {/* Options */}
        <div
          role="radiogroup"
          aria-label={question.text}
          className="flex flex-col gap-3"
        >
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
