"use client";

import Link from "next/link";
import { motion } from "framer-motion";

function PurpleBlob({ style }: { style?: React.CSSProperties }) {
  return (
    <motion.div
      className="rounded-full pointer-events-none absolute"
      style={style}
      animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.75, 0.55] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const STEPS = [
  { icon: "❓", title: "Answer",  desc: "Answer thoughtful questions about yourself." },
  { icon: "💜", title: "Match",   desc: "Our algorithm finds your most compatible match." },
  { icon: "💬", title: "Connect", desc: "Start a conversation in the built-in chat." },
  { icon: "🌱", title: "Grow",    desc: "Build real connections that go beyond appearances." },
];

const FEATURES = [
  { emoji: "🚫", label: "No Photos",       sub: "Focus on real you" },
  { emoji: "🎯", label: "Smart Matches",   sub: "Based on compatibility" },
  { emoji: "🛡️", label: "Safe & Secure",  sub: "Your privacy matters" },
  { emoji: "💬", label: "Meaningful Talks", sub: "Built-in secure chat" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#F9F7FF" }}>

      {/* ── Nav ── */}
      <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-brand text-2xl font-bold" style={{ color: "#9B7FE8" }}>
          aura<sup className="text-sm font-normal">+</sup>
        </span>
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "How it works", "About", "Safety", "Blog"].map((l) => (
            <a key={l} href="#" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: "#4A3870" }}>{l}</a>
          ))}
        </nav>
        <Link
          href="/sign-up"
          className="btn-glass-primary px-5 py-2.5 rounded-full text-sm font-semibold"
        >
          Download App
        </Link>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-20 flex flex-col md:flex-row items-center gap-12">
        {/* Blob illustration */}
        <div className="relative shrink-0 w-72 h-72 hidden md:block">
          <PurpleBlob style={{ width: 220, height: 220, top: 0, left: 0, background: "radial-gradient(circle at 38% 38%, #DDD6FE, #C4B5FD 50%, transparent 80%)" }} />
          <PurpleBlob style={{ width: 160, height: 160, bottom: 10, right: 0, background: "radial-gradient(circle at 40% 40%, #EDE9FE, #DDD6FE 50%, transparent 80%)", animationDelay: "2s" } as React.CSSProperties} />
          <PurpleBlob style={{ width: 100, height: 100, top: 80, right: 30, background: "radial-gradient(circle at 40% 40%, #FDE8EF, transparent 80%)", animationDelay: "4s" } as React.CSSProperties} />
          {[[36, 36], [200, 55], [120, 195]].map(([x, y], i) => (
            <motion.span
              key={i}
              className="absolute text-xl select-none"
              style={{ left: x, top: y, color: "#9B7FE8" }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 1.2 }}
            >✦</motion.span>
          ))}
        </div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1"
        >
          <h1 className="font-display font-black leading-tight mb-5" style={{ fontSize: "clamp(36px, 6vw, 60px)", color: "#1E1040" }}>
            Real connection.<br />
            <span style={{ color: "#9B7FE8" }}>Beyond appearances.</span>
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#4A3870", maxWidth: 380 }}>
            Aura matches you based on who you are, not how you look.<br />
            Real people. Real conversations. Real aura.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/sign-up" className="btn-glass-primary px-7 py-3.5 rounded-full text-base font-bold">
              Join Aura
            </Link>
            <Link href="/sign-in" className="flex items-center gap-2 text-base font-medium" style={{ color: "#4A3870" }}>
              Learn more
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="font-display font-bold text-[28px]" style={{ color: "#1E1040" }}>How Aura Works</h2>
          <div className="w-8 h-0.5 rounded-full mx-auto mt-2" style={{ background: "#9B7FE8" }} />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="rounded-3xl p-6 flex flex-col items-center text-center gap-3 bg-white"
              style={{ boxShadow: "0 2px 16px rgba(155,127,232,0.08)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: "#EDE8FF" }}>
                {step.icon}
              </div>
              <div>
                <p className="font-bold text-sm mb-1" style={{ color: "#9B7FE8" }}>{i + 1}. {step.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#4A3870" }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Vibes section ── */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #EDE8FF 0%, #F9F7FF 60%, #FDE8EF 100%)" }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8 p-10 md:p-16">
            <div className="relative w-56 h-56 shrink-0">
              <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 50% 60%, #C4AFF5 0%, #EDE8FF 50%, transparent 80%)" }} />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200" fill="none">
                <ellipse cx="100" cy="165" rx="55" ry="16" fill="#DDD6FE" opacity="0.5"/>
                <circle cx="82" cy="98" r="18" fill="#9B7FE8" opacity="0.75"/>
                <rect x="67" y="116" width="30" height="42" rx="12" fill="#9B7FE8" opacity="0.75"/>
                <circle cx="118" cy="98" r="18" fill="#C4AFF5" opacity="0.75"/>
                <rect x="103" y="116" width="30" height="42" rx="12" fill="#C4AFF5" opacity="0.75"/>
                <path d="M100 87c0 0-6-5-6-9a3.4 3.4 0 016 0 3.4 3.4 0 016 0c0 4-6 9-6 9z" fill="#FF6B9D" opacity="0.9"/>
              </svg>
              {[["💜", 8, 55], ["💬", 158, 28], ["✨", 148, 135]].map(([e, x, y], i) => (
                <motion.span
                  key={i}
                  className="absolute text-xl select-none"
                  style={{ left: x as number, top: y as number }}
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 2.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                >{e}</motion.span>
              ))}
            </div>
            <div>
              <h2 className="font-display font-black leading-tight mb-3" style={{ fontSize: "clamp(28px, 5vw, 42px)", color: "#1E1040" }}>
                It&apos;s about vibes.<br />It&apos;s about you.
              </h2>
              <p className="text-base" style={{ color: "#4A3870" }}>
                Be seen for your mind, your heart, and your aura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature bar ── */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div
          className="rounded-2xl grid grid-cols-2 md:grid-cols-4 bg-white"
          style={{ boxShadow: "0 2px 16px rgba(155,127,232,0.08)" }}
        >
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className={`flex items-center gap-3 py-5 px-6 ${i < 3 ? "border-b md:border-b-0 md:border-r" : ""}`}
              style={{ borderColor: "#E3D9FF" }}
            >
              <span className="text-2xl shrink-0">{f.emoji}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1E1040" }}>{f.label}</p>
                <p className="text-xs" style={{ color: "#9080B8" }}>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <div className="text-center pb-16">
        <Link href="/sign-up" className="btn-glass-primary inline-flex px-10 py-4 rounded-full text-base font-bold">
          Get started — it&apos;s free
        </Link>
        <p className="text-xs mt-4" style={{ color: "#9080B8" }}>
          Already have an account?{" "}
          <Link href="/sign-in" className="underline font-medium" style={{ color: "#9B7FE8" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
