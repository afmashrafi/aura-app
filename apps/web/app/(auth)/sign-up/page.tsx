"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signUp } from "@aura/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pill } from "@/components/ui/Pill";

const GENDER_OPTIONS = ["Man", "Woman", "Non-binary", "Prefer not to say"] as const;
const INTEREST_OPTIONS = ["Men", "Women", "Everyone"] as const;

function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function toggleInterest(option: string) {
    setInterestedIn((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  }

  function validateStep0(): boolean {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateStep1(): boolean {
    const errs: Record<string, string> = {};
    if (!dob) {
      errs.dob = "Date of birth is required.";
    } else if (getAge(dob) < 18) {
      errs.dob = "You must be at least 18 years old.";
    }
    if (!gender) errs.gender = "Please select a gender identity.";
    if (interestedIn.length === 0)
      errs.interestedIn = "Please select at least one option.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleNext() {
    if (validateStep0()) {
      setErrors({});
      setStep(1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep1()) return;
    setLoading(true);
    setServerError("");
    try {
      await signUp(email, password, firstName, dob, gender, interestedIn);
      router.push("/questionnaire");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message
        : typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: unknown }).message)
        : "Something went wrong. Please try again.";
      setServerError(msg);
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
      <div className="relative flex flex-col items-center justify-center pt-14 pb-8 px-6 overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute w-72 h-72 rounded-full opacity-50 -top-16 -left-16"
            style={{ background: "radial-gradient(circle, #FFFFFF, transparent 65%)" }} />
          <div className="absolute w-56 h-56 rounded-full opacity-35 -top-8 right-0"
            style={{ background: "radial-gradient(circle, #F3F3FF, transparent 65%)" }} />
        </div>

        {/* Floating pills */}
        {[
          { text: "ENFP",      x: "6%",  y: "16%", r: "-7deg" },
          { text: "anime fan", x: "66%", y: "10%", r: "5deg"  },
          { text: "dreamer",   x: "74%", y: "58%", r: "-6deg" },
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
          className="relative z-10 mb-4"
        >
          <Link href="/">
            <div
              className="glass w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            >
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
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
          className="relative z-10 font-display text-[28px] font-bold leading-tight text-center mb-1.5"
          style={{ color: "#1E1B4B" }}
        >
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.4 }}
          className="relative z-10 text-sm text-center"
          style={{ color: "#5B5B8A" }}
        >
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold underline underline-offset-2" style={{ color: "#3D3A7A" }}>
            Sign in
          </Link>
        </motion.p>

        {/* Step dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 flex items-center gap-2 mt-5"
        >
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "24px" : "8px",
                background: i === step ? "#1E1B4B" : "rgba(30,27,75,0.25)",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 rounded-t-[32px] px-6 pt-8 pb-10 overflow-y-auto"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderTop: "1.5px solid rgba(255,255,255,0.9)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.95), 0 -8px 40px rgba(128,128,255,0.10)",
        }}
      >
        <div className="max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090BB" }}>
                  Step 1 of 2 — Your basics
                </p>
                <Input
                  label="First name"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={errors.firstName}
                  autoComplete="given-name"
                />
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
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  autoComplete="new-password"
                />
                <Button onClick={handleNext} className="w-full h-14 text-base font-semibold rounded-2xl mt-1">
                  Continue
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
                noValidate
              >
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#9090BB" }}>
                  Step 2 of 2 — About you
                </p>

                <Input
                  label="Date of birth"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  error={errors.dob}
                  max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "#1E1B4B" }}>Gender identity</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="h-11 px-4 rounded-[12px] border text-base appearance-none focus:outline-none focus:ring-2 transition-all"
                    style={{
                      background: "#F3F3FF",
                      borderColor: errors.gender ? "#EF4444" : "#E0E0FF",
                      color: "#1E1B4B",
                    }}
                  >
                    <option value="" disabled>Select one</option>
                    {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.gender && <p className="text-sm text-danger" role="alert">{errors.gender}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium" style={{ color: "#1E1B4B" }}>Interested in</label>
                  <div className="flex flex-wrap gap-2" role="group">
                    {INTEREST_OPTIONS.map((o) => (
                      <Pill key={o} selected={interestedIn.includes(o)} onClick={() => toggleInterest(o)}>
                        {o}
                      </Pill>
                    ))}
                  </div>
                  {errors.interestedIn && <p className="text-sm text-danger" role="alert">{errors.interestedIn}</p>}
                </div>

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

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setStep(0); setErrors({}); }}
                    className="h-14 px-5 rounded-2xl font-semibold text-sm flex items-center gap-1.5 transition-colors shrink-0"
                    style={{ border: "1.5px solid #E0E0FF", color: "#5B5B8A", background: "white" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <Button type="submit" loading={loading} className="flex-1 h-14 text-base font-semibold rounded-2xl">
                    Create account
                  </Button>
                </div>

                <p className="text-xs text-center leading-relaxed" style={{ color: "#9090BB" }}>
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
