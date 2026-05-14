"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { FileSpreadsheet } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import { EmptyState, ErrorState, LoadingState, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/admin-api";
import type { FinancialYearly, SaleRow } from "../shared/admin.types";

type ReportType = "yearly" | "monthly" | "daily";

const now = new Date();

function toCsv(rows: SaleRow[]): string {
  const header = ["Invoice", "Customer", "Date", "Method", "Subtotal", "Discount", "Total", "Status"];
  const body = rows.map((row) => [
    row.invoiceNumber ?? row.id,
    row.customerName ?? "",
    row.saleDate ?? "",
    row.paymentMethod ?? "",
    toNumber(row.subTotal).toFixed(2),
    toNumber(row.discountAmount).toFixed(2),
    toNumber(row.totalAmount).toFixed(2),
    row.status ?? "",
  ]);

  return [header, ...body]
    .map((cols) => cols.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function isRowInPeriod(
  row: SaleRow,
  reportType: ReportType,
  selectedYear: string,
  selectedMonth: string,
  selectedDate: string
): boolean {
  if (!row.saleDate) return false;
  const parsed = new Date(row.saleDate);
  if (Number.isNaN(parsed.getTime())) return false;

  const rowYear = parsed.getFullYear();
  const rowMonth = parsed.getMonth() + 1;
  const rowDate = row.saleDate.slice(0, 10);

  if (reportType === "daily") {
    return rowDate === selectedDate;
  }

  if (reportType === "monthly") {
    return rowYear === Number(selectedYear) && rowMonth === Number(selectedMonth);
  }

  return rowYear === Number(selectedYear);
}

export default function AdminFinancialReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [reportType, setReportType] = useState<ReportType>("yearly");
  const [selectedDate, setSelectedDate] = useState(now.toISOString().slice(0, 10));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));

  const [summary, setSummary] = useState<FinancialYearly>({});
  const [sales, setSales] = useState<SaleRow[]>([]);

  const summaryEndpoint = useMemo(() => {
    if (reportType === "daily") {
      return `/api/reports/financial/daily?date=${encodeURIComponent(selectedDate)}`;
    }
    if (reportType === "monthly") {
      return `/api/reports/financial/monthly?year=${encodeURIComponent(selectedYear)}&month=${encodeURIComponent(selectedMonth)}`;
    }
    return `/api/reports/financial/yearly?year=${encodeURIComponent(selectedYear)}`;
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [summaryResult, salesResult] = await Promise.all([
      apiRequest<FinancialYearly>(summaryEndpoint),
      apiRequest<SaleRow[]>("/api/sales"),
    ]);

    if (summaryResult.error) {
      setError(summaryResult.error);
      setSummary({});
    } else {
      setSummary(unwrapData<FinancialYearly>(summaryResult.data, {}));
    }

    setSales(unwrapArray<SaleRow>(salesResult.data));

    setLoading(false);
  }, [summaryEndpoint]);

  useEffect(() => {
    void load();
  }, [load]);

  const periodFilteredSales = useMemo(() => {
    return sales.filter((row) => isRowInPeriod(row, reportType, selectedYear, selectedMonth, selectedDate));
  }, [reportType, sales, selectedDate, selectedMonth, selectedYear]);

  const filteredSales = useMemo(() => {
    const lowered = query.toLowerCase();
    return periodFilteredSales.filter((row) => {
      return (
        (row.customerName ?? "").toLowerCase().includes(lowered) ||
        (row.paymentMethod ?? "").toLowerCase().includes(lowered) ||
        (row.invoiceNumber ?? row.id).toLowerCase().includes(lowered)
      );
    });
  }, [periodFilteredSales, query]);

  const exportDisabled = filteredSales.length === 0;

  const exportCsv = () => {
    if (exportDisabled) return;
    const content = toCsv(filteredSales);
    const filename =
      reportType === "daily"
        ? `daily-${selectedDate}.csv`
        : reportType === "monthly"
          ? `monthly-${selectedYear}-${selectedMonth.padStart(2, "0")}.csv`
          : `yearly-${selectedYear}.csv`;
    downloadCsv(filename, content);
  };

  const cards = [
    { label: "Period", value: summary.period ?? "-", money: false },
    { label: "Total Sales", value: toNumber(summary.totalSales).toLocaleString(), money: false },
    { label: "Total Revenue", value: toNumber(summary.totalRevenue).toLocaleString(), money: true },
    { label: "Total Discount", value: toNumber(summary.totalDiscount).toLocaleString(), money: true },
    { label: "Net Revenue", value: toNumber(summary.netRevenue).toLocaleString(), money: true },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Financial Reports</h1>
            <p className="mt-1 max-w-lg text-base text-[#45474c]">
              Daily, monthly, and yearly financial snapshots from backend reports endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-[#1b1b1d]">
              Report Type
              <select
                value={reportType}
                onChange={(event) => setReportType(event.target.value as ReportType)}
                className="mt-1 block h-11 rounded-md border border-[#6b7280] bg-white px-3 text-sm"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
            </label>

            {(reportType === "yearly" || reportType === "monthly") && (
              <label className="text-sm text-[#1b1b1d]">
                Year
                <input
                  type="number"
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                  className="mt-1 block h-11 w-28 rounded-md border border-[#6b7280] bg-white px-3 text-sm"
                />
              </label>
            )}

            {reportType === "monthly" && (
              <label className="text-sm text-[#1b1b1d]">
                Month
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="mt-1 block h-11 w-24 rounded-md border border-[#6b7280] bg-white px-3 text-sm"
                />
              </label>
            )}

            {reportType === "daily" && (
              <label className="text-sm text-[#1b1b1d]">
                Date
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className="mt-1 block h-11 rounded-md border border-[#6b7280] bg-white px-3 text-sm"
                />
              </label>
            )}
          </div>
        </header>

        <div className="flex justify-end gap-2">
          <button
            onClick={exportCsv}
            disabled={exportDisabled}
            className="inline-flex items-center gap-2 rounded-xl border border-black px-4 py-2 text-sm text-[#1b1b1d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet className="size-4" /> Export CSV
          </button>
        </div>

        {loading ? <LoadingState message="Loading reports..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              {cards.map((card) => (
                <article key={card.label} className="rounded-xl border border-black bg-white px-4 py-5 text-center">
                  <p className="text-sm text-[#45474c]">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#1b1b1d]">
                    {card.money ? `$${card.value}` : card.value}
                  </p>
                </article>
              ))}
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] px-4 py-3">
                <h3 className="text-2xl font-semibold text-[#1b1b1d]">Detailed Report</h3>
                <SearchInput value={query} onChange={setQuery} placeholder="Search sales..." />
              </div>

              {filteredSales.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    title="No report rows"
                    description="No rows matched your report filters and search criteria."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1040px]">
                    <thead>
                      <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                        <th className="px-4 py-3">Invoice</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3 text-right">Subtotal</th>
                        <th className="px-4 py-3 text-right">Disc</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((row) => (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3">{row.invoiceNumber ?? row.id}</td>
                          <td className="px-4 py-3">{row.customerName ?? "-"}</td>
                          <td className="px-4 py-3">{toDateLabel(row.saleDate)}</td>
                          <td className="px-4 py-3">{row.paymentMethod ?? "-"}</td>
                          <td className="px-4 py-3 text-right">${toNumber(row.subTotal).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">${toNumber(row.discountAmount).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right font-medium">${toNumber(row.totalAmount).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                row.status?.toLowerCase() === "completed"
                                  ? "bg-[#86f2e4] text-[#006f66]"
                                  : row.status?.toLowerCase() === "cancelled"
                                    ? "bg-[#fee2e2] text-[#ef4444]"
                                    : "bg-[#fef3c7] text-[#f59e0b]"
                              }`}
                            >
                              {row.status ?? "Pending"}
                            </span>
                          </td>
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
