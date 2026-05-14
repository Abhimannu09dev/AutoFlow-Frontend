export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294",
  backendUrl: process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5294",
  nodeEnv: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
} as const;
