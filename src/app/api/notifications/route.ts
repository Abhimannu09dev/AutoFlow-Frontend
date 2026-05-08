import { proxyGet, proxyRequest } from "@/services/proxy";

export async function GET(request: Request) {
  return proxyGet("/api/notifications", request);
}

export async function POST(request: Request) {
  return proxyRequest(request, "/api/notifications");
}
