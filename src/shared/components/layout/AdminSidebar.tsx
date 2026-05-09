"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Box,
  ClipboardList,
  FileText,
  PlusCircle,
  Truck,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";

interface AdminNavItem {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AdminNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminNav({ isOpen, onClose }: AdminNavProps) {
  const pathname = usePathname();

  const items: AdminNavItem[] = [
    { key: "dashboard", label: "Dashboard", href: ROUTES.admin.dashboard, icon: Box },
    { key: "staff", label: "Staff Management", href: ROUTES.admin.users, icon: Users },
    { key: "vendor", label: "Vendor Management", href: "/staff/vendor", icon: Truck },
    {
      key: "parts",
      label: "Vehicle Parts Management",
      href: "/staff/parts",
      icon: ClipboardList,
    },
    {
      key: "invoices",
      label: "Purchase Invoice Management",
      href: ROUTES.admin.purchaseInvoices,
      icon: FileText,
    },
    {
      key: "reports",
      label: "Financial Reports",
      href: "/admin/financial-reports",
      icon: FileText,
    },
    { key: "notifications", label: "Notifications", href: "/staff/notifications", icon: Bell },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-[rgba(226,232,240,0.7)] bg-[#f8fafc] px-4 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-transform duration-300 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div>
        <div className="mb-8 flex items-start justify-between px-2 pt-1">
          <div>
            <h3 className="text-xl font-bold tracking-[-0.02em] text-[#4338ca]">AutoFlow</h3>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#6b7280]">
              Admin Console
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#64748b] transition hover:bg-[#eef2ff] hover:text-[#4338ca] lg:hidden"
            aria-label="Close sidebar menu"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="space-y-1 overflow-y-auto pr-1">
          {items.map((it) => {
            const Icon = it.icon;
            const isActive = pathname === it.href;
            const isMultiLine = it.label.includes("Management");

            return (
              <Link
                key={it.key}
                href={it.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                  isActive
                    ? "bg-[rgba(224,231,255,0.5)] text-[#4338ca]"
                    : "text-[#64748b] hover:bg-[#eef2ff] hover:text-[#4338ca]"
                }`}
              >
                <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                <span className={isMultiLine ? "leading-5" : ""}>{it.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Link
        href="/staff/repair-orders"
        onClick={onClose}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3525cd] to-[#4f46e5] px-4 py-3 text-sm font-bold text-white shadow-[0_10px_15px_-3px_rgba(53,37,205,0.2)]"
      >
        <PlusCircle className="size-4" aria-hidden="true" />
        New Service Order
      </Link>
    </aside>
  );
}
