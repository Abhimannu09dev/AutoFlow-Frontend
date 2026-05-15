import { proxyRequest } from "@/services/proxy";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  return proxyRequest(request, `/api/appointments/${encodeURIComponent(id)}/cancel`);
}
