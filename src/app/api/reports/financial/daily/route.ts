import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const suffix = date ? `?date=${encodeURIComponent(date)}` : "";
  return proxyGet(`/api/reports/financial/daily${suffix}`, request);
}
