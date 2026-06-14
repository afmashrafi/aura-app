"use client";

import { use, useEffect, useRef, useState } from "react";
import {
  getMatchWithPartner,
  getMessages,
  markSeen,
  sendMessage,
  subscribeToMessages,
  supabase,
} from "@aura/api";
import type { Message } from "@aura/types";
import { useAuth } from "@/app/providers";
import { ChatBubble, TimestampDivider } from "@/components/chat/ChatBubble";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageInput } from "@/components/chat/MessageInput";
import type { MatchWithPartner } from "@aura/api";

const TIMESTAMP_GAP_MS = 30 * 60 * 1000;

function shouldShowTimestamp(messages: Message[], index: number): boolean {
  if (index === messages.length - 1) return true;
  const curr = new Date(messages[index].created_at).getTime();
  const next = new Date(messages[index + 1].created_at).getTime();
  return next - curr >= TIMESTAMP_GAP_MS;
}

function shouldShowDivider(messages: Message[], index: number): boolean {
  if (index === 0) return false;
  const prev = new Date(messages[index - 1].created_at);
  const curr = new Date(messages[index].created_at);
  return prev.toDateString() !== curr.toDateString();
}

export default function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = use(params);
  const { user } = useAuth();
  const [matchData, setMatchData] = useState<MatchWithPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNew = !sessionStorage.getItem(`chat-opened-${matchId}`);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      getMatchWithPartner(matchId, user.id),
      getMessages(matchId),
    ]).then(([md, msgs]) => {
      setMatchData(md);
      setMessages(msgs);
      setLoading(false);
      sessionStorage.setItem(`chat-opened-${matchId}`, "1");
    });

    markSeen(matchId, user.id).catch(() => {});

    const channel = subscribeToMessages(matchId, (msg) => {
      setMessages((prev) => {
        if (prev.find((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      if (msg.sender_id !== user.id) {
        markSeen(matchId, user.id).catch(() => {});
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(content: string) {
    if (!user) return;
    await sendMessage(matchId, user.id, content);
  }

  if (loading || !matchData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const { partner, match } = matchData;

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <ChatHeader
        partnerName={partner.first_name}
        sharedCategory={match.shared_highlights?.[0]}
        isNew={isNew}
      />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto flex flex-col gap-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary-pale flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <p className="text-ink-secondary text-sm">
                Say hello to {partner.first_name}!
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={msg.id}>
              {shouldShowDivider(messages, i) && (
                <TimestampDivider timestamp={msg.created_at} />
              )}
              <ChatBubble
                message={msg}
                isOwn={msg.sender_id === user?.id}
                showTimestamp={shouldShowTimestamp(messages, i)}
              />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Message input pinned at bottom */}
      <div className="max-w-lg mx-auto w-full">
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  );
}
