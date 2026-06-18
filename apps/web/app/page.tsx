"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const PILLS = [
  { text: "INTJ",          rotate: "-6deg",  delay: 0,    x: "6%",   y: "10%",  parallax: -0.3 },
  { text: "bookworm",      rotate: "5deg",   delay: 0.1,  x: "70%",  y: "7%",   parallax: -0.5 },
  { text: "anime fan",     rotate: "-4deg",  delay: 0.15, x: "78%",  y: "26%",  parallax: -0.2 },
  { text: "night owl",     rotate: "7deg",   delay: 0.2,  x: "4%",   y: "36%",  parallax: -0.4 },
  { text: "music lover",   rotate: "-8deg",  delay: 0.05, x: "60%",  y: "54%",  parallax: -0.35 },
  { text: "film buff",     rotate: "4deg",   delay: 0.25, x: "8%",   y: "60%",  parallax: -0.25 },
  { text: "deep thinker",  rotate: "-5deg",  delay: 0.3,  x: "72%",  y: "70%",  parallax: -0.45 },
  { text: "coffee addict", rotate: "6deg",   delay: 0.1,  x: "12%",  y: "78%",  parallax: -0.3 },
  { text: "ENFP",          rotate: "-3deg",  delay: 0.35, x: "54%",  y: "84%",  parallax: -0.2 },
  { text: "poet",          rotate: "8deg",   delay: 0.2,  x: "80%",  y: "88%",  parallax: -0.4 },
];

const HOW_STEPS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3C8 3 3 8 3 14s5 11 11 11 11-5 11-11S20 3 14 3z" stroke="#8080FF" strokeWidth="1.8" fill="none"/>
        <path d="M10 14h8M14 10v8" stroke="#8080FF" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Answer 30 deep questions",
    desc: "Share your values, lifestyle, and what you're really looking for — no photos, no filters.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="10" cy="14" r="7" stroke="#8080FF" strokeWidth="1.8" fill="none"/>
        <circle cx="18" cy="14" r="7" stroke="#ABABFF" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
    title: "Get compatibility scores",
    desc: "Our algorithm weighs what matters — values count 4× more than lifestyle preferences.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 14c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z" stroke="#8080FF" strokeWidth="1.8" fill="none"/>
        <path d="M18 9c2.5 0 5 2 5 5s-2.5 5-5 5" stroke="#ABABFF" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M14 14h4" stroke="#8080FF" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: "Connect authentically",
    desc: "See exactly what you share, then start a real conversation based on who you both are.",
  },
];

const FEATURES = [
  { emoji: "🧠", title: "Personality-first", body: "We match on who you are, not what you look like. 30 questions reveal your true self." },
  { emoji: "🔒", title: "Private by design", body: "No photos. No location tracking. Your data stays yours — always encrypted end-to-end." },
  { emoji: "💜", title: "Depth over swipes", body: "One meaningful match beats a thousand hollow likes. Quality connections, not dopamine hits." },
];

function ParallaxPill({ pill, index, scrollYProgress }: {
  pill: typeof PILLS[number];
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const yVal = useTransform(scrollYProgress, [0, 0.4], [0, pill.parallax * 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 + pill.delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      style={{ left: pill.x, top: pill.y, y: yVal, opacity }}
      className="absolute hidden sm:block pointer-events-none select-none"
    >
      <motion.span
        animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
        transition={{ duration: 4 + index * 0.3, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
        className="glass-float inline-block px-4 py-2 rounded-full text-sm font-semibold"
        style={{ rotate: pill.rotate, color: "#5B5B8A" }}
      >
        {pill.text}
      </motion.span>
    </motion.div>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 });

  // Hero parallax transforms
  const heroY = useTransform(smoothProgress, [0, 0.35], [0, -120]);
  const heroScale = useTransform(smoothProgress, [0, 0.35], [1, 0.92]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);

  // Background gradient shift
  const bgOpacity1 = useTransform(smoothProgress, [0, 0.5, 1], [1, 0.6, 0.3]);
  const bgOpacity2 = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.4, 0.7]);

  // Section reveals
  const howOpacity = useTransform(scrollYProgress, [0.2, 0.38], [0, 1]);
  const howY = useTransform(scrollYProgress, [0.2, 0.38], [60, 0]);
  const featOpacity = useTransform(scrollYProgress, [0.55, 0.7], [0, 1]);
  const featY = useTransform(scrollYProgress, [0.55, 0.7], [60, 0]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-hidden"
      style={{ height: "320vh" }}
    >
      {/* Sticky gradient background that morphs with scroll */}
      <div className="sticky top-0 h-screen overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: bgOpacity1 }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #ABABFF 0%, #BFBFFF 30%, #D3D3FF 60%, #F3F3FF 100%)" }} />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{ opacity: bgOpacity2 }}
        >
          <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #7070CC 0%, #9090EE 30%, #ABABFF 60%, #D3D3FF 100%)" }} />
        </motion.div>

        {/* Radial glows */}
        <div className="absolute w-[560px] h-[560px] rounded-full -top-40 -left-40 opacity-40"
          style={{ background: "radial-gradient(circle, #FFFFFF, transparent 65%)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full -bottom-24 -right-24 opacity-30"
          style={{ background: "radial-gradient(circle, #E6E6FF, transparent 65%)" }} />

        {/* Cinematic orbs that drift in on scroll */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            opacity: useTransform(scrollYProgress, [0.15, 0.45], [0, 0.15]),
            scale: useTransform(scrollYProgress, [0.15, 0.45], [0.6, 1.1]),
            background: "radial-gradient(circle, #8080FF, transparent 70%)",
          }}
        />
      </div>

      {/* All scrollable content — position: sticky within the tall container */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Floating pills — parallax on scroll */}
        {PILLS.map((pill, i) => (
          <ParallaxPill key={pill.text} pill={pill} index={i} scrollYProgress={scrollYProgress} />
        ))}

        {/* ── HERO SECTION ── */}
        <motion.div
          ref={heroRef}
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full will-change-transform"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-7"
          >
            <div className="glass w-20 h-20 mx-auto rounded-[28px] flex items-center justify-center">
              <svg width="42" height="42" viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="16" r="9" fill="#8080FF" opacity="0.7" />
                <circle cx="21" cy="16" r="9" fill="#ABABFF" opacity="0.65" />
              </svg>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="font-brand text-[76px] leading-none mb-4 tracking-tight"
            style={{ color: "#1E1B4B" }}
          >
            Aura
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-[22px] font-display font-semibold leading-snug mb-3"
            style={{ color: "#3D3A7A" }}
          >
            Connect beyond the surface.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="text-base leading-relaxed mb-10"
            style={{ color: "#7070AA" }}
          >
            No photos. No swiping. Just real compatibility<br />based on who you actually are.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="flex flex-col gap-3 w-full"
          >
            <Link
              href="/sign-up"
              className="btn-glass-primary h-14 flex items-center justify-center rounded-2xl font-semibold text-base text-white"
            >
              Create your account
            </Link>
            <Link
              href="/sign-in"
              className="btn-glass-ghost h-14 flex items-center justify-center rounded-2xl font-semibold text-base"
              style={{ color: "#3D3A7A" }}
            >
              Sign in
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="mt-10 flex items-center gap-5"
          >
            {["Personality-first", "Privacy-focused", "No photos"].map((tag, i) => (
              <span key={tag} className="flex items-center gap-2 text-xs font-medium" style={{ color: "#9090BB" }}>
                {i !== 0 && <span className="w-1 h-1 rounded-full" style={{ background: "#BFBFFF" }} />}
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Scroll hint arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 2, repeat: Infinity, repeatDelay: 1 }}
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <span className="text-xs font-medium" style={{ color: "#9090BB" }}>scroll to explore</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M4 9l4 4 4-4" stroke="#ABABFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* ── HOW IT WORKS ── */}
        <motion.div
          style={{ opacity: howOpacity, y: howY }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 max-w-xl mx-auto w-full pointer-events-none"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "#8080FF" }}>
            How it works
          </p>
          <div className="flex flex-col gap-4">
            {HOW_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="glass rounded-2xl px-5 py-4 flex items-start gap-4 pointer-events-auto"
              >
                <div className="shrink-0 w-11 h-11 rounded-xl bg-primary-pale flex items-center justify-center">
                  {step.icon}
                </div>
                <div>
                  <p className="font-display font-semibold text-ink text-sm leading-tight mb-0.5">{step.title}</p>
                  <p className="text-ink-secondary text-xs leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FEATURES ── */}
        <motion.div
          style={{ opacity: featOpacity, y: featY }}
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 max-w-xl mx-auto w-full pointer-events-none"
        >
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-8" style={{ color: "#8080FF" }}>
            Built different
          </p>
          <div className="grid grid-cols-1 gap-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="glass rounded-2xl p-5 pointer-events-auto"
              >
                <div className="text-2xl mb-2">{f.emoji}</div>
                <p className="font-display font-semibold text-ink text-sm mb-1">{f.title}</p>
                <p className="text-ink-secondary text-xs leading-relaxed">{f.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 pointer-events-auto"
          >
            <Link
              href="/sign-up"
              className="btn-glass-primary h-14 flex items-center justify-center rounded-2xl font-semibold text-base text-white"
            >
              Find your match
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
