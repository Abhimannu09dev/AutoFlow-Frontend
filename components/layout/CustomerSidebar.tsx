"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  Car,
  CalendarCheck,
  Wrench,
  History,
  Star,
  LucideIcon,
} from "lucide-react";

const navItems: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "Dashboard",     icon: LayoutGrid,   href: "/customer" },
  { label: "Profile",       icon: User,         href: "/customer/profile" },
  { label: "Vehicles",      icon: Car,          href: "/customer/vehicles" },
  { label: "Book Service",  icon: CalendarCheck,href: "/customer/book-service" },
  { label: "Request Parts", icon: Wrench,       href: "/customer/request-parts" },
  { label: "History",       icon: History,      href: "/customer/history" },
  { label: "Reviews",       icon: Star,         href: "/customer/reviews" },
];

interface CustomerSidebarProps {
  userName: string;
  userRole: string;
}

export default function CustomerSidebar({ userName, userRole }: CustomerSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-52 shrink-0 flex-col border-r border-[#dfe4ee] bg-white px-3 py-7 lg:flex">
      <div className="mb-8 px-3">
        <h2 className="text-[18px] font-bold leading-none text-[#4338ca]">AutoFlow</h2>
        <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
          Manage Your Vehicles
        </p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                active
                  ? "bg-[#eef0fb] text-[#4338ca]"
                  : "text-[#64748b] hover:bg-[#f5f6fb] hover:text-[#4338ca]"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
              {label}
              {active && (
                <span className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-l bg-[#4338ca]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-3 py-2.5">
        <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#c084fc] to-[#818cf8]" />
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold text-[#1e293b]">{userName}</p>
          <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}
