import { proxyGet, proxyRequest } from "@/services/proxy";

const staffSelfProfilePath = "/api/staff/me/profile";

export async function GET(request: Request) {
  return proxyGet(staffSelfProfilePath, request);
}

export async function PATCH(request: Request) {
  return proxyRequest(request, staffSelfProfilePath);
}
