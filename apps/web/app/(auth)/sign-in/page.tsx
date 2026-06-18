"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@aura/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/app/providers";

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
      style={{ background: "linear-gradient(160deg, #0D0820 0%, #1A1040 50%, #0F0B2E 100%)" }}
    >
      {/* Dark hero top */}
      <div className="relative flex flex-col justify-end px-6 pt-16 pb-10 overflow-hidden" style={{ minHeight: "36vh" }}>
        {/* Glow orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute w-64 h-64 rounded-full -top-20 -left-20 opacity-20"
            style={{ background: "radial-gradient(circle, #8080FF, transparent 65%)" }} />
          <div className="absolute w-48 h-48 rounded-full top-0 right-0 opacity-15"
            style={{ background: "radial-gradient(circle, #ABABFF, transparent 65%)" }} />
        </div>

        <Link href="/" className="absolute top-14 left-6">
          <span className="font-brand text-xl text-white/80">Aura</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-display font-black uppercase leading-none mb-3"
            style={{ fontSize: "clamp(40px, 12vw, 60px)", color: "#FFFFFF" }}
          >
            WELCOME<br /><span style={{ color: "#ABABFF" }}>BACK</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold underline-offset-2 underline" style={{ color: "#ABABFF" }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* White bottom sheet */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-12"
        style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.25)" }}
      >
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />

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

            <Button
              type="submit"
              loading={loading}
              className="w-full h-14 text-base font-bold mt-2"
              style={{ borderRadius: "9999px" }}
            >
              Sign in
            </Button>
          </form>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {["Personality-first", "Privacy-focused", "No photos"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#F3F3FF", color: "#8080FF" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
