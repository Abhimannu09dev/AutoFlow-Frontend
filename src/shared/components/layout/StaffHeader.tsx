"use client";

import { Search, Bell } from "lucide-react";

interface StaffHeaderProps {
  userName: string;
  userRole: string;
}

export default function StaffHeader({ userName, userRole }: StaffHeaderProps) {
  return (
    <header className="border-b border-[#dde1ed] bg-white">
      <div className="flex h-14 items-center justify-between px-6">
        <label className="flex h-9 w-full max-w-sm items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-4 text-[13px] text-[#9aa4b2] cursor-text">
          <Search size={15} aria-hidden="true" />
          <span>Search orders, parts, or customers...</span>
        </label>
        <div className="ml-4 flex shrink-0 items-center gap-5">
          <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#1e293b]">
            <span className="text-[15px]">?</span> Help
          </button>
          <button type="button" className="relative text-[#475569] hover:text-[#1e293b]">
            <Bell size={20} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#ef4444]" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="text-right leading-tight">
              <p className="text-[13px] font-semibold text-[#0f172a]">{userName}</p>
              <p className="text-[10px] uppercase tracking-wide text-[#64748b]">{userRole}</p>
            </div>
            <div className="size-9 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
