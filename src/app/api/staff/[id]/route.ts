import { proxyRequest } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, `${apiRoutes.staff}/${encodeURIComponent(id)}`);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, `${apiRoutes.staff}/${encodeURIComponent(id)}`);
}
