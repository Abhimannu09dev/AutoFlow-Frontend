"use client";

import { Search, Bell } from "lucide-react";

interface CustomerHeaderProps {
  userName: string;
  userRole: string;
}

export default function CustomerHeader({ userName, userRole }: CustomerHeaderProps) {
  return (
    <header className="border-b border-[#dde1ed] bg-white">
      <div className="flex h-13 items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <span className="text-[16px] font-bold text-[#4338ca] lg:hidden">AutoFlow</span>
          <label className="flex h-8 w-56 items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-3 text-[12px] text-[#9aa4b2] cursor-text">
            <Search size={13} aria-hidden="true" />
            Search components...
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button type="button" suppressHydrationWarning className="relative text-[#64748b] hover:text-[#1e293b]">
            <Bell size={19} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#ef4444]" />
          </button>
          <div className="flex items-center gap-2">
            <div className="text-right leading-tight">
              <p className="text-[12px] font-semibold text-[#0f172a]">{userName}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-[#4338ca]">{userRole}</p>
            </div>
            <div className="size-8 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
