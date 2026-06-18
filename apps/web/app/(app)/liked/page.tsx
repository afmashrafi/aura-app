"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAKE_LIKERS = [
  { name: "Amina", age: 24, city: "London", match: 89 },
  { name: "Sarah", age: 27, city: "Manchester", match: 82 },
  { name: "Fatima", age: 25, city: "Birmingham", match: 76 },
];

const PRO_FEATURES = [
  "See who liked your profile",
  "Browse their real photos",
  "Send unlimited messages first",
  "Priority matching algorithm",
  "Advanced compatibility insights",
  "Ad-free experience",
];

function ProPaywallModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-end md:items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        className="bg-white rounded-3xl w-full max-w-md p-7 relative"
      >
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-sm font-bold">×</button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto mb-3">Pro</div>
          <h2 className="font-display font-black text-2xl text-black mb-1">Upgrade to Aura Pro</h2>
          <p className="text-sm text-[#6B7280]">Unlock who liked you + real photos</p>
        </div>

        {/* Features */}
        <div className="mb-6 space-y-2.5">
          {PRO_FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[#111]">{f}</span>
            </div>
          ))}
        </div>

        {/* Pricing toggle */}
        <div className="flex gap-3 mb-5">
          {(["monthly", "yearly"] as const).map((plan) => (
            <button
              key={plan}
              onClick={() => setSelected(plan)}
              className="flex-1 border rounded-2xl p-4 text-left transition-all"
              style={{ borderColor: selected === plan ? "#000" : "#E5E5E5", background: selected === plan ? "#F5F5F5" : "white" }}
            >
              <p className="font-bold text-sm text-black capitalize">{plan}</p>
              <p className="text-xl font-black text-black">{plan === "monthly" ? "£9.99" : "£59.99"}<span className="text-xs font-normal text-[#6B7280]">/mo</span></p>
              {plan === "yearly" && <p className="text-[10px] font-semibold bg-black text-white px-2 py-0.5 rounded-full inline-block mt-1">Save 50%</p>}
            </button>
          ))}
        </div>

        <button className="w-full bg-black text-white font-bold py-4 rounded-2xl text-base hover:bg-[#111] transition-colors">
          Start 7-day free trial
        </button>
        <p className="text-center text-xs text-[#6B7280] mt-3">Cancel anytime. No hidden fees.</p>
      </motion.div>
    </motion.div>
  );
}

export default function LikedYouPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="max-w-2xl mx-auto px-5 pt-6 pb-8">
        <div className="mb-6">
          <p className="text-sm text-[#6B7280] mb-1">Discover</p>
          <h1 className="font-display font-black text-[28px] text-black">People who liked you</h1>
        </div>

        {/* Locked notice */}
        <div
          className="rounded-2xl p-5 mb-6 flex items-center gap-4 cursor-pointer hover:bg-[#EFEFEF] transition-colors"
          style={{ background: "#F5F5F5" }}
          onClick={() => setShowModal(true)}
        >
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-lg font-black shrink-0">Pro</div>
          <div className="flex-1">
            <p className="font-bold text-black text-sm">Unlock Aura Pro</p>
            <p className="text-xs text-[#6B7280]">{FAKE_LIKERS.length} people liked your profile — see who they are</p>
          </div>
          <span className="text-[#6B7280] text-lg">→</span>
        </div>

        {/* Blurred liker cards */}
        <div className="relative space-y-3">
          {FAKE_LIKERS.map((liker, i) => (
            <div
              key={liker.name}
              className="relative rounded-2xl overflow-hidden"
              style={{ filter: "blur(6px)", opacity: 1 - i * 0.15, userSelect: "none" }}
            >
              <div className="bg-[#F5F5F5] p-5 flex items-center gap-4">
                {/* Avatar placeholder */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5E5E5] to-[#D5D5D5] shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-black">{liker.name}, {liker.age}</p>
                  <p className="text-sm text-[#6B7280]">{liker.city}</p>
                  <div className="mt-1 inline-flex items-center gap-1 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {liker.match}% match
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center text-lg">✕</button>
                  <button className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-lg">♡</button>
                </div>
              </div>
            </div>
          ))}

          {/* Overlay unlock button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white font-bold px-7 py-3.5 rounded-2xl text-sm shadow-2xl hover:bg-[#111] transition-colors"
            >
              🔒 Unlock {FAKE_LIKERS.length} people who liked you
            </button>
          </div>
        </div>

        {/* What you get with Pro */}
        <div className="mt-8 border border-[#E5E5E5] rounded-2xl p-5">
          <h3 className="font-bold text-black mb-4">With Aura Pro, you get</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "👁", title: "See who liked you", desc: "Real photos revealed" },
              { icon: "∞", title: "Unlimited messages", desc: "Message anyone first" },
              { icon: "🎯", title: "Priority matching", desc: "Featured in discoveries" },
              { icon: "✦", title: "No ads ever", desc: "Pure experience" },
            ].map((item) => (
              <div key={item.title} className="bg-[#F5F5F5] rounded-xl p-4">
                <span className="text-xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-bold text-black">{item.title}</p>
                <p className="text-xs text-[#6B7280]">{item.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 bg-black text-white font-bold py-3.5 rounded-xl text-sm hover:bg-[#111] transition-colors"
          >
            Start free trial
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && <ProPaywallModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </>
  );
}
