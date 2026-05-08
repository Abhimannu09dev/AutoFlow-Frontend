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
  partsRequests: "/api/parts-requests",
  reviews: "/api/reviews",
} as const;
