"use client";

import { useState } from "react";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import SectionCard from "@/shared/components/ui/SectionCard";

export default function PasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);

  return (
    <SectionCard className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-[#eef0fb] text-[#4338ca]">
          <ShieldCheck size={20} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-[#0f172a]">Password &amp; Security</h2>
          <p className="text-[12px] text-[#64748b]">Update your security credentials</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
            Current Password
          </label>
          <input
            type="password"
            defaultValue="••••••••••••"
            suppressHydrationWarning
            className="h-11 w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 text-[13px] text-[#1e293b] outline-none transition focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#e0e7ff]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              suppressHydrationWarning
              className="h-11 w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 pr-10 text-[13px] text-[#1e293b] outline-none transition placeholder:text-[#cbd5e1] focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#e0e7ff]"
            />
            <button
              type="button"
              onClick={() => setShowNew((s) => !s)}
              suppressHydrationWarning
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
              aria-label="Toggle password visibility"
            >
              {showNew ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <button type="button" suppressHydrationWarning className="text-[13px] font-semibold text-[#4338ca] hover:underline">
          Two-Factor Authentication is currently ON →
        </button>
      </div>
    </SectionCard>
  );
}
