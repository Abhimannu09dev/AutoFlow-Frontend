import { proxyRequest } from "@/lib/api/proxy";
import { apiRoutes } from "@/configs/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.auth.login);
}
