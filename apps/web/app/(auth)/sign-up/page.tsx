"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { signUp } from "@aura/api";

const GENDER_OPTIONS = ["Man", "Woman", "Non-binary", "Prefer not to say"] as const;
const INTEREST_OPTIONS = ["Men", "Women", "Non-binary people"] as const;

function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function SelectRow({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between w-full px-5 h-[60px] rounded-2xl text-base font-medium transition-all text-left"
      style={{
        background: selected ? "#F5F5F5" : "#F5F5F5",
        border: `2px solid ${selected ? "#000000" : "transparent"}`,
        color: "#000000",
      }}
    >
      <span>{label}</span>
      <motion.div
        animate={{ scale: selected ? 1 : 0.5, opacity: selected ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-7 h-7 rounded-full bg-black flex items-center justify-center shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2.5 7l3 3 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </motion.button>
  );
}

function CircleNext({ onClick, disabled, loading }: { onClick: () => void; disabled: boolean; loading: boolean }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.9 }}
      className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-all"
      style={{
        background: disabled ? "#E5E5E5" : "#000000",
      }}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white"
        />
      ) : (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M5 11h12M12 5l6 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </motion.button>
  );
}

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [interestedIn, setInterestedIn] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function goNext() { setDir(1); setStep((s) => s + 1); setServerError(""); }
  function goBack() { setDir(-1); setStep((s) => s - 1); setServerError(""); }
  function toggleInterest(o: string) {
    setInterestedIn((prev) => prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o]);
  }

  function canAdvance(): boolean {
    if (step === 0) return firstName.trim().length >= 1;
    if (step === 1) return email.includes("@") && password.length >= 8;
    if (step === 2) return !!dob && getAge(dob) >= 18;
    if (step === 3) return !!gender;
    if (step === 4) return interestedIn.length > 0;
    return true;
  }

  async function handleFinish() {
    if (!canAdvance()) return;
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

  const STEPS = [
    {
      question: "What's your first name?",
      hint: "This is how you'll appear to your matches.",
      content: (
        <input
          type="text"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          autoComplete="given-name"
          className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black placeholder-[#9CA3AF] text-base focus:outline-none focus:border-black transition-colors"
        />
      ),
    },
    {
      question: "Create your account",
      hint: "We'll never share your email with anyone.",
      content: (
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black placeholder-[#9CA3AF] text-base focus:outline-none focus:border-black transition-colors"
          />
          <input
            type="password"
            placeholder="Password (min. 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black placeholder-[#9CA3AF] text-base focus:outline-none focus:border-black transition-colors"
          />
        </div>
      ),
    },
    {
      question: "When's your birthday?",
      hint: "Your age will be shown on your profile. You must be 18+.",
      content: (
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
          className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F5] border border-transparent text-black text-base focus:outline-none focus:border-black transition-colors"
        />
      ),
    },
    {
      question: "I identify as…",
      hint: "You'll only be shown to people looking to meet your gender.",
      content: (
        <div className="flex flex-col gap-3">
          {GENDER_OPTIONS.map((o) => (
            <SelectRow key={o} label={o} selected={gender === o} onClick={() => setGender(o)} />
          ))}
        </div>
      ),
    },
    {
      question: "Who would you like to meet?",
      hint: "You can choose more than one answer and change it any time.",
      content: (
        <div className="flex flex-col gap-3">
          {INTEREST_OPTIONS.map((o) => (
            <SelectRow key={o} label={o} selected={interestedIn.includes(o)} onClick={() => toggleInterest(o)} />
          ))}
        </div>
      ),
    },
  ];

  const isLast = step === TOTAL_STEPS - 1;
  const current = STEPS[step];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Progress bar */}
      <div className="h-1 bg-[#F5F5F5] w-full shrink-0">
        <motion.div
          className="h-full bg-black rounded-full"
          animate={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between px-5 h-14">
        <Link href="/" className="font-brand text-xl font-bold text-black">aura</Link>
        <Link href="/sign-in" className="text-sm font-medium text-[#6B7280] hover:text-black transition-colors">
          Sign in
        </Link>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pt-2 pb-8 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col flex-1"
          >
            {/* Question */}
            <h1
              className="font-display font-black leading-tight mb-2 text-black"
              style={{ fontSize: "clamp(28px, 8vw, 38px)" }}
            >
              {current.question}
            </h1>
            <p className="text-sm mb-7 leading-relaxed text-[#6B7280]">
              {current.hint}
            </p>

            {/* Fields */}
            <div className="flex-1 overflow-y-auto">
              {current.content}
            </div>

            {serverError && (
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-red-500 text-center bg-red-50 rounded-xl p-3 mt-4"
              >
                {serverError}
              </motion.p>
            )}

            {/* Navigation row */}
            <div className="flex items-center justify-between mt-8">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#6B7280] hover:text-black transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back
                </button>
              ) : <div />}

              <CircleNext
                onClick={isLast ? handleFinish : goNext}
                disabled={!canAdvance()}
                loading={isLast ? loading : false}
              />
            </div>

            {step === 0 && (
              <p className="text-center text-xs mt-5 text-[#6B7280]">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold underline text-black">Sign in</Link>
              </p>
            )}

            {isLast && (
              <p className="text-center text-xs mt-4 leading-relaxed text-[#6B7280]">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
