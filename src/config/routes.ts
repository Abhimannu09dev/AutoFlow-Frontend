export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  customer: {
    dashboard: "/customer/dashboard",
    vehicles: "/customer/vehicles",
    profile: "/customer/profile",
    appointments: "/customer/appointments",
  },
  staff: {
    dashboard: "/staff/dashboard",
    parts: "/staff/parts",
    inventory: "/staff/inventory",
    repairOrders: "/staff/repair-orders",
    invoices: "/staff/invoices",
  },
  admin: {
    users: "/admin/users",
    settings: "/admin/settings",
    analytics: "/admin/analytics",
  },
} as const;
