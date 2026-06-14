"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfileSetup } from "@aura/api";
import type { PromptResponse } from "@aura/types";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { InterestsPicker } from "@/components/profile/InterestsPicker";
import { PromptsPicker } from "@/components/profile/PromptsPicker";

const STEPS = ["About you", "Interests", "Prompts"] as const;

export default function ProfileSetupPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [promptResponses, setPromptResponses] = useState<PromptResponse[]>([]);
  const [saving, setSaving] = useState(false);

  async function handleFinish() {
    if (!user) return;
    setSaving(true);
    try {
      const filledResponses = promptResponses.filter(
        (r) => r.prompt && r.answer.trim()
      );
      await updateProfileSetup(user.id, {
        bio: bio.trim() || undefined,
        interests,
        prompt_responses: filledResponses,
      });
      await refreshProfile();
      router.push("/matches");
    } finally {
      setSaving(false);
    }
  }

  const canAdvance = step === 0
    ? true
    : step === 1
    ? interests.length >= 3
    : true;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-divider">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-brand text-xl text-ink">Aura</span>
          <button
            type="button"
            onClick={() => router.push("/matches")}
            className="text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-lg mx-auto px-4 pt-5 w-full">
        <div className="flex items-center gap-2 mb-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-primary" : "bg-surface-deep"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-muted mt-1">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-6 pb-36">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="bio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-display text-2xl text-ink mb-1">
                  Introduce yourself
                </h1>
                <p className="text-sm text-ink-secondary mb-6">
                  Write a short bio that shows off your personality.
                </p>
                <div className="relative">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="I'm someone who… loves late-night conversations, weekend hikes, and way too much coffee."
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-divider bg-surface focus:border-primary focus:bg-white transition-colors text-base text-ink placeholder-ink-muted resize-none outline-none leading-relaxed"
                  />
                  <span className="absolute bottom-3 right-4 text-xs text-ink-muted">
                    {bio.length}/500
                  </span>
                </div>
                <p className="text-xs text-ink-muted mt-2 text-center">
                  Optional — you can always edit this later in your profile.
                </p>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="interests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-display text-2xl text-ink mb-1">
                  What are you into?
                </h1>
                <p className="text-sm text-ink-secondary mb-6">
                  Pick 3–6 interests that show who you are.
                </p>
                <InterestsPicker selected={interests} onChange={setInterests} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-display text-2xl text-ink mb-1">
                  Tell your story
                </h1>
                <p className="text-sm text-ink-secondary mb-6">
                  Answer up to 3 prompts to let your personality shine.
                </p>
                <PromptsPicker
                  responses={promptResponses}
                  onChange={setPromptResponses}
                />
                <p className="text-xs text-ink-muted mt-4 text-center">
                  Optional — fill in as many or as few as you like.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-divider py-4 px-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-none h-12 px-5 rounded-2xl border-2 border-divider text-ink font-medium text-base hover:border-primary-light transition-colors"
            >
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance}
              className="flex-1"
            >
              {step === 1 && interests.length < 3
                ? `Select ${3 - interests.length} more`
                : "Continue"}
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              loading={saving}
              className="flex-1"
            >
              {saving ? "Saving…" : "Finish setup"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
