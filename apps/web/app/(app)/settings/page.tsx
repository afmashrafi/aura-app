"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { signOut } from "@aura/api";
import { useAuth } from "@/app/providers";

function SettingsRow({
  label,
  sublabel,
  value,
  onClick,
  danger,
}: {
  label: string;
  sublabel?: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-4 px-5 text-left hover:bg-[#F5F5F5] transition-colors rounded-xl"
    >
      <div>
        <p className="text-sm font-medium" style={{ color: danger ? "#EF4444" : "#000000" }}>{label}</p>
        {sublabel && <p className="text-xs text-[#6B7280] mt-0.5">{sublabel}</p>}
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-[#6B7280]">{value}</span>}
        {onClick && !danger && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  );
}

function ToggleRow({ label, sublabel, checked, onChange }: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 px-5">
      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        {sublabel && <p className="text-xs text-[#6B7280] mt-0.5">{sublabel}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors"
        style={{ background: checked ? "#000000" : "#E5E5E5" }}
        aria-checked={checked}
        role="switch"
      >
        <span
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <div className="max-w-2xl mx-auto px-5 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-sm text-[#6B7280] mb-1">Manage</p>
        <h1 className="font-display font-black text-[28px] text-black mb-6">Settings</h1>
      </motion.div>

      {/* Account section */}
      <div className="bg-[#F5F5F5] rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E5E5E5]">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Account</p>
        </div>
        <SettingsRow
          label="Email address"
          sublabel="Your login email"
          value={user?.email ?? ""}
        />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <SettingsRow
          label="Change password"
          sublabel="Update your password"
          onClick={() => {}}
        />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <SettingsRow
          label="Edit profile"
          sublabel="Update your bio and preferences"
          onClick={() => router.push("/profile-setup")}
        />
      </div>

      {/* Preferences section */}
      <div className="bg-[#F5F5F5] rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E5E5E5]">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Preferences</p>
        </div>
        <SettingsRow
          label="Matching preferences"
          sublabel="Who you want to meet"
          onClick={() => {}}
        />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <SettingsRow
          label="Privacy settings"
          sublabel="Control your visibility"
          onClick={() => {}}
        />
      </div>

      {/* Notifications section */}
      <div className="bg-[#F5F5F5] rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E5E5E5]">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Notifications</p>
        </div>
        <ToggleRow
          label="New matches"
          sublabel="Get notified when you match with someone"
          checked={notifMatches}
          onChange={setNotifMatches}
        />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <ToggleRow
          label="Messages"
          sublabel="Get notified about new messages"
          checked={notifMessages}
          onChange={setNotifMessages}
        />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <ToggleRow
          label="Marketing emails"
          sublabel="Tips and product updates"
          checked={notifMarketing}
          onChange={setNotifMarketing}
        />
      </div>

      {/* Support section */}
      <div className="bg-[#F5F5F5] rounded-2xl mb-4 overflow-hidden">
        <div className="px-5 py-3 border-b border-[#E5E5E5]">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Support</p>
        </div>
        <SettingsRow label="Help & FAQ" onClick={() => {}} />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <SettingsRow label="Terms of Service" onClick={() => {}} />
        <div className="h-px bg-[#E5E5E5] mx-5" />
        <SettingsRow label="Privacy Policy" onClick={() => {}} />
      </div>

      {/* Sign out */}
      <div className="bg-[#F5F5F5] rounded-2xl mb-4 overflow-hidden">
        <SettingsRow label="Sign out" onClick={handleSignOut} />
      </div>

      {/* Danger zone */}
      <div className="border border-[#EF4444]/20 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[#EF4444]/10">
          <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wide">Danger Zone</p>
        </div>
        <SettingsRow
          label="Delete account"
          sublabel="Permanently delete your account and all data"
          onClick={() => setShowDeleteConfirm(true)}
          danger
        />
      </div>

      {/* Delete confirm modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-7">
            <h2 className="font-display font-black text-xl text-black mb-2">Delete account?</h2>
            <p className="text-sm text-[#6B7280] mb-6">
              This will permanently delete your account, matches, and all messages. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-[#E5E5E5] text-sm font-semibold text-[#6B7280] hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-[#EF4444] text-white text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
