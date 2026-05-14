import { apiRoutes } from "@/config/app.config";
import { proxyRequest } from "@/services/proxy";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, `${apiRoutes.vendors}/${encodeURIComponent(id)}`);
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, `${apiRoutes.vendors}/${encodeURIComponent(id)}`);
}
