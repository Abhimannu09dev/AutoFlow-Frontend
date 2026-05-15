import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyGet(`/api/customers/me/purchases${search}`, request);
}
