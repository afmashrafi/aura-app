import { motion } from "framer-motion";
import type { Message } from "@aura/types";

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showTimestamp?: boolean;
}

function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateDivider(ts: string) {
  return new Date(ts).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function TimestampDivider({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-divider" />
      <span className="text-xs text-ink-muted">{formatDateDivider(timestamp)}</span>
      <div className="flex-1 h-px bg-divider" />
    </div>
  );
}

export function ChatBubble({ message, isOwn, showTimestamp = false }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: isOwn ? 8 : -8 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col gap-1 ${isOwn ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-[18px] text-base leading-relaxed ${
          isOwn
            ? "bg-primary text-white rounded-br-[6px]"
            : "bg-surface text-ink rounded-bl-[6px] border border-divider"
        }`}
      >
        {message.content}
      </div>
      {showTimestamp && (
        <span className="text-xs text-ink-muted px-1">
          {formatTime(message.created_at)}
          {isOwn && message.seen && (
            <span className="ml-1 text-success">· Seen</span>
          )}
        </span>
      )}
    </motion.div>
  );
}
