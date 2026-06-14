"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signUp } from "@aura/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pill } from "@/components/ui/Pill";

const GENDER_OPTIONS = [
  "Man",
  "Woman",
  "Non-binary",
  "Prefer not to say",
] as const;

const INTEREST_OPTIONS = ["Men", "Women", "Everyone"] as const;

function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  }),
};

export default function SignUpPage() {
  const router = useRouter();
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

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address.";
    if (password.length < 8)
      errs.password = "Password must be at least 8 characters.";
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      await signUp(email, password, firstName, dob, gender, interestedIn);
      router.push("/questionnaire");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Something went wrong. Please try again.";
      setServerError(msg);
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
            Create your account
          </h1>
          <p className="text-ink-secondary text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <motion.div variants={fadeUp} custom={1}>
            <Input
              label="First name"
              placeholder="Your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              autoComplete="given-name"
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={2}>
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

          <motion.div variants={fadeUp} custom={3}>
            <Input
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
            <Input
              label="Date of birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              error={errors.dob}
              max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]}
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={5} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">
              Gender identity
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`h-11 px-4 bg-surface text-ink rounded-[12px] border ${
                errors.gender
                  ? "border-danger focus:ring-danger"
                  : "border-divider focus:ring-focus-ring"
              } focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150 text-base appearance-none`}
            >
              <option value="" disabled>
                Select one
              </option>
              {GENDER_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="text-sm text-danger" role="alert">
                {errors.gender}
              </p>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={6} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Interested in</label>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Interested in"
            >
              {INTEREST_OPTIONS.map((o) => (
                <Pill
                  key={o}
                  selected={interestedIn.includes(o)}
                  onClick={() => toggleInterest(o)}
                >
                  {o}
                </Pill>
              ))}
            </div>
            {errors.interestedIn && (
              <p className="text-sm text-danger" role="alert">
                {errors.interestedIn}
              </p>
            )}
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

          <motion.div variants={fadeUp} custom={7} className="mt-2">
            <Button type="submit" loading={loading} className="w-full h-13">
              Create account
            </Button>
          </motion.div>
        </form>

        <motion.p
          variants={fadeUp}
          custom={8}
          className="text-xs text-ink-muted text-center mt-6 leading-relaxed"
        >
          By creating an account you agree to our Terms of Service and Privacy
          Policy.
        </motion.p>
      </motion.div>
    </div>
  );
}
