import { proxyRequest } from "@/services/proxy";

export async function POST(request: Request) {
  return proxyRequest(request, "/api/notifications/clear");
}
