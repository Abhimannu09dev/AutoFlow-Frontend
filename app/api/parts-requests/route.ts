import { proxyRequest, proxyGet } from "@/lib/api/proxy";
import { apiRoutes } from "@/configs/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.partsRequests);
}

export async function GET() {
  return proxyGet(apiRoutes.partsRequests);
}
