import { proxyGet } from "@/services/proxy";

type RouteContext = {
  params: Promise<{ saleId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { saleId } = await context.params;
  return proxyGet(`/api/credits/${encodeURIComponent(saleId)}`, request);
}
