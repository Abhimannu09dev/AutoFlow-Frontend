import { proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, `${apiRoutes.parts}/${encodeURIComponent(id)}`);
}
