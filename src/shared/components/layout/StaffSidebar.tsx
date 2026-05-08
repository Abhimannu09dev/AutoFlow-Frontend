"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  UserPlus,
  Users,
  FileText,
  BarChart3,
  Mail,
  CirclePlus,
  LucideIcon,
} from "lucide-react";

const navItems: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "Dashboard",             icon: LayoutGrid, href: "/staff" },
  { label: "Customer Registration", icon: UserPlus,   href: "/staff/customer-registration" },
  { label: "Customer Management",   icon: Users,      href: "/staff/customer-management" },
  { label: "Sales & Invoices",      icon: FileText,   href: "/staff/sales" },
  { label: "Reports",               icon: BarChart3,  href: "/staff/reports" },
  { label: "Email Service",         icon: Mail,       href: "/staff/email" },
];

export default function StaffSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-[#dfe4ee] bg-[#f3f5fa] px-3 py-8 lg:flex">
      <div className="mb-10 px-3">
        <h2 className="text-[20px] font-bold leading-none text-[#4338ca]">AutoFlow</h2>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#6b7280]">STAFF PANEL</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                active
                  ? "bg-[#eceef5] text-[#4338ca]"
                  : "text-[#6d7785] hover:bg-[#eceef5] hover:text-[#4338ca]"
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
              <span className="leading-tight">{label}</span>
              {active && (
                <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l bg-[#4338ca]" />
              )}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3730a3] to-[#4f46e5] text-[13px] font-semibold text-white shadow-[0_6px_14px_rgba(67,56,202,0.3)] transition hover:brightness-105"
      >
        <CirclePlus size={16} aria-hidden="true" />
        New Service
      </button>
    </aside>
  );
}
