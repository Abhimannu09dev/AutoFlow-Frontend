"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Car,
  Calendar,
  Boxes,
  Wrench,
  ReceiptText,
  BarChart3,
  MessageSquare,
  UserCircle2,
  Settings,
  LogOut,
  CarFront,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";

interface StaffNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface StaffSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const items: StaffNavItem[] = [
  { label: "Dashboard", href: ROUTES.staff.dashboard, icon: LayoutGrid },
  { label: "Customers", href: ROUTES.staff.customers, icon: Users },
  { label: "Vehicles", href: ROUTES.staff.vehicles, icon: Car },
  { label: "Appointments", href: ROUTES.staff.appointments, icon: Calendar },
  { label: "Inventory", href: ROUTES.staff.parts, icon: Boxes },
  { label: "Part Request", href: ROUTES.staff.partRequests, icon: Wrench },
  { label: "Sales", href: ROUTES.staff.sales, icon: ReceiptText },
  { label: "Customer Reports", href: ROUTES.staff.customerReports, icon: BarChart3 },
  { label: "Reviews", href: ROUTES.staff.reviews, icon: MessageSquare },
  { label: "Profile", href: ROUTES.staff.profile, icon: UserCircle2 },
  { label: "Settings", href: ROUTES.staff.settings, icon: Settings },
];

export default function StaffSidebar({ isOpen, onClose }: StaffSidebarProps) {
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
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col justify-between bg-[#091426] px-4 py-6 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div>
        <div className="mb-8 flex items-center gap-3 px-2">
          <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-[#091426]">
            <CarFront className="size-4" />
          </span>
          <div>
            <h2 className="text-[32px] font-semibold leading-[32px] tracking-[-0.02em] text-white">AutoFlow</h2>
            <p className="text-xs font-semibold tracking-[0.04em] text-[#bcc7de]">Staff Portal</p>
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
                  active
                    ? "bg-[#13233d] text-[#bcc7de]"
                    : "text-[#8590a6] hover:bg-[#0f1f38] hover:text-[#bcc7de]"
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
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-[#bcc7de] hover:bg-[#0f1f38]"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </aside>
  );
}
