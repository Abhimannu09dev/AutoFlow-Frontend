import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyGet(`/api/dashboard/fast-moving-inventory${search}`, request);
}
