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
      className="flex flex-col items-center justify-center gap-1 flex-1 py-2 relative transition-all"
      aria-current={active ? "page" : undefined}
    >
      <span className={`transition-all duration-200 ${active ? "scale-110" : "scale-100"}`}>
        {active ? activeIcon : icon}
      </span>
      <span
        className="text-[9px] font-bold tracking-wider uppercase"
        style={{ color: active ? "#9B7FE8" : "#9080B8" }}
      >
        {label}
      </span>
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: "#9B7FE8" }} />
      )}
    </Link>
  );
}

const HomeIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#9080B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HomeIconActive = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3l9 9" stroke="#9B7FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="#9B7FE8" fill="#EDE8FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ChatIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#9080B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ChatIconActive = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#EDE8FF">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#9B7FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HeartIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" stroke="#9080B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const HeartIconActive = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#EDE8FF">
    <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" stroke="#9B7FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PersonIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" stroke="#9080B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const PersonIconActive = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="4" fill="#EDE8FF" stroke="#9B7FE8" strokeWidth="2"/>
    <path d="M4.501 20.118a7.5 7.5 0 0114.998 0" stroke="#9B7FE8" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F9F7FF" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#C4AFF5", borderTopColor: "#9B7FE8" }} />
          <p className="text-sm font-medium" style={{ color: "#9080B8" }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isQuestionnaire = pathname === "/questionnaire";
  const isChat = pathname.startsWith("/chat/");

  const tabs = [
    { href: "/matches", label: "Home",      icon: HomeIcon,   activeIcon: HomeIconActive,   active: pathname === "/matches" },
    { href: "/chat",    label: "Chats",     icon: ChatIcon,   activeIcon: ChatIconActive,   active: pathname === "/chat" || isChat },
    { href: "/liked",   label: "Liked You", icon: HeartIcon,  activeIcon: HeartIconActive,  active: pathname === "/liked" },
    { href: "/profile", label: "Profile",   icon: PersonIcon, activeIcon: PersonIconActive, active: pathname === "/profile" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F9F7FF" }}>
      {!isQuestionnaire && (
        <header
          className="sticky top-0 z-40"
          style={{
            background: "rgba(249,247,255,0.94)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid #E3D9FF",
          }}
        >
          <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
            <span className="font-brand text-xl font-bold" style={{ color: "#9B7FE8" }}>
              aura<sup className="text-xs font-normal">+</sup>
            </span>
            {!isChat && (
              <button
                onClick={async () => { await signOut(); router.push("/"); }}
                className="text-sm font-medium transition-colors"
                style={{ color: "#9080B8" }}
              >
                Sign out
              </button>
            )}
          </div>
        </header>
      )}

      <main className="flex-1">{children}</main>

      {!isQuestionnaire && (
        <nav
          className="sticky bottom-0 z-40"
          style={{
            background: "rgba(255,255,255,0.97)",
            borderTop: "1px solid #E3D9FF",
            boxShadow: "0 -4px 24px rgba(155,127,232,0.08)",
          }}
        >
          <div className="max-w-lg mx-auto flex" style={{ height: "64px" }}>
            {tabs.map((tab) => (
              <NavTab key={tab.href} {...tab} />
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
