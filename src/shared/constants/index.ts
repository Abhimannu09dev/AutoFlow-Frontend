export const APP_NAME = "AutoFlow";
export const APP_DESCRIPTION = "Precision Vehicle Management Platform";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  customerDashboard: "/customer/dashboard",
  customerVehicles: "/customer/vehicles",
  customerProfile: "/customer/profile",
  customerAppointments: "/customer/appointments",
  staffDashboard: "/staff/dashboard",
  staffParts: "/staff/parts",
  staffInventory: "/staff/inventory",
  staffRepairOrders: "/staff/repair-orders",
  staffInvoices: "/staff/invoices",
  adminUsers: "/admin/users",
  adminSettings: "/admin/settings",
  adminAnalytics: "/admin/analytics",
} as const;

export * from "./navigation";
