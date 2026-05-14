import { proxyGet } from "@/services/proxy";
import { apiRoutes } from "@/config/app.config";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  return proxyGet(`${apiRoutes.purchaseInvoices}/${encodeURIComponent(id)}`, request);
}
