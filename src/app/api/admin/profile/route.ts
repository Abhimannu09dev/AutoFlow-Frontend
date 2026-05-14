import { proxyGet, proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function GET(request: Request) {
  return proxyGet(apiRoutes.admin.profile, request);
}

export async function PUT(request: Request) {
  return proxyRequest(request, apiRoutes.admin.profile);
}
