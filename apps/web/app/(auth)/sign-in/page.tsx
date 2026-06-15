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
  hidden: { opacity: 0, y: 14 },
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
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(160deg, #ABABFF 0%, #BFBFFF 35%, #D3D3FF 100%)" }}
    >
      {/* Hero header */}
      <div className="relative flex flex-col items-center justify-center pt-16 pb-10 px-6 overflow-hidden">
        {/* White glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute w-72 h-72 rounded-full opacity-50 -top-16 -left-16"
            style={{ background: "radial-gradient(circle, #FFFFFF, transparent 65%)" }} />
          <div className="absolute w-56 h-56 rounded-full opacity-35 -top-8 right-0"
            style={{ background: "radial-gradient(circle, #F3F3FF, transparent 65%)" }} />
        </div>

        {/* Floating pills */}
        {[
          { text: "INFJ",   x: "6%",  y: "18%", r: "-8deg" },
          { text: "reader", x: "68%", y: "14%", r: "6deg"  },
          { text: "poet",   x: "76%", y: "60%", r: "-5deg" },
        ].map((p, i) => (
          <motion.span
            key={p.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            className="glass-float absolute hidden sm:inline-block text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ left: p.x, top: p.y, rotate: p.r, color: "#5B5B8A" }}
          >
            {p.text}
          </motion.span>
        ))}

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative z-10 mb-5"
        >
          <Link href="/">
            <div
              className="glass w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="16" r="9" fill="#8080FF" opacity="0.7" />
                <circle cx="21" cy="16" r="9" fill="#ABABFF" opacity="0.65" />
              </svg>
            </div>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 font-display text-[32px] font-bold leading-tight text-center mb-2"
          style={{ color: "#1E1B4B" }}
        >
          Welcome back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="relative z-10 text-sm text-center"
          style={{ color: "#5B5B8A" }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold underline underline-offset-2" style={{ color: "#3D3A7A" }}>
            Sign up
          </Link>
        </motion.p>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 rounded-t-[32px] px-6 pt-8 pb-10"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderTop: "1.5px solid rgba(255,255,255,0.9)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 -8px 40px rgba(128,128,255,0.10)",
        }}
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
            <div className="flex-1 h-px" style={{ background: "#E6E6FF" }} />
            <span className="text-xs font-medium" style={{ color: "#9090BB" }}>OR</span>
            <div className="flex-1 h-px" style={{ background: "#E6E6FF" }} />
          </motion.div>

          {/* Features list */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="flex flex-col gap-3"
          >
            {[
              "Matched by personality, not photos",
              "Real-time chat with your matches",
              "Your data stays private",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E6E6FF" }}>
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6l2.5 2.5 4.5-5" stroke="#8080FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: "#5B5B8A" }}>{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
