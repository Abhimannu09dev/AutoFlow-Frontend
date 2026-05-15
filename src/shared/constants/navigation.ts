import {
  LayoutGrid, User, Car, CalendarCheck, Wrench, Star,
  Users, FileText, Settings, DollarSign, Boxes, BarChart3, Sparkles
} from "lucide-react";
import { ROUTES } from "@/config/routes";
import type { NavItem } from "../components/layout/Sidebar";

export const customerNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: ROUTES.customer.home },
  { label: "My Vehicles", icon: Car, href: ROUTES.customer.vehicles },
  { label: "Appointments", icon: CalendarCheck, href: ROUTES.customer.appointments },
  { label: "Purchases", icon: FileText, href: ROUTES.customer.purchases },
  { label: "Services", icon: CalendarCheck, href: ROUTES.customer.services },
  { label: "Part Requests", icon: Wrench, href: ROUTES.customer.partRequests },
  { label: "Reviews", icon: Star, href: ROUTES.customer.reviews },
  { label: "Vehicle Predictions", icon: Sparkles, href: ROUTES.customer.predictions },
  { label: "Settings", icon: Settings, href: ROUTES.customer.settings },
];

export const staffNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: ROUTES.staff.dashboard },
  { label: "Customers", icon: Users, href: ROUTES.staff.customers },
  { label: "Vehicles", icon: Car, href: ROUTES.staff.vehicles },
  { label: "Appointments", icon: CalendarCheck, href: ROUTES.staff.appointments },
  { label: "Inventory", icon: Boxes, href: ROUTES.staff.parts },
  { label: "Part Request", icon: Wrench, href: ROUTES.staff.partRequests },
  { label: "Sales", icon: FileText, href: ROUTES.staff.sales },
  { label: "Customer Reports", icon: BarChart3, href: ROUTES.staff.customerReports },
  { label: "Credit Ledger", icon: DollarSign, href: ROUTES.staff.creditLedger },
  { label: "Reviews", icon: Star, href: ROUTES.staff.reviews },
  { label: "Profile", icon: User, href: ROUTES.staff.profile },
  { label: "Settings", icon: Settings, href: ROUTES.staff.settings },
];

export const adminNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: ROUTES.admin.dashboard },
  { label: "Financial Reports", icon: DollarSign, href: "/admin/financial-reports" },
  { label: "Customer Reports", icon: BarChart3, href: ROUTES.admin.customerReports },
  { label: "Credit Ledger", icon: DollarSign, href: ROUTES.admin.creditLedger },
  { label: "Users", icon: Users, href: ROUTES.admin.users },
  { label: "Purchase Invoices", icon: FileText, href: ROUTES.admin.purchaseInvoices },
  { label: "Settings", icon: Settings, href: ROUTES.admin.settings },
];
