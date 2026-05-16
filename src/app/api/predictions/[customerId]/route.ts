import { proxyGet } from "@/services/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;
  const { search } = new URL(request.url);
  return proxyGet(`/api/predictions/${encodeURIComponent(customerId)}${search}`, request);
}
