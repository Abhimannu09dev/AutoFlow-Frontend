"use client";

import { Bell, Menu, Search, Settings } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-[rgba(224,231,255,0.45)] bg-[rgba(255,255,255,0.92)] px-4 backdrop-blur-[12px] sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#475569] transition hover:bg-[#eff4ff] hover:text-[#4338ca]"
            aria-label="Open sidebar menu"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-[#4338ca]">AutoFlow</span>
        </div>

        <div className="hidden w-full max-w-96 items-center rounded-full border border-[rgba(199,196,216,0.2)] bg-[#eff4ff] px-4 py-2 lg:flex">
          <Search className="mr-2 size-4 text-[#94a3b8]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search invoices, parts or vendors..."
            className="w-full bg-transparent text-sm text-[#464555] outline-none placeholder:text-[rgba(70,69,85,0.4)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-4 text-[#64748b]">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-1.5 transition hover:bg-[#eff4ff] hover:text-[#4338ca]"
              aria-label="Notifications"
            >
              <Bell className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full p-1.5 transition hover:bg-[#eff4ff] hover:text-[#4338ca]"
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
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(53,37,205,0.1)] bg-[#d3e4fe] text-xs font-semibold text-[#3525cd]">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
