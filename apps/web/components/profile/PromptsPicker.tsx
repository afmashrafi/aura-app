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
  // which slot is currently showing the prompt list
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  const usedPrompts = responses.map((r) => r.prompt);

  function selectPrompt(slot: number, prompt: string) {
    const updated = responses.slice();
    if (updated[slot]) {
      updated[slot] = { ...updated[slot], prompt };
    } else {
      // fill any gaps up to slot with placeholders
      for (let i = updated.length; i < slot; i++) {
        updated[i] = { prompt: "", answer: "" };
      }
      updated[slot] = { prompt, answer: "" };
    }
    onChange(updated.filter((r) => r.prompt)); // remove any gap placeholders
    setOpenSlot(null);
  }

  function updateAnswer(index: number, answer: string) {
    onChange(responses.map((r, i) => (i === index ? { ...r, answer } : r)));
  }

  function removeSlot(index: number) {
    onChange(responses.filter((_, i) => i !== index));
    if (openSlot === index) setOpenSlot(null);
  }

  // Always show MAX_PROMPTS slots
  const slots = Array.from({ length: MAX_PROMPTS }, (_, i) => responses[i] ?? null);

  return (
    <div className="flex flex-col gap-3">
      {slots.map((response, i) => (
        <div key={i}>
          {/* Filled slot */}
          {response ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-primary/30 bg-white overflow-hidden"
            >
              <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-2">
                <p className="text-sm font-semibold text-primary leading-snug flex-1">
                  {response.prompt}
                </p>
                <button
                  type="button"
                  onClick={() => removeSlot(i)}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-ink-muted hover:text-danger hover:bg-surface transition-colors"
                >
                  ×
                </button>
              </div>
              <textarea
                value={response.answer}
                onChange={(e) => updateAnswer(i, e.target.value)}
                placeholder="Write your answer…"
                maxLength={300}
                rows={3}
                className="w-full px-4 pb-2 text-base text-ink placeholder-ink-muted bg-transparent resize-none focus:outline-none leading-relaxed"
              />
              <div className="px-4 pb-3 flex justify-end">
                <span className="text-xs text-ink-muted">{response.answer.length}/300</span>
              </div>
            </motion.div>
          ) : (
            /* Empty slot — tap to expand prompt list inline */
            <div>
              <button
                type="button"
                onClick={() => setOpenSlot(openSlot === i ? null : i)}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-dashed border-divider bg-white hover:border-primary-light hover:bg-surface transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary-pale flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="text-sm text-ink-secondary font-medium">Add a prompt</span>
                <svg
                  className={`w-4 h-4 text-ink-muted ml-auto transition-transform duration-200 ${openSlot === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 16 16"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Inline prompt list */}
              <AnimatePresence>
                {openSlot === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-2xl border-2 border-divider bg-white overflow-hidden divide-y divide-divider">
                      {PROMPTS.map((prompt) => {
                        const isUsed = usedPrompts.includes(prompt);
                        return (
                          <button
                            key={prompt}
                            type="button"
                            disabled={isUsed}
                            onClick={() => selectPrompt(i, prompt)}
                            className={`w-full text-left px-4 py-3 text-sm leading-snug transition-colors
                              ${isUsed
                                ? "text-ink-muted opacity-40 cursor-not-allowed"
                                : "text-ink hover:bg-primary-pale hover:text-primary"
                              }`}
                          >
                            {prompt}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
