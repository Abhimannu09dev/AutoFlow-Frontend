import {
  LayoutGrid, User, Car, CalendarCheck, Wrench, History, Star,
  UserPlus, Users, FileText, BarChart3, Mail, Settings, DollarSign
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import type { NavItem } from "../components/layout/Sidebar";

export const customerNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/customer/dashboard" },
  { label: "Profile", icon: User, href: "/customer/profile" },
  { label: "Vehicles", icon: Car, href: "/customer/vehicles" },
  { label: "Book Service", icon: CalendarCheck, href: "/customer/appointments" },
  { label: "Request Parts", icon: Wrench, href: "/customer/parts-request" },
  { label: "History", icon: History, href: "/customer/history" },
  { label: "Reviews", icon: Star, href: "/customer/reviews" },
];

export const staffNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: ROUTES.staff.dashboard },
  { label: "Customer Registration", icon: UserPlus, href: ROUTES.customer.dashboard },
  { label: "Customer Management", icon: Users, href: ROUTES.customer.dashboard },
  { label: "Sales & Invoices", icon: FileText, href: ROUTES.staff.invoices },
  { label: "Reports", icon: BarChart3, href: ROUTES.staff.dashboard },
  { label: "Email Service", icon: Mail, href: ROUTES.staff.dashboard },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: ROUTES.admin.dashboard },
  { label: "Financial Reports", icon: DollarSign, href: "/admin/financial-reports" },
  { label: "Users", icon: Users, href: ROUTES.admin.users },
  { label: "Purchase Invoices", icon: FileText, href: ROUTES.admin.purchaseInvoices },
  { label: "Settings", icon: Settings, href: ROUTES.admin.settings },
];