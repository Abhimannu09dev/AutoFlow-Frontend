import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  return proxyGet("/api/vendors", request);
}
