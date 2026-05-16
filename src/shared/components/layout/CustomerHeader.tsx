"use client";

import { Bell, CircleHelp, UserCircle2 } from "lucide-react";

interface CustomerHeaderProps {
  userName: string;
  userRole: string;
}

export default function CustomerHeader({ userName, userRole }: CustomerHeaderProps) {
  const roleLabel = userRole.toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-[#c5c6cd] bg-[#fbf8fa]">

      
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <span className="text-2xl font-semibold text-[#091426]">AutoFlow</span>
        <div className="flex items-center gap-4 text-[#006a61]">
          <Bell className="size-4" />
          <CircleHelp className="size-4" />
          <span className="hidden border-l border-[#c5c6cd] pl-4 text-sm text-[#45474c] sm:inline">Support</span>
          <button type="button" className="hidden items-center gap-2 sm:flex" aria-label="Customer profile">
            <span className="rounded-full bg-[#1e293b] p-1 text-white">
              <UserCircle2 className="size-4" />
            </span>
          </button>
          <span className="rounded-full bg-[#1e293b] p-1 text-white sm:hidden">
            <UserCircle2 className="size-4" />
          </span>
        </div>
      </div>
    </header>
  );
}
