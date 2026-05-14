import { proxyGet, proxyRequest } from "@/services/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { search } = new URL(request.url);
  return proxyGet(`/api/customers/${encodeURIComponent(id)}/vehicles${search}`, request);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/api/customers/${encodeURIComponent(id)}/vehicles`);
}
