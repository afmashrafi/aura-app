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
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
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
      // Auth layout handles redirect based on questionnaire_completed
      router.push("/matches");
    } catch (err: unknown) {
      setServerError(
        err instanceof Error ? err.message : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <motion.div
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.div variants={fadeUp} custom={0} className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary-pale flex items-center justify-center mx-auto">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <circle cx="11" cy="16" r="9" fill="#7C3AED" opacity="0.6" />
                <circle cx="21" cy="16" r="9" fill="#A78BFA" opacity="0.6" />
              </svg>
            </div>
          </Link>
          <h1 className="font-display text-[30px] text-ink leading-tight mb-2">
            Welcome back
          </h1>
          <p className="text-ink-secondary text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <motion.div variants={fadeUp} custom={1}>
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

          <motion.div variants={fadeUp} custom={2}>
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

          <motion.div variants={fadeUp} custom={3} className="mt-2">
            <Button type="submit" loading={loading} className="w-full h-13">
              Sign in
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
