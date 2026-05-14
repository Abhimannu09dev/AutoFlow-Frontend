import { proxyGet, proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.customers);
}

export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyGet(`${apiRoutes.customers}${search}`, request);
}
