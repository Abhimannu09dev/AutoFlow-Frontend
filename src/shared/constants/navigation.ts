import {
  LayoutGrid, User, Car, CalendarCheck, Wrench, History, Star,
  UserPlus, Users, FileText, BarChart3, Mail, Settings, DollarSign
} from "lucide-react";
import type { NavItem } from "../components/layout/Sidebar";

export const customerNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/customer/dashboard" },
  { label: "Profile", icon: User, href: "/customer/profile" },
  { label: "Vehicles", icon: Car, href: "/customer/vehicles" },
  { label: "Book Service", icon: CalendarCheck, href: "/customer/appointments" },
  { label: "Request Parts", icon: Wrench, href: "/customer/appointments" },
  { label: "History", icon: History, href: "#", disabled: true },
  { label: "Reviews", icon: Star, href: "#", disabled: true },
];

export const staffNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/staff/dashboard" },
  { label: "Customer Registration", icon: UserPlus, href: "/customer/dashboard" },
  { label: "Customer Management", icon: Users, href: "/customer/dashboard" },
  { label: "Sales & Invoices", icon: FileText, href: "/staff/invoices" },
  { label: "Reports", icon: BarChart3, href: "/staff/dashboard" },
  { label: "Email Service", icon: Mail, href: "/staff/dashboard" },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/admin/analytics" },
  { label: "Financial Reports", icon: DollarSign, href: "/admin/financial-reports" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];