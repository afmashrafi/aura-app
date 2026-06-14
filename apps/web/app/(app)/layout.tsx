"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { signOut } from "@aura/api";

function NavIcon({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 relative"
      aria-current={active ? "page" : undefined}
    >
      <span
        className={`transition-transform duration-200 ${active ? "scale-[1.15] text-primary" : "scale-100 text-ink-muted"}`}
      >
        {icon}
      </span>
      <span
        className={`text-xs font-medium transition-all duration-200 ${active ? "opacity-100 text-primary" : "opacity-0 text-ink-muted"}`}
      >
        {label}
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
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    if (
      profile &&
      !profile.questionnaire_completed &&
      pathname !== "/questionnaire"
    ) {
      router.replace("/questionnaire");
    }
  }, [user, profile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const isQuestionnaire = pathname === "/questionnaire";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar (hidden during questionnaire) */}
      {!isQuestionnaire && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-divider">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/matches" className="font-display text-xl text-ink">
              Aura
            </Link>
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>
      )}

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Bottom nav (hidden during questionnaire) */}
      {!isQuestionnaire && (
        <nav className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-md border-t border-divider">
          <div className="max-w-lg mx-auto px-8 h-16 flex items-center justify-around">
            <NavIcon
              href="/matches"
              label="Matches"
              active={pathname === "/matches"}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              }
            />
            <NavIcon
              href="/profile"
              label="Profile"
              active={pathname === "/profile"}
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />
          </div>
        </nav>
      )}
    </div>
  );
}
