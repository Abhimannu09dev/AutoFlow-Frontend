import { proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

export async function POST(request: Request) {
  return proxyRequest(request, apiRoutes.admin.changePassword);
}
