import { proxyRequest, proxyGet } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.appointments);
}

export async function GET() {
  return proxyGet(apiRoutes.appointments);
}
