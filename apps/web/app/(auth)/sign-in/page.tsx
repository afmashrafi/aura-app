"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@aura/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/app/providers";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function SignInPage() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await signIn(email, password);
      await refreshProfile();
      router.push("/matches");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #2D1B69 0%, #4C1D95 40%, #6D28D9 100%)" }}
    >
      {/* Hero header */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-10 px-6 overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute w-80 h-80 rounded-full opacity-20 -top-20 -left-20"
            style={{ background: "radial-gradient(circle, #A78BFA, transparent 70%)" }} />
          <div className="absolute w-60 h-60 rounded-full opacity-15 top-0 right-0"
            style={{ background: "radial-gradient(circle, #C4B5FD, transparent 70%)" }} />
        </div>

        {/* Floating pills */}
        {[
          { text: "INFJ", x: "8%",  y: "20%", r: "-8deg" },
          { text: "reader", x: "70%", y: "15%", r: "6deg" },
          { text: "poet",   x: "78%", y: "60%", r: "-5deg" },
        ].map((p, i) => (
          <motion.span
            key={p.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            className="absolute hidden sm:inline-block text-xs font-medium px-3 py-1.5 rounded-full"
            style={{
              left: p.x, top: p.y, rotate: p.r,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            {p.text}
          </motion.span>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 mb-5"
        >
          <Link href="/">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="16" r="9" fill="white" opacity="0.75" />
                <circle cx="21" cy="16" r="9" fill="white" opacity="0.45" />
              </svg>
            </div>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 font-display text-[32px] font-bold text-white leading-tight text-center mb-2"
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="relative z-10 text-sm text-center"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold underline underline-offset-2" style={{ color: "rgba(255,255,255,0.9)" }}>
            Sign up
          </Link>
        </motion.p>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-10"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
      >
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                autoComplete="email"
              />
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />
            </motion.div>

            {serverError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-danger text-center bg-danger/5 rounded-xl p-3"
                role="alert"
              >
                {serverError}
              </motion.p>
            )}

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="pt-1">
              <Button type="submit" loading={loading} className="w-full h-14 text-base font-semibold rounded-2xl">
                Sign in
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex items-center gap-3 my-6"
          >
            <div className="flex-1 h-px bg-divider" />
            <span className="text-xs text-ink-muted font-medium">OR</span>
            <div className="flex-1 h-px bg-divider" />
          </motion.div>

          {/* Features list */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-col gap-3"
          >
            {[
              { icon: "✦", text: "Matched by personality, not photos" },
              { icon: "✦", text: "Real-time chat with your matches" },
              { icon: "✦", text: "Your data stays private" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-primary text-xs">{f.icon}</span>
                <span className="text-sm text-ink-secondary">{f.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
