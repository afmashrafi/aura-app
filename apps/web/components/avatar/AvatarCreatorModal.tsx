"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AvatarCreatorModalProps {
  open: boolean;
  onClose: () => void;
  onAvatarExported: (glbUrl: string) => void;
  existingUrl?: string | null;
}

// Use the Ready Player Me demo subdomain (works without account sign-up).
// For production register free at readyplayer.me and replace "demo" with your subdomain.
const RPM_SUBDOMAIN = "demo";

function buildRpmUrl(existingGlbUrl?: string | null): string {
  const base = `https://${RPM_SUBDOMAIN}.readyplayer.me/avatar?frameApi&clearCache`;
  if (existingGlbUrl) {
    // Strip .glb to get the avatar ID and pass it so the editor loads the existing avatar
    const id = existingGlbUrl.split("/").pop()?.replace(/\.glb.*$/, "");
    if (id) return `${base}&avatarId=${id}`;
  }
  return base;
}

export function AvatarCreatorModal({
  open,
  onClose,
  onAvatarExported,
  existingUrl,
}: AvatarCreatorModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Listen for postMessage events from the RPM iframe
  useEffect(() => {
    if (!open) return;

    function handleMessage(event: MessageEvent) {
      // Only accept messages from readyplayer.me
      if (!event.origin.includes("readyplayer.me")) return;

      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        // Avatar exported event
        if (data?.source === "readyplayerme" && data?.eventName === "v1.avatar.exported") {
          const url: string = data.data?.url;
          if (url) {
            setExporting(false);
            onAvatarExported(url);
          }
        }

        // User clicked "Done" / initiated export
        if (data?.source === "readyplayerme" && data?.eventName === "v1.user.set") {
          setExporting(true);
        }

        // Frame ready
        if (data?.source === "readyplayerme" && data?.eventName === "v1.frame.ready") {
          // Subscribe to avatar export events
          iframeRef.current?.contentWindow?.postMessage(
            JSON.stringify({
              target: "readyplayerme",
              type: "subscribe",
              eventName: "v1.avatar.exported",
            }),
            "*"
          );
        }
      } catch {
        // ignore parse errors
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [open, onAvatarExported]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-4 h-14 bg-ink/90 backdrop-blur">
            <div className="flex items-center gap-3">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="16" r="9" fill="#8080FF" opacity="0.7" />
                <circle cx="21" cy="16" r="9" fill="#ABABFF" opacity="0.65" />
              </svg>
              <span className="text-white font-display font-semibold text-base">
                {exporting ? "Saving your avatar…" : "Create your 3D avatar"}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Loading overlay */}
          <AnimatePresence>
            {(loading || exporting) && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-ink/95"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full border-2 border-primary-light border-t-transparent mb-4"
                />
                <p className="text-white/70 text-sm font-medium">
                  {exporting ? "Saving your avatar…" : "Loading avatar creator…"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RPM iframe */}
          <iframe
            ref={iframeRef}
            src={buildRpmUrl(existingUrl)}
            allow="camera *; microphone *; clipboard-write"
            className="flex-1 w-full border-0"
            onLoad={() => setLoading(false)}
            title="3D Avatar Creator"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
