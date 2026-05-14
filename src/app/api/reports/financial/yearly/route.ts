import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const suffix = year ? `?year=${encodeURIComponent(year)}` : "";
  return proxyGet(`/api/reports/financial/yearly${suffix}`, request);
}
