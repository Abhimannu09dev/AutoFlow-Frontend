"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { CalendarDays, ClipboardList, DollarSign, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/ui";

import { apiRequest, normalizePartRequestStatus, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/staff-api";
import type { AppointmentRow, DashboardSummary, PartRequestRow, PartRow, SaleRow } from "../shared/staff.types";

function getAppointmentStatusLabel(status: string | undefined): string {
  const lowered = (status ?? "pending").toLowerCase();
  if (lowered === "inprogress" || lowered === "in progress") return "In Progress";
  if (lowered === "confirmed") return "Confirmed";
  if (lowered === "completed") return "Completed";
  if (lowered === "cancelled") return "Cancelled";
  return "Pending";
}

function getStatusChipClass(status: string): string {
  const lowered = status.toLowerCase();
  if (lowered === "in progress") return "bg-[#d1fae5] text-[#059669]";
  if (lowered === "confirmed") return "bg-[#dbeafe] text-[#2563eb]";
  if (lowered === "completed") return "bg-[#dcfce7] text-[#16a34a]";
  if (lowered === "cancelled") return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#fef3c7] text-[#d97706]";
}

export default function StaffDailyOperationsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<DashboardSummary>({});
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [lowStockRows, setLowStockRows] = useState<PartRow[]>([]);
  const [partRequests, setPartRequests] = useState<PartRequestRow[]>([]);
  const [sales, setSales] = useState<SaleRow[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [
      dashboardResult,
      appointmentsResult,
      lowStockResult,
      requestsResult,
      salesResult,
    ] = await Promise.all([
      apiRequest<DashboardSummary>("/api/dashboard"),
      apiRequest<AppointmentRow[]>("/api/appointments?page=1&pageSize=50"),
      apiRequest<PartRow[]>("/api/parts/low-stock"),
      apiRequest<PartRequestRow[]>("/api/parts-requests?pageNumber=1&pageSize=50"),
      apiRequest<SaleRow[]>("/api/sales"),
    ]);

    if (appointmentsResult.error && lowStockResult.error && requestsResult.error && salesResult.error) {
      setError(appointmentsResult.error ?? lowStockResult.error ?? requestsResult.error ?? salesResult.error);
    }

    if (dashboardResult.error) {
      setSummary({});
    } else {
      setSummary(unwrapData<DashboardSummary>(dashboardResult.data, {}));
    }

    setAppointments(unwrapArray<AppointmentRow>(appointmentsResult.data));
    setLowStockRows(unwrapArray<PartRow>(lowStockResult.data));
    setPartRequests(unwrapArray<PartRequestRow>(requestsResult.data));
    setSales(unwrapArray<SaleRow>(salesResult.data));

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const scheduleRows = useMemo(() => {
    return appointments
      .slice()
      .sort((a, b) => {
        const aDate = `${a.date ?? ""} ${a.time ?? ""}`;
        const bDate = `${b.date ?? ""} ${b.time ?? ""}`;
        return aDate.localeCompare(bDate);
      })
      .slice(0, 4);
  }, [appointments]);

  const totalSalesAmount = useMemo(() => {
    return sales.reduce((sum, row) => sum + toNumber(row.totalAmount), 0);
  }, [sales]);

  const pendingAppointments = useMemo(() => {
    return appointments.filter((row) => (row.status ?? "").toLowerCase() === "pending").length;
  }, [appointments]);

  const pendingPartRequests = useMemo(() => {
    return partRequests.filter((row) => normalizePartRequestStatus(row.status).toLowerCase() === "pending").length;
  }, [partRequests]);

  const cards = [
    {
      label: "Today's Appts",
      value: toNumber(summary.totalAppointmentsCount, appointments.length),
      subtitle: `${pendingAppointments} pending`,
      icon: CalendarDays,
      accent: "bg-[#10b981]",
    },
    {
      label: "Pending Appts",
      value: toNumber(summary.pendingAppointmentsCount, pendingAppointments),
      subtitle: "Requires confirmation",
      icon: CalendarDays,
      accent: "bg-[#f59e0b]",
    },
    {
      label: "Low Stock Parts",
      value: toNumber(summary.lowStockPartsCount, lowStockRows.length),
      subtitle: "Action required",
      icon: TriangleAlert,
      accent: "bg-[#ef4444]",
    },
    {
      label: "Recent Sales",
      value: `$${toNumber(summary.totalRevenue, totalSalesAmount).toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
      subtitle: `${toNumber(summary.totalSalesCount, sales.length)} transactions`,
      icon: DollarSign,
      accent: "bg-[#0d9488]",
    },
    {
      label: "Part Requests",
      value: toNumber(summary.pendingPartRequestsCount, pendingPartRequests),
      subtitle: "Pending approval",
      icon: ClipboardList,
      accent: "bg-[#006a61]",
    },
  ];

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Daily Operations</h1>
            <p className="mt-1 text-base text-[#45474c]">Staff Dashboard - {toDateLabel(new Date().toISOString())}</p>
          </div>
          <Link
            href="/staff/invoices"
            className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] bg-white px-4 py-2.5 text-sm font-medium text-[#1e293b]"
          >
            Create Sale
          </Link>
        </header>

        {loading ? <LoadingState message="Loading staff dashboard..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {cards.map((card) => {
                const Icon = card.icon;
                return (
                  <article key={card.label} className="relative overflow-hidden rounded-xl border border-[#c5c6cd] bg-white p-4">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-medium text-[#45474c]">{card.label}</p>
                      <Icon className="size-5 text-[#0d9488]" />
                    </div>
                    <p className="mt-3 text-[40px] font-semibold leading-none text-[#1b1b1d]">{card.value}</p>
                    <p className="mt-2 text-xs text-[#45474c]">{card.subtitle}</p>
                    <span className={`absolute inset-x-0 bottom-0 h-1 ${card.accent}`} />
                  </article>
                );
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
              <article className="rounded-xl border border-[#c5c6cd] bg-white">
                <div className="flex items-center justify-between border-b border-[#c5c6cd] px-4 py-3">
                  <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Today&apos;s Service Schedule</h2>
                  <Link href="/staff/inventory" className="text-sm font-semibold text-[#006a61] hover:underline">
                    View All
                  </Link>
                </div>

                {scheduleRows.length === 0 ? (
                  <div className="p-4">
                    <EmptyState title="No appointments" description="No service appointments available for today." />
                  </div>
                ) : (
                  <div className="divide-y divide-[#e2e8f0]">
                    {scheduleRows.map((row) => {
                      const statusLabel = getAppointmentStatusLabel(row.status);
                      return (
                        <div key={row.id} className="grid gap-3 px-4 py-4 md:grid-cols-[80px_1fr_auto] md:items-center">
                          <div className="text-sm font-medium text-[#1b1b1d]">{row.time ?? "--:--"}</div>
                          <div>
                            <p className="text-base font-medium text-[#1b1b1d]">Vehicle: {row.vehicleNumber ?? "Unassigned"}</p>
                            <p className="text-sm text-[#45474c]">Customer ID: {row.customerId ?? "-"}</p>
                          </div>
                          <span className={`inline-flex w-fit rounded-md px-3 py-1 text-xs font-semibold ${getStatusChipClass(statusLabel)}`}>
                            {statusLabel}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>

              <div className="space-y-6">
                <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                  <h3 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Low Stock Alerts</h3>
                  <div className="mt-4 space-y-3">
                    {lowStockRows.slice(0, 3).map((row) => (
                      <div key={row.id} className="rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] p-3">
                        <p className="text-sm font-medium text-[#1b1b1d]">{row.partName ?? "Part"}</p>
                        <p className="mt-1 text-xs font-semibold text-[#ef4444]">{toNumber(row.stockQuantity)} units left</p>
                      </div>
                    ))}
                    {lowStockRows.length === 0 ? (
                      <p className="text-sm text-[#45474c]">No low stock items.</p>
                    ) : null}
                  </div>
                  <Link
                    href="/staff/parts"
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[#c5c6cd] px-3 py-2 text-xs font-semibold text-[#006a61]"
                  >
                    View Full Inventory
                  </Link>
                </article>

                <article className="rounded-xl bg-[#1e293b] p-4 text-white">
                  <h3 className="text-[32px] font-semibold tracking-[-0.02em]">Quick Tools</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link href="/staff/management" className="rounded-lg bg-white/10 p-3 text-center text-xs font-semibold">
                      Add Customer
                    </Link>
                    <Link href="/staff/parts" className="rounded-lg bg-white/10 p-3 text-center text-xs font-semibold">
                      Search Part
                    </Link>
                    <Link href="/staff/repair-orders" className="rounded-lg bg-white/10 p-3 text-center text-xs font-semibold">
                      New Vehicle
                    </Link>
                    <Link href="/staff/invoices" className="rounded-lg bg-white/10 p-3 text-center text-xs font-semibold">
                      Sales
                    </Link>
                  </div>
                </article>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </StaffShell>
  );
}
