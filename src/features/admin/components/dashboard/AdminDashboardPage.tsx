"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  AlertTriangle,
  Bell,
  CircleDollarSign,
  ClipboardList,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import { EmptyState, ErrorState, FilterTabs, LoadingState } from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/admin-api";
import type {
  DashboardActivity,
  DashboardRevenueTrend,
  DashboardSummary,
  FastMovingInventoryRow,
  PartItem,
  PriorityAlertRow,
} from "../shared/admin.types";

type RevenueRange = "daily" | "weekly" | "monthly";

type MetricCard = {
  title: string;
  value: string;
  subtitle?: string;
  icon: typeof CircleDollarSign;
};

const PRIORITY_ALERTS_PAGE_SIZE = 5;
const BACKGROUND_REFRESH_INTERVAL_MS = 15000;

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const lastBackgroundRefreshAt = useRef(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary>({});
  const [lowStockParts, setLowStockParts] = useState<PartItem[]>([]);

  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  const [trendRange, setTrendRange] = useState<RevenueRange>("daily");
  const [trend, setTrend] = useState<DashboardRevenueTrend[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendError, setTrendError] = useState<string | null>(null);

  const [fastMoving, setFastMoving] = useState<FastMovingInventoryRow[]>([]);
  const [fastMovingLoading, setFastMovingLoading] = useState(true);
  const [fastMovingError, setFastMovingError] = useState<string | null>(null);

  const [priorityAlerts, setPriorityAlerts] = useState<PriorityAlertRow[]>([]);
  const [priorityLoading, setPriorityLoading] = useState(true);
  const [priorityError, setPriorityError] = useState<string | null>(null);
  const [priorityPage, setPriorityPage] = useState(1);

  const loadSummary = useCallback(async (background = false) => {
    if (!background) {
      setLoading(true);
    }
    setError(null);

    const summaryRes = await apiRequest<DashboardSummary & { lowStockParts?: PartItem[] }>(
      `/api/dashboard?_ts=${Date.now()}`
    );

    if (summaryRes.error) {
      setError(summaryRes.error);
      setLoading(false);
      return;
    }

    const nextSummary = unwrapData<DashboardSummary & { lowStockParts?: PartItem[] }>(summaryRes.data, {});
    setSummary(nextSummary);

    const lowStockFromSummary = unwrapArray<PartItem>(nextSummary.lowStockParts);
    if (lowStockFromSummary.length > 0) {
      setLowStockParts(lowStockFromSummary);
    } else {
      const lowStockRes = await apiRequest<PartItem[]>("/api/parts/low-stock");
      setLowStockParts(unwrapArray<PartItem>(lowStockRes.data));
    }

    setLoading(false);
  }, []);

  const loadActivity = useCallback(async () => {
    setActivityLoading(true);
    setActivityError(null);

    const result = await apiRequest<DashboardActivity[]>("/api/dashboard/activity-stream?limit=10");
    if (result.error) {
      setActivityError(result.error);
      setActivities([]);
    } else {
      setActivities(unwrapArray<DashboardActivity>(result.data));
    }

    setActivityLoading(false);
  }, []);

  const loadRevenueTrend = useCallback(async (range: RevenueRange) => {
    setTrendLoading(true);
    setTrendError(null);

    const result = await apiRequest<DashboardRevenueTrend[]>(
      `/api/dashboard/revenue-trend?range=${range}`
    );

    if (result.error) {
      setTrendError(result.error);
      setTrend([]);
    } else {
      setTrend(unwrapArray<DashboardRevenueTrend>(result.data));
    }

    setTrendLoading(false);
  }, []);

  const loadFastMoving = useCallback(async () => {
    setFastMovingLoading(true);
    setFastMovingError(null);

    const result = await apiRequest<FastMovingInventoryRow[]>(
      "/api/dashboard/fast-moving-inventory?limit=5"
    );

    if (result.error) {
      setFastMovingError(result.error);
      setFastMoving([]);
    } else {
      setFastMoving(unwrapArray<FastMovingInventoryRow>(result.data));
    }

    setFastMovingLoading(false);
  }, []);

  const loadPriorityAlerts = useCallback(async () => {
    setPriorityLoading(true);
    setPriorityError(null);

    const result = await apiRequest<PriorityAlertRow[]>("/api/dashboard/priority-alerts?limit=10");

    if (result.error) {
      setPriorityError(result.error);
      setPriorityAlerts([]);
    } else {
      setPriorityAlerts(unwrapArray<PriorityAlertRow>(result.data));
    }

    setPriorityLoading(false);
  }, []);

  const refreshDashboard = useCallback(
    async (background = false) => {
      await Promise.all([
        loadSummary(background),
        loadActivity(),
        loadFastMoving(),
        loadPriorityAlerts(),
      ]);
    },
    [loadActivity, loadFastMoving, loadPriorityAlerts, loadSummary]
  );

  useEffect(() => {
    void refreshDashboard();
  }, [refreshDashboard]);

  useEffect(() => {
    if (pathname?.startsWith("/admin/dashboard")) {
      void refreshDashboard(true);
    }
  }, [pathname, refreshDashboard]);

  useEffect(() => {
    const onFocus = () => {
      const now = Date.now();
      if (now - lastBackgroundRefreshAt.current < BACKGROUND_REFRESH_INTERVAL_MS) {
        return;
      }
      lastBackgroundRefreshAt.current = now;
      void refreshDashboard(true);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        onFocus();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refreshDashboard]);

  useEffect(() => {
    void loadRevenueTrend(trendRange);
  }, [trendRange, loadRevenueTrend]);

  useEffect(() => {
    setPriorityPage(1);
  }, [priorityAlerts]);

  const summaryData = summary as DashboardSummary & Record<string, unknown>;

  const totalRevenue = toNumber(summary.totalRevenue ?? summaryData.revenue);
  const cards = useMemo<MetricCard[]>(
    () => [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        subtitle: `Today $${toNumber(summary.todayRevenue).toLocaleString()}`,
        icon: CircleDollarSign,
      },
      {
        title: "Monthly Revenue",
        value: `$${toNumber(summary.monthlyRevenue).toLocaleString()}`,
        subtitle: `Yearly $${toNumber(summary.yearlyRevenue).toLocaleString()}`,
        icon: TrendingUp,
      },
      {
        title: "Total Sales",
        value: toNumber(summary.totalSalesCount ?? summaryData.totalSales).toLocaleString(),
        subtitle: `Completed ${toNumber(summary.completedSalesCount).toLocaleString()}`,
        icon: ShoppingCart,
      },
      {
        title: "Customers",
        value: toNumber(
          summary.totalCustomersCount ?? summaryData.customersCount ?? summaryData.totalCustomers
        ).toLocaleString(),
        icon: Users,
      },
      {
        title: "Staff",
        value: toNumber(
          summary.totalStaffCount ??
            summaryData.staffCount ??
            summaryData.totalStaff ??
            summaryData.activeStaffCount
        ).toLocaleString(),
        icon: Users,
      },
      {
        title: "Vendors",
        value: toNumber(summary.totalVendorsCount ?? summaryData.vendorsCount).toLocaleString(),
        icon: Package,
      },
      {
        title: "Parts",
        value: toNumber(summary.totalPartsCount).toLocaleString(),
        icon: Wrench,
      },
      {
        title: "Purchase Invoices",
        value: toNumber(summary.totalPurchaseInvoicesCount).toLocaleString(),
        subtitle: `Pending ${toNumber(summary.pendingInvoicesCount).toLocaleString()}`,
        icon: ClipboardList,
      },
      {
        title: "Appointments",
        value: toNumber(summary.totalAppointmentsCount).toLocaleString(),
        subtitle: `Pending ${toNumber(summary.pendingAppointmentsCount).toLocaleString()}`,
        icon: Bell,
      },
      {
        title: "Reviews",
        value: toNumber(summary.totalReviewsCount).toLocaleString(),
        subtitle: `Avg ${toNumber(summary.averageReviewRating).toFixed(2)} / 5`,
        icon: Users,
      },
      {
        title: "Inventory Value",
        value: `$${toNumber(summary.totalInventoryValue).toLocaleString()}`,
        icon: Package,
      },
      {
        title: "Low Stock Parts",
        value: toNumber(summary.lowStockPartsCount ?? lowStockParts.length).toLocaleString(),
        subtitle: `Pending requests ${toNumber(summary.pendingPartRequestsCount).toLocaleString()}`,
        icon: AlertTriangle,
      },
    ],
    [lowStockParts.length, summary, summaryData, totalRevenue]
  );

  const maxTrendRevenue = Math.max(...trend.map((item) => toNumber(item.revenue)), 1);
  const priorityTotalPages = Math.max(
    1,
    Math.ceil(priorityAlerts.length / PRIORITY_ALERTS_PAGE_SIZE)
  );
  const safePriorityPage = Math.min(priorityPage, priorityTotalPages);
  const paginatedPriorityAlerts = priorityAlerts.slice(
    (safePriorityPage - 1) * PRIORITY_ALERTS_PAGE_SIZE,
    safePriorityPage * PRIORITY_ALERTS_PAGE_SIZE
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Dashboard</h1>
          <p className="mt-1 text-base text-[#45474c]">Business overview and operational snapshot.</p>
        </header>

        {loading ? <LoadingState message="Loading dashboard..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={() => void refreshDashboard()} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="rounded-xl border border-[#c5c6cd] bg-white px-5 py-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#45474c]">{card.title}</p>
                      <Icon className="size-4 text-[#006a61]" />
                    </div>
                    <p className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#1b1b1d]">{card.value}</p>
                    {card.subtitle ? <p className="mt-1 text-xs text-[#6b7280]">{card.subtitle}</p> : null}
                  </article>
                );
              })}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-5 xl:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-[#1b1b1d]">Revenue Trend</h2>
                  <FilterTabs
                    tabs={[
                      { key: "daily", label: "Daily" },
                      { key: "weekly", label: "Weekly" },
                      { key: "monthly", label: "Monthly" },
                    ]}
                    activeKey={trendRange}
                    onChange={(key) => setTrendRange(key as RevenueRange)}
                  />
                </div>

                {trendLoading ? (
                  <div className="mt-4">
                    <LoadingState message="Loading revenue trend..." />
                  </div>
                ) : trendError ? (
                  <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
                    {trendError}
                  </div>
                ) : trend.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-[#c5c6cd] bg-[#f5f3f4] p-4 text-sm text-[#45474c]">
                    No trend data available.
                  </div>
                ) : (
                  <div className="mt-6 overflow-x-auto">
                    <div className="flex min-w-[640px] items-end gap-3">
                      {trend.map((point) => {
                        const revenue = toNumber(point.revenue);
                        return (
                          <div key={`${point.date}-${point.label}`} className="flex flex-col items-center gap-2">
                            <div className="flex h-80 w-10 items-end rounded-t-md bg-[#f0edef]">
                              <div
                                className="w-full rounded-t-md bg-[#006a61]"
                                style={{ height: `${Math.max((revenue / maxTrendRevenue) * 100, 8)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-[#45474c]">{point.label}</span>
                            <span className="text-[10px] text-[#6b7280]">${revenue.toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>

              <article className="rounded-xl border border-[#c5c6cd] bg-white p-5">
                <h2 className="text-2xl font-semibold text-[#1b1b1d]">Recent Activity</h2>
                {activityLoading ? (
                  <div className="mt-4">
                    <LoadingState message="Loading activity..." />
                  </div>
                ) : activityError ? (
                  <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
                    {activityError}
                  </div>
                ) : activities.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-[#c5c6cd] bg-[#f5f3f4] p-4 text-sm text-[#45474c]">
                    No recent activity available.
                  </div>
                ) : (
                  <div className="mt-4 max-h-[420px] space-y-3 overflow-auto pr-1">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="rounded-lg border border-[#e2e8f0] bg-[#fff] p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[#1b1b1d]">{activity.title}</p>
                          <span className="rounded-full bg-[#f0edef] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#45474c]">
                            {activity.type}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#45474c]">{activity.description}</p>
                        <p className="mt-1 text-xs text-[#6b7280]">
                          {toDateLabel(activity.createdAt)}{activity.actorName ? ` • ${activity.actorName}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-2">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-5">
                <h2 className="text-2xl font-semibold text-[#1b1b1d]">Fast Moving Inventory</h2>
                {fastMovingLoading ? (
                  <div className="mt-4">
                    <LoadingState message="Loading inventory insights..." />
                  </div>
                ) : fastMovingError ? (
                  <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
                    {fastMovingError}
                  </div>
                ) : fastMoving.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-[#c5c6cd] bg-[#f5f3f4] p-4 text-sm text-[#45474c]">
                    No fast-moving inventory data available.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[540px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#c5c6cd] uppercase tracking-[0.08em] text-[#45474c]">
                          <th className="py-2">Part</th>
                          <th className="py-2">Sold</th>
                          <th className="py-2">Stock</th>
                          <th className="py-2">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fastMoving.map((row) => (
                          <tr key={row.partId} className="border-b border-[#edf0f4] text-[#1b1b1d]">
                            <td className="py-2 font-medium">{row.partName}</td>
                            <td className="py-2">{toNumber(row.soldQuantity)}</td>
                            <td className="py-2">{toNumber(row.currentStock)}</td>
                            <td className="py-2">${toNumber(row.revenue).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </article>

              <article className="rounded-xl border border-[#c5c6cd] bg-white p-5">
                <h2 className="text-2xl font-semibold text-[#1b1b1d]">Priority Alerts</h2>
                {priorityLoading ? (
                  <div className="mt-4">
                    <LoadingState message="Loading priority alerts..." />
                  </div>
                ) : priorityError ? (
                  <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] p-4 text-sm text-[#b91c1c]">
                    {priorityError}
                  </div>
                ) : priorityAlerts.length === 0 ? (
                  <div className="mt-4 rounded-lg border border-dashed border-[#c5c6cd] bg-[#f5f3f4] p-4 text-sm text-[#45474c]">
                    No priority alerts right now.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {paginatedPriorityAlerts.map((alert) => {
                      const severity = alert.severity.toLowerCase();
                      const badgeClass =
                        severity === "high"
                          ? "bg-[#fee2e2] text-[#b91c1c]"
                          : severity === "medium"
                            ? "bg-[#fef3c7] text-[#b45309]"
                            : "bg-[#e0f2fe] text-[#0369a1]";

                      return (
                        <div key={alert.id} className="rounded-lg border border-[#e2e8f0] bg-white p-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-[#1b1b1d]">{alert.title}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-[#45474c]">{alert.description}</p>
                          <p className="mt-1 text-xs text-[#6b7280]">
                            {alert.type} • {toDateLabel(alert.createdAt)}
                          </p>
                        </div>
                      );
                    })}
                    <div className="flex items-center justify-between border-t border-[#edf0f4] pt-2 text-xs text-[#6b7280]">
                      <p>
                        Page {safePriorityPage} of {priorityTotalPages}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPriorityPage((prev) => Math.max(1, prev - 1))}
                          disabled={safePriorityPage <= 1}
                          className="rounded border border-[#c5c6cd] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setPriorityPage((prev) => Math.min(priorityTotalPages, prev + 1))
                          }
                          disabled={safePriorityPage >= priorityTotalPages}
                          className="rounded border border-[#c5c6cd] px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
              <h2 className="text-2xl font-semibold text-[#1b1b1d]">Low Stock Parts</h2>
              {lowStockParts.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No low stock parts"
                    description="Low stock feed is empty right now or there are no active low-stock parts."
                  />
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left">
                    <thead>
                      <tr className="border-b border-[#c5c6cd] text-sm uppercase tracking-[0.08em] text-[#45474c]">
                        <th className="py-2">Part</th>
                        <th className="py-2">Part Number</th>
                        <th className="py-2">Stock</th>
                        <th className="py-2">Minimum Stock Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockParts.map((part) => (
                        <tr key={part.id} className="border-b border-[#edf0f4] text-sm text-[#1b1b1d]">
                          <td className="py-3 font-medium">{part.partName}</td>
                          <td className="py-3">{part.partNumber ?? "-"}</td>
                          <td className="py-3">{part.stockQuantity ?? 0}</td>
                          <td className="py-3">{part.minimumStockLevel ?? part.reorderLevel ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AdminLayout>
  );
}
