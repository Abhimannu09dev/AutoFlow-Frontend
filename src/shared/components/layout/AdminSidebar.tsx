"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Boxes,
  DollarSign,
  FileText,
  LayoutGrid,
  LogOut,
  MessageSquare,
  ReceiptText,
  Settings,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/config/routes";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const items: AdminNavItem[] = [
  { label: "Dashboard", href: ROUTES.admin.dashboard, icon: LayoutGrid },
  { label: "Staff", href: ROUTES.admin.users, icon: Users },
  { label: "Vendors", href: ROUTES.admin.vendors, icon: Users },
  { label: "Inventory", href: ROUTES.staff.parts, icon: Boxes },
  { label: "Part Request", href: ROUTES.admin.partRequests, icon: Wrench },
  { label: "Purchase Invoices", href: ROUTES.admin.purchaseInvoices, icon: ReceiptText },
  { label: "Financial Reports", href: ROUTES.admin.financialReports, icon: BarChart3 },
  { label: "Customer Reports", href: ROUTES.admin.customerReports, icon: FileText },
  { label: "Credit Ledger", href: ROUTES.admin.creditLedger, icon: DollarSign },
  { label: "Reviews", href: ROUTES.admin.reviews, icon: MessageSquare },
  { label: "Settings", href: ROUTES.admin.settings, icon: Settings },
  { label: "Analytics", href: ROUTES.admin.analytics, icon: FileText },
];

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    onClose();
    router.replace("/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between bg-[#091426] px-4 py-6 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-[#091426]">
            <LayoutGrid className="size-4" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-white">AutoFlow</h2>
            <p className="text-xs font-semibold tracking-wide text-[#bcc7de]">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active ? "bg-[#13233d] text-white" : "text-[#8590a6] hover:bg-[#0f1f38] hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#bcc7de] hover:bg-[#0f1f38] hover:text-white"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </aside>
  );
}
