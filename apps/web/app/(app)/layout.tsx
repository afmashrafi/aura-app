"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { signOut } from "@aura/api";

function NavTab({
  href, label, active, icon, activeIcon,
}: {
  href: string; label: string; active: boolean;
  icon: React.ReactNode; activeIcon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-[3px] flex-1 py-1 relative"
      aria-current={active ? "page" : undefined}
    >
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full bg-primary" />
      )}
      <span className={`transition-all duration-200 ${active ? "text-primary" : "text-ink-muted"}`}>
        {active ? activeIcon : icon}
      </span>
      <span className="text-[10px] font-bold tracking-wide" style={{ color: active ? "#8080FF" : "#9090BB" }}>
        {label.toUpperCase()}
      </span>
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace("/sign-in"); return; }
    if (profile && !profile.questionnaire_completed && pathname !== "/questionnaire") {
      router.replace("/questionnaire");
    }
    if (profile && profile.questionnaire_completed && pathname === "/questionnaire") {
      router.replace("/profile-setup");
    }
  }, [user, profile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isQuestionnaire = pathname === "/questionnaire";
  const isChat = pathname.startsWith("/chat/");

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F8FF" }}>
      {/* Top header */}
      {!isQuestionnaire && (
        <header
          className="sticky top-0 z-40"
          style={{
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid #EBEBFF",
          }}
        >
          <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/matches" className="font-brand text-xl font-bold text-ink">
              Aura
            </Link>
            {!isChat && (
              <button
                onClick={async () => { await signOut(); router.push("/"); }}
                className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
              >
                Sign out
              </button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {/* Bottom nav — 3 tabs, Bumble-style */}
      {!isQuestionnaire && (
        <nav
          className="sticky bottom-0 z-40"
          style={{
            background: "rgba(255,255,255,0.97)",
            borderTop: "1px solid #EBEBFF",
            boxShadow: "0 -4px 24px rgba(128,128,255,0.07)",
          }}
        >
          <div className="max-w-lg mx-auto flex" style={{ height: "60px" }}>
            <NavTab
              href="/matches"
              label="Matches"
              active={pathname === "/matches"}
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              activeIcon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#8080FF">
                  <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    stroke="#8080FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <NavTab
              href="/chat"
              label="Chats"
              active={pathname === "/chat" || isChat}
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              activeIcon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#8080FF">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke="#8080FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
            <NavTab
              href="/profile"
              label="Profile"
              active={pathname === "/profile"}
              icon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              activeIcon={
                <svg width="26" height="26" viewBox="0 0 24 24" fill="#8080FF">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    stroke="#8080FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          </div>
        </nav>
      )}
    </div>
  );
}
