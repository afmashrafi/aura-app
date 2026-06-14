"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QUESTIONS,
  getUserAnswers,
  saveAnswer,
  completeQuestionnaire,
} from "@aura/api";
import type { Question } from "@aura/types";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const CATEGORY_NAMES: Record<string, string> = {
  values: "Values",
  lifestyle: "Lifestyle",
  goals: "Relationship goals",
  dealbreakers: "Dealbreakers",
};

const CATEGORY_ORDER = ["values", "lifestyle", "goals", "dealbreakers"];

function groupByCategory(questions: Question[]) {
  return CATEGORY_ORDER.reduce<Record<string, Question[]>>((acc, cat) => {
    acc[cat] = questions.filter((q) => q.category === cat);
    return acc;
  }, {});
}

export default function ProfilePage() {
  const { user, profile } = useAuth();
  const [answers, setAnswers] = useState<Record<number, 0 | 1 | 2 | 3>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUserAnswers(user.id).then((existing) => {
      const map: Record<number, 0 | 1 | 2 | 3> = {};
      for (const a of existing) map[a.question_id] = a.answer_index;
      setAnswers(map);
      setLoaded(true);
    });
  }, [user]);

  const handleEditAnswer = useCallback(
    async (question: Question, index: 0 | 1 | 2 | 3) => {
      if (!user) return;
      setSaving(question.id);
      try {
        await saveAnswer(user.id, question, index);
        if (!profile?.questionnaire_completed) {
          await completeQuestionnaire(user.id);
        }
        setAnswers((prev) => ({ ...prev, [question.id]: index }));
        setEditing(null);
      } finally {
        setSaving(null);
      }
    },
    [user, profile]
  );

  const categorized = groupByCategory(QUESTIONS);
  const completedCount = Object.keys(answers).length;

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-pale flex items-center justify-center font-display text-2xl text-primary font-semibold">
            {profile?.first_name?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 className="font-display text-[22px] text-ink">
              {profile?.first_name}
            </h1>
            <p className="text-sm text-ink-secondary">
              {completedCount} of {QUESTIONS.length} questions answered
            </p>
          </div>
        </div>

        {/* Completion bar */}
        <div className="mb-8">
          <div className="w-full h-1.5 bg-surface-deep rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-light rounded-full transition-[width] duration-500"
              style={{ width: `${(completedCount / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions by category */}
        <div className="flex flex-col gap-8">
          {CATEGORY_ORDER.map((cat) => (
            <section key={cat}>
              <h2 className="font-display text-[18px] text-ink mb-3">
                {CATEGORY_NAMES[cat]}
              </h2>
              <div className="flex flex-col gap-3">
                {categorized[cat].map((question) => {
                  const answerIndex = answers[question.id];
                  const answered = answerIndex !== undefined;
                  const isEditing = editing === question.id;

                  return (
                    <Card key={question.id} elevated={false} className="overflow-hidden">
                      {/* Question row */}
                      <button
                        type="button"
                        onClick={() =>
                          setEditing(isEditing ? null : question.id)
                        }
                        className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3 hover:bg-surface transition-colors"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-medium text-ink leading-snug">
                            {question.text}
                          </p>
                          {answered ? (
                            <p className="text-sm text-primary">
                              {question.options[answerIndex]}
                            </p>
                          ) : (
                            <p className="text-sm text-ink-muted italic">
                              Not answered
                            </p>
                          )}
                        </div>
                        <svg
                          className={`w-4 h-4 text-ink-muted shrink-0 mt-0.5 transition-transform duration-200 ${isEditing ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Inline edit options */}
                      <AnimatePresence>
                        {isEditing && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-divider px-4 py-3 flex flex-col gap-2 bg-surface">
                              {question.options.map((option, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() =>
                                    handleEditAnswer(question, i as 0 | 1 | 2 | 3)
                                  }
                                  disabled={saving === question.id}
                                  className={`text-left text-sm px-3 py-2 rounded-xl transition-all duration-150 flex items-center gap-2 ${
                                    answerIndex === i
                                      ? "bg-primary-pale text-primary font-medium border border-primary"
                                      : "bg-white text-ink border border-divider hover:border-primary-light"
                                  }`}
                                >
                                  {answerIndex === i && (
                                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
                                      <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                  {option}
                                  {saving === question.id && answerIndex === i && (
                                    <svg className="ml-auto animate-spin w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                    </svg>
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 pb-6">
          <p className="text-xs text-ink-muted text-center">
            Editing your answers re-triggers the matching engine in the background.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
