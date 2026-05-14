import { proxyRequest, proxyGet } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.partRequests);
}

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyGet(`${apiRoutes.partRequests}${search}`, request);
}
