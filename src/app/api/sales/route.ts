import { proxyGet, proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function GET(request: Request) {
  return proxyGet(apiRoutes.sales, request);
}

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.sales);
}
