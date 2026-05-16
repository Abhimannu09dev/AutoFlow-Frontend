import { proxyGet, proxyRequest } from "@/services/proxy";

const profilePath = "/api/customers/me/profile";

export async function GET(request: Request) {
  return proxyGet(profilePath, request);
}

export async function PATCH(request: Request) {
  return proxyRequest(request, profilePath);
}

export async function PUT(request: Request) {
  const patchRequest = new Request(request, { method: "PATCH" });
  return proxyRequest(patchRequest, profilePath);
}
