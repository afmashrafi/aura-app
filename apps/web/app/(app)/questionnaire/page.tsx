"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  QUESTIONS,
  completeQuestionnaire,
  getUserAnswers,
  saveAnswer,
} from "@aura/api";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/questionnaire/ProgressBar";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";

const CATEGORY_COUNTS: Record<string, number> = {};
const CATEGORY_OFFSETS: Record<string, number> = {};
let offset = 0;
for (const q of QUESTIONS) {
  if (!CATEGORY_COUNTS[q.category]) {
    CATEGORY_COUNTS[q.category] = 0;
    CATEGORY_OFFSETS[q.category] = offset;
  }
  CATEGORY_COUNTS[q.category]++;
  offset++;
}

export default function QuestionnairePage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 0 | 1 | 2 | 3>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    getUserAnswers(user.id).then((existing) => {
      const map: Record<number, 0 | 1 | 2 | 3> = {};
      for (const a of existing) {
        map[a.question_id] = a.answer_index;
      }
      setAnswers(map);
      const firstUnanswered = QUESTIONS.findIndex((q) => map[q.id] === undefined);
      setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : QUESTIONS.length - 1);
      setInitialized(true);
    });
  }, [user]);

  const question = QUESTIONS[currentIndex];
  const categoryOffset = CATEGORY_OFFSETS[question?.category ?? "values"];
  const questionInCategory = currentIndex - categoryOffset + 1;
  const totalInCategory = CATEGORY_COUNTS[question?.category ?? "values"];
  const selectedAnswer = question ? answers[question.id] : undefined;
  const completedCount = Object.keys(answers).length;
  const isLast = currentIndex === QUESTIONS.length - 1;

  const handleSelect = useCallback(
    async (index: 0 | 1 | 2 | 3) => {
      if (!user || !question || savingRef.current) return;
      setAnswers((prev) => ({ ...prev, [question.id]: index }));
      savingRef.current = true;
      setSaving(true);
      try {
        await saveAnswer(user.id, question, index);
      } finally {
        savingRef.current = false;
        setSaving(false);
      }
    },
    [user, question]
  );

  async function handleNext() {
    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleBack() {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((i) => i - 1);
    }
  }

  async function handleFinish() {
    if (!user) return;
    setCompleting(true);
    try {
      await completeQuestionnaire(user.id);
      await refreshProfile();
      router.push("/matches");
    } finally {
      setCompleting(false);
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress bar pinned at top */}
      <div className="sticky top-0 z-10 bg-white px-5 pt-5 pb-3">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink disabled:opacity-30 transition-colors"
              aria-label="Previous question"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <span className="text-xs text-ink-muted">
              {completedCount} / {QUESTIONS.length} answered
            </span>
            {saving && (
              <span className="text-xs text-ink-muted flex items-center gap-1">
                <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Saving
              </span>
            )}
          </div>
          <ProgressBar current={completedCount} total={QUESTIONS.length} />
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 pt-6 pb-8">
        {question && (
          <QuestionCard
            question={question}
            questionIndex={questionInCategory}
            totalInCategory={totalInCategory}
            categoryLabel={question.category}
            selectedAnswer={selectedAnswer}
            onSelect={handleSelect}
            direction={direction}
          />
        )}

        {/* Navigation */}
        <motion.div
          key={`nav-${currentIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.25 }}
          className="mt-auto pt-8"
        >
          {isLast ? (
            <Button
              onClick={handleFinish}
              loading={completing}
              disabled={selectedAnswer === undefined || completing}
              className="w-full"
            >
              See my matches
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === undefined}
              className="w-full"
            >
              Next question
            </Button>
          )}
          {selectedAnswer === undefined && (
            <p className="text-center text-sm text-ink-muted mt-3">
              Select an answer to continue
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
