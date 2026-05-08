"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(219,227,247,0.9)] bg-[rgba(248,250,255,0.9)] px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-xl border border-[rgba(199,196,216,0.28)] bg-white/80 p-2 text-[#475569] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-white hover:text-[#4338ca]"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold tracking-[-0.02em] text-[#4338ca]">AutoFlow</span>
        </div>

        <div className="hidden w-full max-w-[30rem] items-center rounded-2xl border border-[rgba(199,196,216,0.34)] bg-white px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:flex">
          <Search className="mr-2 size-4 text-[#94a3b8]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search invoices, parts or vendors..."
            className="w-full bg-transparent text-sm text-[#0f172a] outline-none placeholder:text-[rgba(70,69,85,0.42)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-4 text-[#64748b]">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-white hover:text-[#4338ca]"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-2 transition hover:bg-white hover:text-[#4338ca]"
              aria-label="Settings"
            >
              <Settings className="size-4" aria-hidden="true" />
            </button>
          </div>

          <span className="hidden h-8 w-px bg-[rgba(199,196,216,0.4)] sm:block" />

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm font-medium text-[#0b1c30] sm:inline">
              Admin Profile
            </span>
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(53,37,205,0.1)] bg-[linear-gradient(135deg,#dbeafe,#c7d2fe)] text-xs font-semibold text-[#3525cd] shadow-[0_4px_12px_rgba(53,37,205,0.12)]">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
