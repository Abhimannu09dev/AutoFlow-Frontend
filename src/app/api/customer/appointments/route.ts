import { proxyGet, proxyRequest } from "@/services/proxy";

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyGet(`/api/appointments${search}`, request);
}

export async function POST(request: Request) {
  return proxyRequest(request, "/api/appointments");
}
