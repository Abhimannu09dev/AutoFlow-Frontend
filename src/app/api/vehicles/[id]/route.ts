import { proxyGet, proxyRequest } from "@/services/proxy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { search } = new URL(request.url);
  return proxyGet(`/api/vehicles/${encodeURIComponent(id)}${search}`, request);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/api/vehicles/${encodeURIComponent(id)}`);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(request, `/api/vehicles/${encodeURIComponent(id)}`);
}
