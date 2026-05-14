"use client";

import { Bell, CircleHelp, Menu, UserCircle2 } from "lucide-react";

interface AdminHeaderProps {
  onMenuToggle: () => void;
}

export default function AdminHeader({ onMenuToggle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#c5c6cd] bg-[#fbf8fa] px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-md p-1 text-[#1b1b1d] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <span className="text-2xl font-semibold text-[#091426]">AutoFlow Admin</span>
      </div>
      <div className="flex items-center gap-4 text-[#006a61]">
        <Bell className="size-4" />
        <CircleHelp className="size-4" />
        <span className="hidden border-l border-[#c5c6cd] pl-4 text-sm text-[#45474c] sm:inline">Support</span>
        <span className="rounded-full bg-[#1e293b] p-1 text-white">
          <UserCircle2 className="size-4" />
        </span>
      </div>
    </header>
  );
}
