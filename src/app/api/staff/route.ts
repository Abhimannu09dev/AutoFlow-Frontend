import { proxyGet, proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function GET(request: Request) {
  return proxyGet(apiRoutes.staff, request);
}

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.staff);
}

export async function PUT(request: Request) {
  return proxyRequest(request, apiRoutes.staff);
}
