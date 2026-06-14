"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfileSetup } from "@aura/api";
import type { PromptResponse, SocialLink } from "@aura/types";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { InterestsPicker } from "@/components/profile/InterestsPicker";
import { PromptsPicker } from "@/components/profile/PromptsPicker";
import { SocialLinksPicker } from "@/components/profile/SocialLinksPicker";

const STEPS = [
  { label: "About you", emoji: "✍️" },
  { label: "Interests", emoji: "✨" },
  { label: "Prompts", emoji: "💬" },
  { label: "Socials", emoji: "🎵" },
] as const;

export default function ProfileSetupPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [bio, setBio] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [promptResponses, setPromptResponses] = useState<PromptResponse[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
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
        social_links: socialLinks,
      });
      await refreshProfile();
      router.push("/matches");
    } finally {
      setSaving(false);
    }
  }

  const canAdvance =
    step === 0 ? true :
    step === 1 ? interests.length >= 3 :
    true;

  const ctaLabel =
    step < STEPS.length - 1
      ? step === 1 && interests.length < 3
        ? `Select ${3 - interests.length} more`
        : "Continue"
      : saving
      ? "Saving…"
      : "Finish setup";

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
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
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
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
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
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
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
                key="socials"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              >
                <h1 className="font-display text-2xl font-bold text-ink mb-1">
                  Your socials
                </h1>
                <p className="text-sm text-ink-secondary mb-5">
                  Link your accounts so matches can see what you're into.
                </p>
                <SocialLinksPicker links={socialLinks} onChange={setSocialLinks} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky footer — always visible, not covered by keyboard */}
      <div className="shrink-0 bg-white border-t border-divider px-4 py-4">
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
