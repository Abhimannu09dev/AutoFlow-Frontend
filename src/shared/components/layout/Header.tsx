"use client";

import { Search, Bell, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  user: {
    name: string;
    role: string;
  };
  showSearch?: boolean;
  onMenuToggle?: () => void;
}

export function Header({ user, showSearch = true, onMenuToggle }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b border-[#dde1ed] bg-white">
      <div className="flex h-13 items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-lg p-2 text-[#475569] transition hover:bg-[#eff4ff] hover:text-[#4338ca] lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <span className="text-[16px] font-bold text-[#4338ca] lg:hidden">AutoFlow</span>
          {showSearch && (
            <label className="flex h-8 w-56 items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-3 text-[12px] text-[#9aa4b2] cursor-text">
              <Search size={13} aria-hidden="true" />
              Search components...
            </label>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button type="button" className="relative text-[#64748b] hover:text-[#1e293b]" aria-label="Notifications">
            <Bell size={19} aria-hidden="true" />
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#ef4444]" />
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <div className="text-right leading-tight">
                <p className="text-[12px] font-semibold text-[#0f172a]">{user.name}</p>
                <p className="text-[9px] font-semibold uppercase tracking-wide text-[#4338ca]">{user.role}</p>
              </div>
              <div className="size-8 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
            </button>
            
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#e8eaf2] bg-white shadow-lg z-20">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-[13px] font-medium text-[#64748b] hover:bg-[#f8f9fc] hover:text-[#dc2626] transition rounded-xl"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
