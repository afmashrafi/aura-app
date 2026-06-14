"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfileSetup, supabase } from "@aura/api";
import type { PromptResponse, FavoriteCategory } from "@aura/types";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { InterestsPicker } from "@/components/profile/InterestsPicker";
import { PromptsPicker } from "@/components/profile/PromptsPicker";
import { FavoritesPicker } from "@/components/profile/FavoritesPicker";

const STEPS = [
  { label: "About you",  emoji: "✍️" },
  { label: "Interests",  emoji: "✨" },
  { label: "Prompts",    emoji: "💬" },
  { label: "Favourites", emoji: "❤️" },
] as const;

export default function ProfileSetupPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [promptResponses, setPromptResponses] = useState<PromptResponse[]>([]);
  const [favorites, setFavorites] = useState<FavoriteCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const filledResponses = promptResponses.filter(
        (r) => r.prompt && r.answer.trim()
      );
      await updateProfileSetup(user.id, {
        bio: bio.trim() || undefined,
        interests,
        prompt_responses: filledResponses,
        favorites,
      });
      setDone(true);
      refreshProfile().catch(() => {});
      // Re-run matching in background so new profile data is considered
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.access_token) return;
        fetch("/api/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId: user.id }),
        }).catch(() => {});
      });
      setTimeout(() => router.push("/matches"), 2200);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  // Validation per step
  const favoritesValid =
    favorites.length >= 1 &&
    favorites.every((f) => f.items.length >= 3);

  const canAdvance =
    step === 0 ? true :
    step === 1 ? interests.length >= 3 :
    step === 2 ? true :
    favoritesValid;

  const ctaLabel =
    step < STEPS.length - 1
      ? step === 1 && interests.length < 3
        ? `Select ${3 - interests.length} more`
        : step === 3 && !favoritesValid
        ? favorites.length === 0
          ? "Pick at least one category"
          : "Add 3+ to each category"
        : "Continue"
      : saving
      ? "Saving…"
      : "Finish setup";

  // All done screen
  if (done) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-white text-center px-6"
        style={{ height: "100dvh" }}
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ease: [0.34, 1.56, 0.64, 1], duration: 0.5 }}
          className="w-24 h-24 rounded-full bg-primary-pale flex items-center justify-center mb-6"
        >
          <svg className="w-12 h-12 text-primary" viewBox="0 0 48 48" fill="none">
            <path
              d="M10 24l10 10 18-20"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-3xl font-bold text-ink mb-2"
        >
          You're all set!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-ink-secondary text-base mb-8"
        >
          Your profile is ready. Let's find your match.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button onClick={() => router.push("/matches")} className="px-10">
            See my matches
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-divider">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-brand text-xl font-bold text-ink">Aura</span>
          <button
            type="button"
            onClick={() => router.push("/matches")}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Skip for now
          </button>
        </div>

        {/* Step progress */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex gap-1.5 mb-2">
            {STEPS.map((s, i) => (
              <div
                key={s.label}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-primary" : "bg-divider"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">{STEPS[step].emoji}</span>
            <span className="text-xs font-medium text-ink-secondary">
              Step {step + 1} of {STEPS.length} — {STEPS[step].label}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="bio"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="font-display text-2xl font-bold text-ink mb-1">
                  Introduce yourself
                </h1>
                <p className="text-sm text-ink-secondary mb-5">
                  Write a short bio that shows off your personality.
                </p>
                <div className="relative">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="I'm someone who loves late-night conversations, weekend hikes, and way too much coffee…"
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-4 rounded-2xl border-2 border-divider bg-surface focus:border-primary focus:bg-white transition-all text-base text-ink placeholder-ink-muted resize-none outline-none leading-relaxed"
                  />
                  <span className="absolute bottom-3.5 right-4 text-xs text-ink-muted select-none">
                    {bio.length}/500
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-3 text-center">
                  Optional — you can always edit this later.
                </p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="font-display text-2xl font-bold text-ink mb-1">
                  What are you into?
                </h1>
                <p className="text-sm text-ink-secondary mb-5">
                  Pick 3–6 interests that show who you are.
                </p>
                <InterestsPicker selected={interests} onChange={setInterests} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="font-display text-2xl font-bold text-ink mb-1">
                  Tell your story
                </h1>
                <p className="text-sm text-ink-secondary mb-5">
                  Answer up to 3 prompts to let your personality shine.
                </p>
                <PromptsPicker
                  responses={promptResponses}
                  onChange={setPromptResponses}
                />
                <p className="text-xs text-ink-muted mt-4 text-center">
                  Optional — fill in as many as you like.
                </p>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                <h1 className="font-display text-2xl font-bold text-ink mb-1">
                  Your favourites
                </h1>
                <p className="text-sm text-ink-secondary mb-5">
                  Pick what you want to share, then add at least 3 in each.
                </p>
                <FavoritesPicker favorites={favorites} onChange={setFavorites} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="shrink-0 bg-white border-t border-divider px-4 py-4">
        {error && (
          <p className="text-center text-sm text-danger mb-3 max-w-lg mx-auto">{error}</p>
        )}
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="shrink-0 h-12 px-5 rounded-2xl border-2 border-divider text-ink font-semibold text-sm hover:border-primary-light transition-colors"
            >
              Back
            </button>
          )}
          <Button
            onClick={
              step < STEPS.length - 1
                ? () => setStep((s) => s + 1)
                : handleFinish
            }
            disabled={!canAdvance || saving}
            loading={saving}
            className="flex-1 h-12 text-sm font-semibold rounded-2xl"
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
