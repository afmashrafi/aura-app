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
    <div className="min-h-screen flex flex-col" style={{ background: "#F9F7FF" }}>
      {/* Top illustration area */}
      <div className="relative flex flex-col justify-end px-6 pt-12 pb-8 overflow-hidden" style={{ minHeight: "32vh" }}>
        {/* Background blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <motion.div
            className="absolute rounded-full"
            style={{ width: 260, height: 260, top: -80, left: -60, background: "radial-gradient(circle, rgba(196,175,245,0.5), transparent 70%)" }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{ width: 180, height: 180, top: -20, right: -40, background: "radial-gradient(circle, rgba(155,127,232,0.3), transparent 70%)" }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>

        <Link href="/" className="absolute top-12 left-6">
          <span className="font-brand text-xl font-bold" style={{ color: "#9B7FE8" }}>
            aura<sup className="text-xs font-normal">+</sup>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display font-black leading-none mb-2" style={{ fontSize: "clamp(36px, 11vw, 52px)", color: "#1E1040" }}>
            Welcome<br /><span style={{ color: "#9B7FE8" }}>back.</span>
          </h1>
          <p className="text-sm" style={{ color: "#9080B8" }}>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold underline-offset-2 underline" style={{ color: "#9B7FE8" }}>
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* White form card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-white rounded-t-[32px] px-6 pt-8 pb-12"
        style={{ boxShadow: "0 -4px 32px rgba(155,127,232,0.12)" }}
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

          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {["Personality-first", "Privacy-focused", "No photos"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: "#EDE8FF", color: "#9B7FE8" }}
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
