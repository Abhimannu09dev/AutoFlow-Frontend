import { proxyGet } from "@/services/proxy";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const query = new URLSearchParams();
  if (year) query.set("year", year);
  if (month) query.set("month", month);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return proxyGet(`/api/reports/financial/monthly${suffix}`, request);
}
