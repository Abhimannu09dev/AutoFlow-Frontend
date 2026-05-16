"use client";

import Link from "next/link";
import { CarFront, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { customerNavItems } from "@/shared/constants/navigation";

interface CustomerSidebarProps {
  userName: string;
  userRole: string;
}

export default function CustomerSidebar({ userName, userRole }: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col justify-between bg-[#091426] px-4 py-6 lg:flex">
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-[#091426]">
            <CarFront className="size-4" />
          </span>
          <div>
            <h2 className="text-[32px] font-semibold leading-[32px] tracking-[-0.02em] text-white">AutoFlow</h2>
            <p className="text-xs font-semibold tracking-[0.04em] text-[#bcc7de]">Customer Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {customerNavItems.map(({ label, icon: Icon, href }) => {
            const active =
              href === "/customer"
                ? pathname === "/customer" || pathname === "/customer/dashboard"
                : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-[#13233d] text-[#bcc7de]" : "text-[#8590a6] hover:bg-[#0f1f38] hover:text-[#bcc7de]"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2.5 px-3 py-2.5">
          {/* <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#0ea5e9]" /> */}
          <div className="min-w-0">
            {/* <p className="truncate text-[12px] font-semibold text-[#e2e8f0]">{userName}</p> */}
            {/* <p className="text-[10px] uppercase tracking-[0.05em] text-[#94a3b8]">{userRole}</p> */}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#bcc7de] transition hover:bg-[#0f1f38]"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
