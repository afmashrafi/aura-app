"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { signOut } from "@aura/api";

function Icon({ d, d2 }: { d: string; d2?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {d2 && <path d={d2} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>}
    </svg>
  );
}

const ICONS = {
  home:     <Icon d="M2 7.5L9 2l7 5.5V15a1 1 0 01-1 1H3a1 1 0 01-1-1V7.5z" d2="M6 16v-5h6v5" />,
  discover: <Icon d="M9 2a7 7 0 100 14A7 7 0 009 2z" d2="M9 6v3l2 2" />,
  matches:  <Icon d="M9 14.5S2 10.5 2 5.5A3.5 3.5 0 019 3a3.5 3.5 0 017 2.5C16 10.5 9 14.5 9 14.5z" />,
  chats:    <Icon d="M2 10a7 7 0 0014 0 7 7 0 00-14 0zm5 0h.01M9 10h.01M11 10h.01" />,
  insights: <Icon d="M2 14h2.5V9H2v5zm4 0h2.5V5H6v9zm4 0h2.5V7H10v7zm4 0h2V2h-2v12z" />,
  settings: <Icon d="M9 11a2 2 0 100-4 2 2 0 000 4zm5.5-2a5.5 5.5 0 01-.4 2l1.6 1.3-1.5 2.6-1.9-.7a5.5 5.5 0 01-1.7 1l-.3 2h-3l-.3-2a5.5 5.5 0 01-1.7-1l-1.9.7L2.9 12.3 4.5 11A5.5 5.5 0 013.5 9a5.5 5.5 0 01.4-2L2.3 5.7l1.5-2.6 1.9.7A5.5 5.5 0 017.4 2.8L7.7.8h3l.3 2a5.5 5.5 0 011.7 1l1.9-.7 1.5 2.6L14.5 7A5.5 5.5 0 0114.5 9z" />,
  logout:   <Icon d="M12 9l3 3m0 0l-3 3m3-3H7m5-7h3a1 1 0 011 1v10a1 1 0 01-1 1h-3" />,
};

function SidebarItem({ href, label, icon, active }: { href: string; label: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all"
      style={{ background: active ? "#F5F5F5" : "transparent", color: active ? "#000" : "#6B7280", fontWeight: active ? 500 : 400 }}
    >
      {icon}
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
    if (profile && !profile.questionnaire_completed && !pathname.startsWith("/questionnaire") && !pathname.startsWith("/profile-setup")) {
      router.replace("/questionnaire");
    }
  }, [user, profile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-6 h-6 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }
  if (!user) return null;

  const isChat = pathname.startsWith("/chat/");
  const isQ = pathname.startsWith("/questionnaire") || pathname.startsWith("/profile-setup");

  const navItems = [
    { href: "/matches",       label: "Home",     icon: ICONS.home,     active: pathname === "/matches" },
    { href: "/questionnaire", label: "Discover", icon: ICONS.discover, active: isQ },
    { href: "/chat",          label: "Chats",    icon: ICONS.chats,    active: pathname === "/chat" || isChat },
    { href: "/liked",         label: "Matches",  icon: ICONS.matches,  active: pathname === "/liked" },
    { href: "/insights",      label: "Insights", icon: ICONS.insights, active: pathname === "/insights" },
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[#E5E5E5] px-3 py-5 sticky top-0 h-screen overflow-y-auto">
        <Link href="/matches" className="font-brand text-lg font-bold text-black px-3 mb-6 block">
          aura
        </Link>
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => <SidebarItem key={item.label} {...item} />)}
        </nav>
        <div className="flex flex-col gap-0.5 pt-2 border-t border-[#E5E5E5]">
          <SidebarItem href="/settings" label="Settings" icon={ICONS.settings} active={pathname === "/settings"} />
          <button
            onClick={async () => { await signOut(); router.push("/"); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#6B7280] hover:bg-[#F5F5F5] hover:text-black transition-all w-full text-left"
          >
            {ICONS.logout} Logout
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E5E5E5] px-5 h-14 flex items-center justify-between shrink-0">
          <span className="font-brand text-lg font-bold text-black">aura</span>
          {!isChat && (
            <button onClick={async () => { await signOut(); router.push("/"); }} className="text-sm text-[#6B7280]">
              Logout
            </button>
          )}
        </header>

        <main className="flex-1 pb-16 lg:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E5E5E5]" style={{ height: 56 }}>
          <div className="flex h-full">
            {navItems.slice(0, 4).map((tab) => (
              <Link key={tab.href} href={tab.href} className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors">
                <span style={{ color: tab.active ? "#000" : "#9CA3AF" }}>{tab.icon}</span>
                <span className="text-[9px] font-medium" style={{ color: tab.active ? "#000" : "#9CA3AF" }}>{tab.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
