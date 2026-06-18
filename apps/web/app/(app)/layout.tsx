"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/providers";
import { signOut } from "@aura/api";

// Sidebar nav items
const NAV = [
  { href: "/matches", label: "Home",     icon: "⌂" },
  { href: "/matches", label: "Matches",  icon: "♡" },
  { href: "/chat",    label: "Messages", icon: "💬" },
  { href: "/liked",   label: "Discover", icon: "◎" },
  { href: "/profile", label: "Profile",  icon: "◉" },
];

function SidebarLink({ href, label, icon, active }: { href: string; label: string; icon: string; active: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium"
      style={{
        background: active ? "#F5F5F5" : "transparent",
        color: active ? "#000000" : "#6B7280",
        fontWeight: active ? 600 : 400,
      }}
    >
      <span className="text-base w-5 text-center">{icon}</span>
      {label}
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
  }, [user, profile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-7 h-7 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const isQuestionnaire = pathname === "/questionnaire";
  const isChat = pathname.startsWith("/chat/");

  if (isQuestionnaire) return <>{children}</>;

  const mobileNav = [
    { href: "/matches", label: "Home",     activeWhen: pathname === "/matches" },
    { href: "/chat",    label: "Messages", activeWhen: pathname === "/chat" || isChat },
    { href: "/liked",   label: "Discover", activeWhen: pathname === "/liked" },
    { href: "/profile", label: "Profile",  activeWhen: pathname === "/profile" },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-[#E5E5E5] px-3 py-6 sticky top-0 h-screen">
        <Link href="/matches" className="font-brand text-xl font-bold text-black px-4 mb-8 block">
          aura
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map((item) => (
            <SidebarLink
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={
                item.href === "/matches" ? pathname === "/matches" :
                item.href === "/chat" ? pathname === "/chat" || isChat :
                pathname === item.href
              }
            />
          ))}
        </nav>
        <div className="flex flex-col gap-1">
          <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors">
            <span className="text-base w-5 text-center">⚙</span> Settings
          </Link>
          <button
            onClick={async () => { await signOut(); router.push("/"); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors w-full text-left"
          >
            <span className="text-base w-5 text-center">↩</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E5E5E5] px-5 h-14 flex items-center justify-between">
          <span className="font-brand text-lg font-bold text-black">aura</span>
          {!isChat && (
            <button onClick={async () => { await signOut(); router.push("/"); }} className="text-sm text-[#6B7280]">
              Logout
            </button>
          )}
        </header>

        <main className="flex-1 pb-20 lg:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5]">
          <div className="flex" style={{ height: "60px" }}>
            {mobileNav.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
              >
                <span className="text-[11px] font-semibold" style={{ color: tab.activeWhen ? "#000000" : "#9CA3AF" }}>
                  {tab.label}
                </span>
                {tab.activeWhen && <span className="w-1 h-1 rounded-full bg-black" />}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
