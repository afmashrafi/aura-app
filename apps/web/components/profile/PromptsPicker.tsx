"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PROMPTS } from "@aura/api";
import type { PromptResponse } from "@aura/types";

const MAX_PROMPTS = 3;

interface PromptsPickerProps {
  responses: PromptResponse[];
  onChange: (responses: PromptResponse[]) => void;
}

export function PromptsPicker({ responses, onChange }: PromptsPickerProps) {
  const [pickingSlot, setPickingSlot] = useState<number | null>(null);

  const usedPrompts = responses.map((r) => r.prompt);

  function selectPrompt(slot: number, prompt: string) {
    const updated = [...responses];
    if (updated[slot]) {
      updated[slot] = { ...updated[slot], prompt };
    } else {
      updated[slot] = { prompt, answer: "" };
    }
    onChange(updated);
    setPickingSlot(null);
  }

  function updateAnswer(slot: number, answer: string) {
    const updated = [...responses];
    updated[slot] = { ...updated[slot], answer };
    onChange(updated);
  }

  function removeSlot(slot: number) {
    const updated = responses.filter((_, i) => i !== slot);
    onChange(updated);
  }

  const slots = Array.from({ length: MAX_PROMPTS }, (_, i) => responses[i] ?? null);

  return (
    <div className="flex flex-col gap-4">
      {slots.map((response, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="rounded-2xl border-2 border-divider bg-white overflow-hidden"
        >
          {response ? (
            <div>
              {/* Prompt header */}
              <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
                <p className="text-sm font-semibold text-primary leading-snug flex-1">
                  {response.prompt}
                </p>
                <button
                  type="button"
                  onClick={() => removeSlot(i)}
                  className="shrink-0 text-ink-muted hover:text-danger transition-colors mt-0.5"
                  aria-label="Remove prompt"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {/* Answer textarea */}
              <textarea
                value={response.answer}
                onChange={(e) => updateAnswer(i, e.target.value)}
                placeholder="Write your answer…"
                maxLength={300}
                rows={3}
                className="w-full px-4 pb-4 text-base text-ink placeholder-ink-muted bg-transparent resize-none focus:outline-none leading-relaxed"
              />
              <div className="px-4 pb-3 flex justify-end">
                <span className="text-xs text-ink-muted">{response.answer.length}/300</span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setPickingSlot(i)}
              className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-surface transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary-pale flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-primary" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-base text-ink-secondary">Add a prompt</span>
            </button>
          )}
        </motion.div>
      ))}

      {/* Prompt picker modal */}
      <AnimatePresence>
        {pickingSlot !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"
            onClick={() => setPickingSlot(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ ease: [0.34, 1.56, 0.64, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm max-h-[70vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="px-5 py-4 border-b border-divider flex items-center justify-between">
                <h3 className="font-display text-lg text-ink">Choose a prompt</h3>
                <button
                  type="button"
                  onClick={() => setPickingSlot(null)}
                  className="text-ink-muted hover:text-ink transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                    <path d="M5 5l10 10M15 5l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {PROMPTS.map((prompt) => {
                  const isUsed = usedPrompts.includes(prompt);
                  return (
                    <button
                      key={prompt}
                      type="button"
                      disabled={isUsed}
                      onClick={() => selectPrompt(pickingSlot, prompt)}
                      className={`w-full text-left px-5 py-3.5 border-b border-divider last:border-0 transition-colors text-base leading-snug
                        ${isUsed ? "text-ink-muted opacity-50 cursor-not-allowed" : "text-ink hover:bg-surface"}`}
                    >
                      {prompt}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
