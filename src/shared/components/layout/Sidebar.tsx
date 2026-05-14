"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  disabled?: boolean;
}

interface SidebarProps {
  brand: string;
  subtitle: string;
  navItems: NavItem[];
  user?: { name: string; role: string };
  footer?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ brand, subtitle, navItems, user, footer, isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#dfe4ee] bg-white px-3 py-7 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 lg:static lg:w-52 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-start justify-between px-3">
        <div>
          <h2 className="text-[18px] font-bold leading-none text-[#4338ca]">{brand}</h2>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-[#64748b] transition hover:bg-[#eef2ff] hover:text-[#4338ca] lg:hidden"
          aria-label="Close sidebar menu"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, icon: Icon, href, disabled }) => {
          const active = pathname === href && !disabled;
          
          if (disabled) {
            return (
              <div
                key={label}
                className="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#94a3b8] cursor-not-allowed"
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {label}
                <span className="ml-auto text-[10px] text-[#94a3b8]">Soon</span>
              </div>
            );
          }
          
          return (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                active ? "bg-[#eef0fb] text-[#4338ca]" : "text-[#64748b] hover:bg-[#f5f6fb] hover:text-[#4338ca]"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
              {label}
              {active && <span className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-l bg-[#4338ca]" />}
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-3 py-2.5">
            <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8]" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#1e293b]">{user.name}</p>
              <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">{user.role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626] transition"
          >
            <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
            Logout
          </button>
        </div>
      )}
      {footer}
    </aside>
  );
}
