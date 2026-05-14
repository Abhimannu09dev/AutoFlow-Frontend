import { proxyRequest } from "@/services/proxy";

const changePasswordPath = "/api/auth/change-password";

export async function POST(request: Request) {
  return proxyRequest(request, changePasswordPath);
}
