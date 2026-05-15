import { proxyRequest } from "@/services/proxy";

type RouteContext = {
  params: Promise<{ saleId: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { saleId } = await context.params;
  return proxyRequest(request, `/api/credits/${encodeURIComponent(saleId)}/status`);
}
