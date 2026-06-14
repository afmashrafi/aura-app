"use client";

import { useRef, useState } from "react";

interface MessageInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled = false }: MessageInputProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || sending || disabled) return;
    setSending(true);
    setValue("");
    try {
      await onSend(trimmed);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-3 px-4 py-3 bg-white border-t border-divider">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
        rows={1}
        disabled={disabled || sending}
        className="flex-1 resize-none rounded-[20px] bg-surface border border-divider px-4 py-2.5 text-base text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-focus-ring focus:border-transparent transition-all duration-150 min-h-[44px] max-h-32 leading-relaxed"
        style={{ height: "auto" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "auto";
          el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
        }}
        aria-label="Message input"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim() || sending || disabled}
        aria-label="Send message"
        className="shrink-0 w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center transition-all duration-150 hover:bg-[#6D28D9] active:scale-[0.92] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path
            d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
