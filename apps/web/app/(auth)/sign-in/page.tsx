"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signIn } from "@aura/api";
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <Link href="/" className="font-brand text-xl font-bold text-black block mb-12">
          aura
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="font-display font-black leading-none mb-2 text-black" style={{ fontSize: "clamp(36px, 11vw, 52px)" }}>
            Welcome<br />back.
          </h1>
          <p className="text-sm text-[#6B7280]">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold underline underline-offset-2 text-black">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="flex-1 px-6 pb-12"
      >
        <div className="max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: errors.email ? "#EF4444" : undefined }}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-black">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black placeholder-[#9CA3AF] text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: errors.password ? "#EF4444" : undefined }}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            {serverError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center bg-red-50 rounded-xl p-3"
                role="alert"
              >
                {serverError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-black text-white text-base font-bold rounded-2xl mt-2 hover:bg-[#111] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : "Sign in"}
            </button>
          </form>

          <div className="flex flex-wrap gap-2 justify-center mt-8">
            {["Personality-first", "Privacy-focused", "No photos"].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#F5F5F5] text-[#6B7280]"
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
