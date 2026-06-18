"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  QUESTIONS,
  completeQuestionnaire,
  getUserAnswers,
  saveAnswer,
  supabase,
} from "@aura/api";
import { useAuth } from "@/app/providers";
import { QuestionCard } from "@/components/questionnaire/QuestionCard";

const CATEGORY_COUNTS: Record<string, number> = {};
const CATEGORY_OFFSETS: Record<string, number> = {};
let _offset = 0;
for (const q of QUESTIONS) {
  if (!CATEGORY_COUNTS[q.category]) {
    CATEGORY_COUNTS[q.category] = 0;
    CATEGORY_OFFSETS[q.category] = _offset;
  }
  CATEGORY_COUNTS[q.category]++;
  _offset++;
}

const CATEGORY_WHY: Record<string, string> = {
  values:       "Understanding your core values helps us find someone who shares what matters most to you in life.",
  lifestyle:    "Lifestyle compatibility is one of the top predictors of long-term relationship success.",
  goals:        "Knowing what you're looking for helps us match you with someone at a similar stage in life.",
  dealbreakers: "Being clear about your boundaries saves time for both you and your matches.",
};

const ENCOURAGEMENTS = [
  "You're doing great! Every answer brings you closer to your match.",
  "Honesty here leads to better matches. Keep going!",
  "Real compatibility starts with knowing yourself.",
  "Almost there — your answers are shaping your perfect match.",
];

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
      for (const a of existing) map[a.question_id] = a.answer_index;
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
  const progressPct = Math.round((completedCount / QUESTIONS.length) * 100);

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
      if (currentIndex < QUESTIONS.length - 1) {
        setTimeout(() => { setDirection(1); setCurrentIndex((i) => i + 1); }, 380);
      }
    },
    [user, question, currentIndex]
  );

  function handleNext() {
    if (currentIndex < QUESTIONS.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleSkip() {
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
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.access_token) return;
        fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
          body: JSON.stringify({ userId: user.id }),
        }).catch(() => {});
      });
      await refreshProfile();
      router.push("/profile-setup");
    } finally {
      setCompleting(false);
    }
  }

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  const encouragement = ENCOURAGEMENTS[Math.floor(completedCount / (QUESTIONS.length / ENCOURAGEMENTS.length)) % ENCOURAGEMENTS.length];

  return (
    <div className="flex flex-col lg:flex-row min-h-full">
      {/* Main question area */}
      <div className="flex-1 flex flex-col px-5 lg:px-8 pt-5 pb-6">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-black disabled:opacity-30 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 13L5 8l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
            <div className="flex-1 h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-black rounded-full"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-semibold text-black shrink-0">{progressPct}% Complete</span>
            {saving && (
              <span className="w-3 h-3 rounded-full border-2 border-[#6B7280] border-t-transparent animate-spin shrink-0" />
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">Question {currentIndex + 1} of {QUESTIONS.length}</span>
            <span className="text-xs font-semibold bg-[#F5F5F5] text-black px-2.5 py-1 rounded-full">
              🔥 {Math.max(1, Math.floor(completedCount / 3))} day streak
            </span>
          </div>
        </div>

        {/* Question card */}
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

        {/* Bottom actions */}
        <motion.div
          key={`nav-${currentIndex}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-auto pt-6 flex flex-col gap-3"
        >
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              disabled={currentIndex >= QUESTIONS.length - 1}
              className="flex-1 h-12 rounded-full border-2 border-[#E5E5E5] text-sm font-semibold text-[#6B7280] hover:border-black hover:text-black transition-all disabled:opacity-30"
            >
              Skip question
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                disabled={selectedAnswer === undefined || completing}
                className="flex-1 h-12 rounded-full bg-black text-white text-sm font-bold hover:bg-[#111] transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {completing ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : "See my matches →"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={selectedAnswer === undefined}
                className="flex-1 h-12 rounded-full bg-black text-white text-sm font-bold hover:bg-[#111] transition-colors disabled:opacity-40"
              >
                Next question →
              </button>
            )}
          </div>
          <p className="text-center text-xs text-[#9CA3AF]">You can change your answers later</p>
        </motion.div>
      </div>

      {/* Right sidebar — desktop only */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-l border-[#E5E5E5] px-6 py-6 gap-4">
        {/* Why we ask */}
        <div className="bg-[#F5F5F5] rounded-2xl p-4">
          <p className="text-xs font-bold text-black mb-2 uppercase tracking-wide">Why we ask this?</p>
          <p className="text-sm text-[#6B7280] leading-relaxed">
            {CATEGORY_WHY[question?.category ?? "values"]}
          </p>
        </div>

        {/* Progress */}
        <div className="bg-[#F5F5F5] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-black uppercase tracking-wide">Your progress</p>
            <span className="text-xs font-semibold text-black">{progressPct}%</span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-black rounded-full"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-[#6B7280]">
            <span>{completedCount} answered</span>
            <span>{QUESTIONS.length - completedCount} remaining</span>
          </div>
        </div>

        {/* Encouragement */}
        <div className="bg-black rounded-2xl p-4">
          <p className="text-xs font-bold text-white/70 mb-1.5 uppercase tracking-wide">✦ Keep going</p>
          <p className="text-sm text-white leading-relaxed">{encouragement}</p>
        </div>

        <p className="text-[11px] text-[#9CA3AF] text-center">
          Question {currentIndex + 1} of {QUESTIONS.length} · {question?.category}
        </p>
      </aside>
    </div>
  );
}
