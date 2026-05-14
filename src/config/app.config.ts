export const appConfig = {
  name: "AutoFlow",
  description: "Precision Management Portal",
  backendUrl: process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294",
} as const;

export const apiRoutes = {
  auth: {
    login: "/api/auth/login",
  },
  customers: "/api/customers",
  appointments: "/api/appointments",
  partRequests: "/api/part-requests",
  reviews: "/api/reviews",
  vendors: "/api/vendors",
  parts: "/api/parts",
  staff: "/api/staff",
  sales: "/api/sales",
  dashboard: "/api/dashboard",
  purchaseInvoices: "/api/purchase-invoices",
  admin: {
    profile: "/api/admin/profile",
    changePassword: "/api/admin/change-password",
  },
} as const;
