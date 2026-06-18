"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const STEPS = [
  { icon: "❓", title: "Answer",  desc: "Answer thoughtful questions about yourself." },
  { icon: "♡",  title: "Match",   desc: "Our algorithm finds your most compatible match." },
  { icon: "💬", title: "Connect", desc: "Start a conversation in the built-in chat." },
  { icon: "🌱", title: "Grow",    desc: "Build real connections that go beyond appearances." },
];

const FEATURES = [
  { icon: "✕",  label: "No Photos",        sub: "Focus on the real you" },
  { icon: "◎",  label: "Smart Matches",    sub: "Based on compatibility" },
  { icon: "⊕",  label: "Safe & Secure",    sub: "Your privacy matters" },
  { icon: "💬", label: "Meaningful Talks", sub: "Built-in secure chat" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between border-b border-[#E5E5E5]">
        <span className="font-brand text-2xl font-bold text-black">aura</span>
        <nav className="hidden md:flex items-center gap-8">
          {["Home", "How it works", "About", "Safety"].map((l) => (
            <a key={l} href="#" className="text-sm font-medium text-[#6B7280] hover:text-black transition-colors">{l}</a>
          ))}
        </nav>
        <Link
          href="/sign-up"
          className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#111] transition-colors"
        >
          Get started
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 flex flex-col md:flex-row items-center gap-16">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h1 className="font-display font-black leading-tight mb-5 text-black" style={{ fontSize: "clamp(40px, 6vw, 68px)" }}>
            Real connections.<br />
            Beyond appearances.
          </h1>
          <p className="text-base leading-relaxed mb-8 text-[#6B7280]" style={{ maxWidth: 400 }}>
            Aura matches you based on who you are, not how you look. Real people. Real conversations.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/sign-up" className="bg-black text-white px-8 py-4 rounded-full text-base font-bold hover:bg-[#111] transition-colors">
              Join Aura — it&apos;s free
            </Link>
            <Link href="/sign-in" className="text-base font-medium text-[#6B7280] hover:text-black transition-colors">
              Sign in →
            </Link>
          </div>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden md:flex shrink-0 w-80 h-80 bg-[#F5F5F5] rounded-3xl items-center justify-center"
        >
          <div className="text-center">
            <div className="text-7xl mb-4">✦</div>
            <p className="text-sm font-medium text-[#6B7280]">Personality-first dating</p>
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-[28px] text-black mb-1">How Aura Works</h2>
          <div className="w-8 h-0.5 rounded-full bg-black" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
              className="rounded-3xl p-6 flex flex-col gap-3 bg-[#F5F5F5]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl border border-[#E5E5E5]">
                {step.icon}
              </div>
              <div>
                <p className="font-bold text-sm text-black mb-1">{i + 1}. {step.title}</p>
                <p className="text-xs leading-relaxed text-[#6B7280]">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tagline section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="bg-black rounded-3xl p-12 md:p-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-display font-black leading-tight mb-3 text-white" style={{ fontSize: "clamp(28px, 5vw, 42px)" }}>
              Be seen for your mind,<br />your heart, your aura.
            </h2>
            <p className="text-base text-white/60">
              We focus on who you are, not what you look like.
            </p>
          </div>
          <Link
            href="/sign-up"
            className="bg-white text-black font-bold px-8 py-4 rounded-full text-base hover:bg-[#F5F5F5] transition-colors shrink-0"
          >
            Start for free
          </Link>
        </div>
      </section>

      {/* Feature bar */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="rounded-2xl grid grid-cols-2 md:grid-cols-4 border border-[#E5E5E5]">
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className={`flex items-center gap-3 py-5 px-6 ${i < 3 ? "border-b md:border-b-0 md:border-r border-[#E5E5E5]" : ""}`}
            >
              <span className="text-xl shrink-0 font-bold text-black">{f.icon}</span>
              <div>
                <p className="text-sm font-bold text-black">{f.label}</p>
                <p className="text-xs text-[#6B7280]">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="text-center pb-20">
        <Link href="/sign-up" className="bg-black text-white inline-flex px-10 py-4 rounded-full text-base font-bold hover:bg-[#111] transition-colors">
          Get started — it&apos;s free
        </Link>
        <p className="text-xs mt-4 text-[#6B7280]">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline font-medium text-black">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
