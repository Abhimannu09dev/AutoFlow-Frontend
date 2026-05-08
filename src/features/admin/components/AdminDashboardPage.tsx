"use client";

import {
  AlertTriangle,
  BadgeAlert,
  Box,
  CircleCheck,
  CircleDollarSign,
  FileText,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";

import InventoryStatus, { type InventoryBreakdownItem } from "./InventoryStatus";
import MetricCard, { type MetricCardProps } from "./MetricCard";
import PriorityAlerts, { type PriorityAlertItem } from "./PriorityAlerts";
import RevenueTrend from "./RevenueTrend";
import TimeRangeToggle, { type TimeRange } from "./TimeRangeToggle";

type ApiEnvelope<T> = {
  status?: boolean;
  message?: string;
  data?: T;
};

type JsonRecord = Record<string, unknown>;

type DashboardMetrics = {
  totalSalesCount: number;
  totalRevenue: number;
  totalCustomersCount: number;
  lowStockParts: number;
  totalStaffCount: number;
  totalVendorsCount: number;
};

type TrendPoint = { label: string; service: number; parts: number };
type TrendSeriesByRange = Record<TimeRange, TrendPoint[]>;

const FALLBACK_METRICS: DashboardMetrics = {
  totalSalesCount: 14285,
  totalRevenue: 482900,
  totalCustomersCount: 1240,
  lowStockParts: 24,
  totalStaffCount: 58,
  totalVendorsCount: 23,
};

const FALLBACK_BREAKDOWN: InventoryBreakdownItem[] = [
  { label: "Engine Components", value: "54% Distribution", dotClass: "bg-[#4338ca]" },
  { label: "Transmission Gear", value: "22% Distribution", dotClass: "bg-[#047857]" },
  { label: "Brake Systems", value: "15% Distribution", dotClass: "bg-[#9ca3af]" },
  { label: "Others", value: "9% Distribution", dotClass: "bg-[#cbd5e1]" },
];

const FALLBACK_TREND_DATA_BY_RANGE: TrendSeriesByRange = {
  daily: [
    { label: "MON", service: 95, parts: 64 },
    { label: "TUE", service: 140, parts: 112 },
    { label: "WED", service: 62, parts: 94 },
    { label: "THU", service: 164, parts: 136 },
    { label: "FRI", service: 108, parts: 82 },
    { label: "SAT", service: 44, parts: 34 },
    { label: "SUN", service: 28, parts: 20 },
  ],
  weekly: [
    { label: "W1", service: 110, parts: 76 },
    { label: "W2", service: 132, parts: 98 },
    { label: "W3", service: 154, parts: 116 },
    { label: "W4", service: 128, parts: 102 },
  ],
  monthly: [
    { label: "JAN", service: 128, parts: 92 },
    { label: "FEB", service: 116, parts: 88 },
    { label: "MAR", service: 142, parts: 104 },
    { label: "APR", service: 168, parts: 124 },
    { label: "MAY", service: 150, parts: 119 },
    { label: "JUN", service: 172, parts: 133 },
  ],
};

const serviceActivities = [
  {
    id: "engine-overhaul",
    icon: Wrench,
    title: "Engine Overhaul: Mercedes Actros",
    subtitle: "Technician: Dave Ramsey",
    time: "12:30 PM",
    iconClassName: "text-[#4338ca]",
    borderClassName: "border-[#4f46e5]",
  },
  {
    id: "parts-restock",
    icon: CircleCheck,
    title: "Parts Restock: Hydraulic Seals",
    subtitle: "Vendor: TechFlow Hydraulics",
    time: "11:15 AM",
    iconClassName: "text-[#006c63]",
    borderClassName: "border-[#006c63]",
  },
  {
    id: "invoice-generated",
    icon: FileText,
    title: "Invoice Generated: #INV-00922",
    subtitle: "Customer: Euro-Trans Gmbh",
    time: "09:45 AM",
    iconClassName: "text-[#7c7af2]",
    borderClassName: "border-[#b6b4ff]",
  },
];

const fastMovingInventory = [
  { id: "brakes", image: "/Brakes.png", category: "BRAKES", title: "Premium Ceramic Pads", price: "$245.00" },
  { id: "engine", image: "/Engine.png", category: "ENGINE", title: "Forged Piston Set", price: "$890.00" },
  { id: "filters", image: "/Filters.png", category: "FILTERS", title: "High-Flow Oil Filter", price: "$45.50" },
  { id: "gearbox", image: "/Gearbox.png", category: "GEARBOX", title: "Syncro Hub 3rd Gen", price: "$1,250.00" },
  { id: "electrical", image: "/Electrical.png", category: "ELECTRICAL", title: "High Output Alternator", price: "$340.00" },
];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem("autoflow_auth");
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored) as JsonRecord;
    const token =
      parsed.token ??
      parsed.accessToken ??
      parsed.jwt ??
      parsed.jwtToken ??
      (typeof parsed.data === "object" &&
      parsed.data !== null &&
      "token" in parsed.data
        ? (parsed.data as JsonRecord).token
        : null);

    return typeof token === "string" && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

async function requestApi<T>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; payload?: ApiEnvelope<T>; message?: string }> {
  try {
    const token = getAuthToken();
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });

    const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
    if (!response.ok) {
      return {
        ok: false,
        payload: payload ?? undefined,
        message:
          payload?.message ??
          `Request failed for ${path} (${response.status})`,
      };
    }

    return { ok: true, payload: payload ?? undefined };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

function extractNumber(source: JsonRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim().length > 0 && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

function normalizeDashboardMetrics(source: unknown): DashboardMetrics {
  if (!source || typeof source !== "object") {
    return FALLBACK_METRICS;
  }

  const record = source as JsonRecord;

  return {
    totalSalesCount:
      extractNumber(record, ["totalSalesCount", "totalSales", "salesCount"]) ??
      FALLBACK_METRICS.totalSalesCount,
    totalRevenue:
      extractNumber(record, ["totalRevenue", "revenue", "totalSalesRevenue"]) ??
      FALLBACK_METRICS.totalRevenue,
    totalCustomersCount:
      extractNumber(record, ["totalCustomersCount", "totalCustomers", "customersCount"]) ??
      FALLBACK_METRICS.totalCustomersCount,
    lowStockParts:
      extractNumber(record, ["lowStockParts", "lowStockPartsCount", "lowStockCount"]) ??
      FALLBACK_METRICS.lowStockParts,
    totalStaffCount:
      extractNumber(record, ["totalStaffCount", "staffCount"]) ??
      FALLBACK_METRICS.totalStaffCount,
    totalVendorsCount:
      extractNumber(record, ["totalVendorsCount", "vendorsCount"]) ??
      FALLBACK_METRICS.totalVendorsCount,
  };
}

function normalizeInventory(partsSource: unknown): {
  totalSkus: string;
  breakdown: InventoryBreakdownItem[];
  lowStockCount: number | null;
} {
  if (!Array.isArray(partsSource) || partsSource.length === 0) {
    return { totalSkus: "8.4k", breakdown: FALLBACK_BREAKDOWN, lowStockCount: null };
  }

  const totalCount = partsSource.length;
  const categoryCounter = new Map<string, number>();
  let lowStockCounter = 0;

  for (const item of partsSource) {
    if (!item || typeof item !== "object") continue;
    const record = item as JsonRecord;
    const categoryRaw = record.category ?? record.partCategory ?? "Others";
    const category = typeof categoryRaw === "string" ? categoryRaw : "Others";
    categoryCounter.set(category, (categoryCounter.get(category) ?? 0) + 1);

    const quantity = extractNumber(record, ["stockQuantity", "quantity", "available", "stock"]);
    const reorderLevel = extractNumber(record, ["reorderLevel", "minimumStock", "minStock"]);
    if (quantity !== undefined && reorderLevel !== undefined && quantity <= reorderLevel) {
      lowStockCounter += 1;
    }
  }

  const ordered = [...categoryCounter.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const colorClasses = ["bg-[#4338ca]", "bg-[#047857]", "bg-[#9ca3af]", "bg-[#cbd5e1]"];
  const breakdown = ordered.map(([label, count], index) => ({
    label,
    value: `${Math.max(1, Math.round((count / totalCount) * 100))}% Distribution`,
    dotClass: colorClasses[index] ?? "bg-[#cbd5e1]",
  }));

  return {
    totalSkus: totalCount > 999 ? `${(totalCount / 1000).toFixed(1)}k` : `${totalCount}`,
    breakdown: breakdown.length > 0 ? breakdown : FALLBACK_BREAKDOWN,
    lowStockCount: lowStockCounter,
  };
}

function normalizeSalesTrend(salesSource: unknown): TrendSeriesByRange | null {
  if (!Array.isArray(salesSource) || salesSource.length === 0) {
    return null;
  }

  const entries: Array<{ date: Date; service: number; parts: number }> = [];

  for (const sale of salesSource) {
    if (!sale || typeof sale !== "object") continue;
    const record = sale as JsonRecord;

    const dateRaw =
      record.createdAt ??
      record.saleDate ??
      record.date ??
      record.createdOn ??
      record.timestamp;
    if (typeof dateRaw !== "string" && !(dateRaw instanceof Date)) continue;

    const parsedDate = new Date(dateRaw);
    if (Number.isNaN(parsedDate.getTime())) continue;

    const amount =
      extractNumber(record, [
        "totalAmount",
        "amount",
        "total",
        "grandTotal",
        "netAmount",
      ]) ?? 0;
    if (amount <= 0) continue;

    const typeRaw = `${record.saleType ?? record.type ?? record.category ?? ""}`.toLowerCase();
    const isPartsSale = typeRaw.includes("part");
    entries.push({
      date: parsedDate,
      service: isPartsSale ? 0 : amount,
      parts: isPartsSale ? amount : 0,
    });
  }

  if (entries.length === 0) {
    return null;
  }

  entries.sort((a, b) => a.date.getTime() - b.date.getTime());

  const dailyMap = new Map<string, { date: Date; service: number; parts: number }>();
  const weeklyMap = new Map<string, { date: Date; service: number; parts: number }>();
  const monthlyMap = new Map<string, { date: Date; service: number; parts: number }>();

  for (const entry of entries) {
    const dayKey = entry.date.toISOString().slice(0, 10);
    const dayAggregate = dailyMap.get(dayKey) ?? { date: entry.date, service: 0, parts: 0 };
    dayAggregate.service += entry.service;
    dayAggregate.parts += entry.parts;
    dailyMap.set(dayKey, dayAggregate);

    const weekStart = new Date(entry.date);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toISOString().slice(0, 10);
    const weekAggregate = weeklyMap.get(weekKey) ?? { date: weekStart, service: 0, parts: 0 };
    weekAggregate.service += entry.service;
    weekAggregate.parts += entry.parts;
    weeklyMap.set(weekKey, weekAggregate);

    const monthStart = new Date(entry.date.getFullYear(), entry.date.getMonth(), 1);
    const monthKey = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, "0")}`;
    const monthAggregate = monthlyMap.get(monthKey) ?? { date: monthStart, service: 0, parts: 0 };
    monthAggregate.service += entry.service;
    monthAggregate.parts += entry.parts;
    monthlyMap.set(monthKey, monthAggregate);
  }

  const daily = [...dailyMap.values()]
    .slice(-7)
    .map((item) => ({
      label: item.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      service: Math.round(item.service),
      parts: Math.round(item.parts),
    }));

  const weekly = [...weeklyMap.values()]
    .slice(-4)
    .map((item, index) => ({
      label: `W${index + 1}`,
      service: Math.round(item.service),
      parts: Math.round(item.parts),
    }));

  const monthly = [...monthlyMap.values()]
    .slice(-6)
    .map((item) => ({
      label: item.date
        .toLocaleDateString("en-US", { month: "short" })
        .toUpperCase(),
      service: Math.round(item.service),
      parts: Math.round(item.parts),
    }));

  return {
    daily: daily.length > 0 ? daily : FALLBACK_TREND_DATA_BY_RANGE.daily,
    weekly: weekly.length > 0 ? weekly : FALLBACK_TREND_DATA_BY_RANGE.weekly,
    monthly: monthly.length > 0 ? monthly : FALLBACK_TREND_DATA_BY_RANGE.monthly,
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [selectedRange, setSelectedRange] = useState<TimeRange>("daily");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"live" | "fallback">("fallback");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics>(FALLBACK_METRICS);
  const [inventoryData, setInventoryData] = useState<{
    totalSkus: string;
    breakdown: InventoryBreakdownItem[];
  }>({ totalSkus: "8.4k", breakdown: FALLBACK_BREAKDOWN });
  const [trendData, setTrendData] = useState<TrendSeriesByRange>(
    FALLBACK_TREND_DATA_BY_RANGE
  );
  const [alerts, setAlerts] = useState<PriorityAlertItem[]>([
    {
      id: "critical-stock",
      icon: BadgeAlert,
      title: "Critical Low Stock",
      message: "Low stock items require immediate reorder attention.",
      action: "ORDER NOW",
      actionHref: "/staff/inventory",
      iconClassName: "bg-[#fff1f2] text-[#ef4444]",
      cardClassName: "bg-white",
    },
    {
      id: "credit-reminder",
      icon: FileText,
      title: "Credit Reminder",
      message: "Pending credit customers need follow-up communication.",
      action: "SEND ALERT",
      iconClassName: "bg-[#eef2ff] text-[#6366f1]",
      cardClassName: "bg-[#f8fafc]",
    },
    {
      id: "service-verified",
      icon: CircleCheck,
      title: "Service Verified",
      message: "Recent service jobs have been completed successfully.",
      action: "VIEW LOG",
      actionHref: "/staff/repair-orders",
      iconClassName: "bg-[#ecfeff] text-[#0f766e]",
      cardClassName: "bg-[#eef2f7]",
    },
  ]);

  useEffect(() => {
    let isCancelled = false;

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setActionMessage(null);

      const [dashboardRes, lowStockRes, pendingCreditRes, partsRes, salesRes] = await Promise.all([
        requestApi<JsonRecord>("/api/dashboard"),
        requestApi<unknown>("/api/parts/low-stock"),
        requestApi<unknown>("/api/reports/customers/pending-credit"),
        requestApi<unknown>("/api/parts"),
        requestApi<unknown>("/api/sales"),
      ]);

      if (isCancelled) return;

      const hasLiveDashboard =
        dashboardRes.ok && dashboardRes.payload?.status !== false && !!dashboardRes.payload?.data;

      if (!hasLiveDashboard) {
        setMetrics(FALLBACK_METRICS);
        setDataSource("fallback");
        setErrorMessage(
          dashboardRes.message ??
            "Dashboard API is currently unavailable. Showing fallback values."
        );
      } else {
        const normalized = normalizeDashboardMetrics(dashboardRes.payload?.data);
        setMetrics(normalized);
        setDataSource("live");
      }

      const normalizedInventory = normalizeInventory(partsRes.payload?.data);
      setInventoryData({
        totalSkus: normalizedInventory.totalSkus,
        breakdown: normalizedInventory.breakdown,
      });

      const normalizedTrendData = normalizeSalesTrend(salesRes.payload?.data);
      if (normalizedTrendData) {
        setTrendData(normalizedTrendData);
      } else {
        setTrendData(FALLBACK_TREND_DATA_BY_RANGE);
      }

      const resolvedLowStockCount =
        Array.isArray(lowStockRes.payload?.data)
          ? lowStockRes.payload?.data.length
          : normalizedInventory.lowStockCount ?? FALLBACK_METRICS.lowStockParts;

      setMetrics((prev) => ({
        ...prev,
        lowStockParts:
          resolvedLowStockCount !== null && resolvedLowStockCount !== undefined
            ? resolvedLowStockCount
            : prev.lowStockParts,
      }));

      const pendingCreditCount = Array.isArray(pendingCreditRes.payload?.data)
        ? pendingCreditRes.payload?.data.length
        : null;

      setAlerts((previousAlerts) =>
        previousAlerts.map((alert) => {
          if (alert.id === "critical-stock") {
            return {
              ...alert,
              message: `Detected ${
                resolvedLowStockCount ?? FALLBACK_METRICS.lowStockParts
              } low stock items requiring reorder.`,
            };
          }

          if (alert.id === "credit-reminder" && pendingCreditCount !== null) {
            return {
              ...alert,
              message: `${pendingCreditCount} pending-credit customers need reminder notifications.`,
            };
          }

          return alert;
        })
      );

      setIsLoading(false);
    };

    loadDashboard();

    return () => {
      isCancelled = true;
    };
  }, []);

  const trendSeries = useMemo(() => trendData[selectedRange], [selectedRange, trendData]);
  const usingFallback = dataSource === "fallback";

  const metricCards: MetricCardProps[] = useMemo(
    () => [
      {
        icon: Box,
        title: "Total Sales",
        value: metrics.totalSalesCount.toLocaleString(),
        delta: selectedRange === "daily" ? "+12.4%" : selectedRange === "weekly" ? "+8.1%" : "+6.3%",
        deltaClassName: "bg-[#dcfce7] text-[#059669]",
        progressClassName: "bg-[#4338ca]",
        progressValue: 76,
      },
      {
        icon: CircleDollarSign,
        title: "Revenue",
        value: `$${metrics.totalRevenue.toLocaleString()}`,
        delta: selectedRange === "daily" ? "+8.2%" : selectedRange === "weekly" ? "+6.9%" : "+5.4%",
        deltaClassName: "bg-[#dcfce7] text-[#059669]",
        progressClassName: "bg-[#0f766e]",
        progressValue: 63,
      },
      {
        icon: Users,
        title: "Active Clients",
        value: metrics.totalCustomersCount.toLocaleString(),
        delta: "+5.1%",
        deltaClassName: "bg-[#e0e7ff] text-[#4338ca]",
        progressClassName: "bg-[#a5b4fc]",
        progressValue: 57,
      },
      {
        icon: AlertTriangle,
        title: "Low Stock Items",
        value: metrics.lowStockParts.toLocaleString(),
        delta: metrics.lowStockParts > 0 ? "Critical" : "Stable",
        deltaClassName:
          metrics.lowStockParts > 0
            ? "bg-[#fee2e2] text-[#ef4444]"
            : "bg-[#dcfce7] text-[#059669]",
        progressClassName: metrics.lowStockParts > 0 ? "bg-[#dc2626]" : "bg-[#16a34a]",
        progressValue: metrics.lowStockParts > 0 ? 18 : 74,
      },
    ],
    [metrics, selectedRange]
  );

  const handleAlertAction = async (alert: PriorityAlertItem) => {
    if (alert.id === "credit-reminder") {
      const sendRes = await requestApi("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          type: "credit-reminder",
          message: "Please review pending-credit customer reminders from dashboard.",
        }),
      });

      if (sendRes.ok) {
        setActionMessage("Reminder alert request sent successfully.");
      } else {
        setActionMessage(
          "Notifications endpoint is unavailable. Reminder action is pending backend support."
        );
      }
      return;
    }

    if (alert.id === "critical-stock") {
      router.push("/staff/inventory");
      return;
    }

    if (alert.id === "service-verified") {
      router.push("/staff/repair-orders");
    }
  };

  const handleClearAlerts = () => {
    setAlerts([]);
    setActionMessage("Priority alerts cleared from current dashboard view.");
  };

  return (
    <AdminLayout>
      <div className="w-full space-y-6 lg:space-y-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[clamp(1.75rem,3.2vw,2.5rem)] font-extrabold tracking-[-0.03em] text-[#0b1c30]">
              Operational Insight
            </h1>
            <p className="mt-1 text-sm text-[#464555] sm:text-base">
              Real-time performance analytics for AutoFlow logistics.
            </p>
          </div>
          <TimeRangeToggle
            selectedRange={selectedRange}
            onChange={setSelectedRange}
            disabled={isLoading}
          />
        </header>

        {errorMessage ? (
          <div className="rounded-xl border border-[#fecaca] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
            {errorMessage}
          </div>
        ) : null}

        {usingFallback ? (
          <div className="rounded-xl border border-[#cbd5e1] bg-white px-4 py-3 text-sm text-[#475569]">
            Backend data is currently unavailable. Displaying fallback dashboard values.
          </div>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <RevenueTrend
              labels={trendSeries.map((point) => point.label)}
              serviceBars={trendSeries.map((point) => point.service)}
              partsBars={trendSeries.map((point) => point.parts)}
              isLoading={isLoading}
            />
          </div>
          <div className="xl:col-span-4">
            <PriorityAlerts
              alerts={alerts}
              onAction={handleAlertAction}
              onClearAll={handleClearAlerts}
              actionStateMessage={actionMessage}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="xl:col-span-5">
            <InventoryStatus
              totalSkus={inventoryData.totalSkus}
              breakdown={inventoryData.breakdown}
            />
          </div>
          <div className="xl:col-span-7">
            <article className="rounded-[24px] bg-[#dfe4f0] p-5 sm:p-6">
              <h2 className="text-[clamp(1.375rem,2.1vw,1.875rem)] font-bold leading-none tracking-[-0.03em] text-[#0b1c30]">
                Service Stream
              </h2>
              <div className="relative mt-5 space-y-5 pl-11 sm:mt-6">
                <span className="absolute bottom-4 left-[19px] top-3 w-0.5 bg-[rgba(199,196,216,0.5)]" />
                {serviceActivities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className="relative flex flex-col gap-1 pr-16 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
                    >
                      <div
                        className={`absolute left-[-44px] top-0.5 flex size-9 items-center justify-center rounded-full border-2 bg-[#eff4ff] ${activity.borderClassName}`}
                      >
                        <Icon className={`size-4 ${activity.iconClassName}`} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0b1c30]">{activity.title}</p>
                        <p className="text-xs text-[#464555]">{activity.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#464555]">
                        {activity.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-[clamp(1.375rem,2.1vw,1.875rem)] font-bold leading-none tracking-[-0.03em] text-[#0b1c30]">
              Fast-Moving Inventory
            </h2>
            <Link
              href="/staff/inventory"
              className="text-xs font-bold text-[#3525cd] hover:underline"
            >
              Manage Catalog
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {fastMovingInventory.map((item) => (
                <article
                  key={item.id}
                  className="w-48 rounded-2xl bg-[#eff4ff] p-4"
                >
                  <div
                    className="h-32 w-full rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <p className="mt-3 text-[10px] font-bold tracking-[0.08em] text-[#3525cd]">
                    {item.category}
                  </p>
                  <h3 className="mt-1 text-sm font-bold leading-5 text-[#0b1c30]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-bold text-[#464555]">{item.price}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
