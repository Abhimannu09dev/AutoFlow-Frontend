"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import {
  ArrowDownToLine,
  Calculator,
  CalendarRange,
  Check,
  Eye,
  MoreVertical,
  Plus,
  Receipt,
  Send,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  SearchInput,
  TextArea,
} from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/staff-api";
import type { CustomerRow, PartRow, SaleItemRow, SaleRow } from "../shared/staff.types";

type SaleItemFormRow = {
  partId: string;
  quantity: string;
};

type SaleCreateForm = {
  customerId: string;
  paymentMethod: "Cash" | "Credit" | "Card";
  notes: string;
  items: SaleItemFormRow[];
};

type SaleItemDraftRow = {
  partId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  stockQuantity: number;
  partLabel: string;
};

type DateFilterMode = "all" | "date" | "month" | "year";
type SendInvoiceResponse = {
  saleId?: string;
  invoiceSentAt?: string | null;
  invoiceFailedAt?: string | null;
  invoiceFailureReason?: string | null;
};

const defaultCreateForm: SaleCreateForm = {
  customerId: "",
  paymentMethod: "Cash",
  notes: "",
  items: [{ partId: "", quantity: "1" }],
};

const pageSize = 6;
const loyaltyThreshold = 5000;
const loyaltyRate = 0.1;

function statusChipClass(status: string | undefined): string {
  const lowered = (status ?? "pending").toLowerCase();
  if (lowered === "completed" || lowered === "paid") return "bg-[rgba(16,185,129,0.1)] text-[#10b981]";
  if (lowered === "failed" || lowered === "cancelled") return "bg-[rgba(239,68,68,0.1)] text-[#ef4444]";
  if (lowered === "refunded") return "bg-[rgba(59,130,246,0.1)] text-[#2563eb]";
  return "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]";
}

function toCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function normalizeStatus(status: string | undefined): string {
  return (status ?? "pending").toLowerCase();
}

export default function StaffSalesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<SaleRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [parts, setParts] = useState<PartRow[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>("all");
  const [dateFilterValue, setDateFilterValue] = useState("");
  const [page, setPage] = useState(1);

  const [selectedRow, setSelectedRow] = useState<SaleRow | null>(null);
  const [sendBusyId, setSendBusyId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<SaleCreateForm>(defaultCreateForm);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [exportError, setExportError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [salesResult, customersResult, partsResult] = await Promise.all([
      apiRequest<SaleRow[]>("/api/sales?page=1&pageSize=500"),
      apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=500"),
      apiRequest<PartRow[]>("/api/parts?page=1&pageSize=500"),
    ]);

    if (salesResult.error) {
      setRows([]);
      setError(salesResult.error);
    } else {
      setRows(unwrapArray<SaleRow>(salesResult.data));
    }

    setCustomers(unwrapArray<CustomerRow>(customersResult.data));
    setParts(unwrapArray<PartRow>(partsResult.data));

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const customerNameById = useMemo(() => {
    return new Map(customers.map((row) => [row.id, row.fullName]));
  }, [customers]);

  const partById = useMemo(() => {
    return new Map(parts.map((row) => [row.id, row]));
  }, [parts]);

  const normalizedRows = useMemo(() => {
    return rows.map((row) => {
      const resolvedCustomer = row.customerName ?? customerNameById.get(row.customerId ?? "") ?? row.customerId ?? "-";
      return {
        ...row,
        customerName: resolvedCustomer,
      };
    });
  }, [customerNameById, rows]);

  const filtered = useMemo(() => {
    const lowered = search.trim().toLowerCase();

    return normalizedRows.filter((row) => {
      const saleDate = row.saleDate ?? row.createdAt ?? "";
      const saleDateOnly = saleDate.slice(0, 10);
      const saleMonth = saleDateOnly.slice(0, 7);
      const saleYear = saleDateOnly.slice(0, 4);

      const matchesSearch =
        !lowered ||
        (row.invoiceNumber ?? row.id).toLowerCase().includes(lowered) ||
        (row.customerName ?? "").toLowerCase().includes(lowered) ||
        (row.paymentMethod ?? "").toLowerCase().includes(lowered);

      const matchesStatus = statusFilter === "all" || normalizeStatus(row.status) === statusFilter;
      const matchesPayment = paymentFilter === "all" || (row.paymentMethod ?? "").toLowerCase() === paymentFilter;

      let matchesDate = true;
      if (dateFilterMode === "date" && dateFilterValue) {
        matchesDate = saleDateOnly === dateFilterValue;
      } else if (dateFilterMode === "month" && dateFilterValue) {
        matchesDate = saleMonth === dateFilterValue;
      } else if (dateFilterMode === "year" && dateFilterValue) {
        matchesDate = saleYear === dateFilterValue;
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [dateFilterMode, dateFilterValue, normalizedRows, paymentFilter, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const summary = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const month = today.slice(0, 7);

    let totalRevenue = 0;
    let todayRevenue = 0;
    let monthRevenue = 0;
    let completedSales = 0;
    let pendingOrFailed = 0;

    for (const row of filtered) {
      const amount = toNumber(row.totalAmount);
      const status = normalizeStatus(row.status);
      const date = (row.saleDate ?? row.createdAt ?? "").slice(0, 10);

      totalRevenue += amount;

      if (date === today) todayRevenue += amount;
      if (date.startsWith(month)) monthRevenue += amount;

      if (status === "completed" || status === "paid") completedSales += 1;
      if (status === "pending" || status === "failed" || status === "cancelled") pendingOrFailed += 1;
    }

    return {
      totalSales: filtered.length,
      totalRevenue,
      todayRevenue,
      monthRevenue,
      completedSales,
      pendingOrFailed,
    };
  }, [filtered]);

  const exportRowsToCsv = (rowsToExport: SaleRow[]) => {
    const header = [
      "Invoice #",
      "Customer Name",
      "Sale Date",
      "Total Amount",
      "Payment Method",
      "Status",
    ];

    const bodyRows = rowsToExport.map((row) => [
      row.invoiceNumber ?? row.id,
      row.customerName ?? "-",
      toDateLabel(row.saleDate ?? row.createdAt),
      toNumber(row.totalAmount).toFixed(2),
      row.paymentMethod ?? "-",
      row.status ?? "Pending",
    ]);

    const csvContent = [header, ...bodyRows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staff-sales-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onExport = () => {
    if (filtered.length === 0) {
      setExportError("No sales rows to export for current filters.");
      return;
    }

    setExportError(null);
    exportRowsToCsv(filtered);
  };

  const onSendInvoice = async (saleId: string) => {
    setSendBusyId(saleId);
    setActionMessage(null);

    const result = await apiRequest<SendInvoiceResponse>(`/api/sales/${saleId}/send-invoice`, { method: "POST" });

    setSendBusyId(null);

    if (result.error) {
      setActionMessage(`Failed to send invoice: ${result.error}`);
      return;
    }

    const payload = unwrapData<SendInvoiceResponse | null>(result.data, null);
    const payloadRecord = (payload && typeof payload === "object")
      ? (payload as Record<string, unknown>)
      : {};
    const sentAtValue =
      (typeof payloadRecord.invoiceSentAt === "string" ? payloadRecord.invoiceSentAt : null) ??
      (typeof payloadRecord.InvoiceSentAt === "string" ? payloadRecord.InvoiceSentAt : null);
    const failedAtValue =
      (typeof payloadRecord.invoiceFailedAt === "string" ? payloadRecord.invoiceFailedAt : null) ??
      (typeof payloadRecord.InvoiceFailedAt === "string" ? payloadRecord.InvoiceFailedAt : null);
    const failureReason =
      (typeof payloadRecord.invoiceFailureReason === "string" ? payloadRecord.invoiceFailureReason : null) ??
      (typeof payloadRecord.InvoiceFailureReason === "string" ? payloadRecord.InvoiceFailureReason : null);

    const sentAt = sentAtValue ? toDateLabel(sentAtValue) : null;
    const failedAt = failedAtValue ? toDateLabel(failedAtValue) : null;

    if (failedAt || failureReason) {
      setActionMessage(
        `Invoice request processed with failure state${failedAt ? ` (${failedAt})` : ""}: ${failureReason ?? "Unknown error"}`
      );
      await load();
      return;
    }

    setActionMessage(sentAt ? `Invoice sent successfully (${sentAt}).` : "Invoice sent successfully.");
    await load();
  };

  const onCreateSale = async () => {
    if (!createForm.customerId) {
      setCreateError("Customer is required.");
      return;
    }

    const parsedItems = createForm.items.map((item) => ({
      partId: item.partId,
      quantity: Number(item.quantity),
    }));

    if (parsedItems.length === 0) {
      setCreateError("At least one valid sale item is required.");
      return;
    }

    const hasInvalidRow = parsedItems.some(
      (item) => !item.partId || !Number.isFinite(item.quantity) || item.quantity <= 0
    );
    if (hasInvalidRow) {
      setCreateError("Each line item requires a part and quantity greater than zero.");
      return;
    }

    const stockLimitedRow = parsedItems.find((item) => {
      const part = partById.get(item.partId);
      const stock = toNumber(part?.stockQuantity);
      return stock > 0 && item.quantity > stock;
    });
    if (stockLimitedRow) {
      const partLabel = partById.get(stockLimitedRow.partId)?.partName ?? "Selected part";
      setCreateError(`${partLabel} exceeds available stock for the selected quantity.`);
      return;
    }

    setCreateSubmitting(true);
    setCreateError(null);

    const result = await apiRequest<SaleRow>("/api/sales", {
      method: "POST",
      body: JSON.stringify({
        customerId: createForm.customerId,
        paymentMethod: createForm.paymentMethod,
        notes: createForm.notes.trim() || null,
        items: parsedItems,
      }),
    });

    setCreateSubmitting(false);

    if (result.error) {
      setCreateError(result.error);
      return;
    }

    setCreateOpen(false);
    setCreateForm(defaultCreateForm);
    setActionMessage("Sale created successfully.");
    await load();
  };

  const createDraftRows = useMemo<SaleItemDraftRow[]>(() => {
    return createForm.items.map((item) => {
      const quantity = Math.max(0, Number(item.quantity) || 0);
      const selectedPart = partById.get(item.partId);
      const unitPrice = toNumber(selectedPart?.sellingPrice ?? selectedPart?.unitPrice);
      return {
        partId: item.partId,
        quantity,
        unitPrice,
        lineTotal: quantity * unitPrice,
        stockQuantity: toNumber(selectedPart?.stockQuantity),
        partLabel: selectedPart?.partName ?? selectedPart?.partNumber ?? selectedPart?.id ?? "Part / Service",
      };
    });
  }, [createForm.items, partById]);

  const createSummary = useMemo(() => {
    const subtotal = createDraftRows.reduce((sum, row) => sum + row.lineTotal, 0);
    const loyaltyDiscount = subtotal > loyaltyThreshold ? subtotal * loyaltyRate : 0;
    const totalAmount = Math.max(subtotal - loyaltyDiscount, 0);
    return { subtotal, loyaltyDiscount, totalAmount };
  }, [createDraftRows]);

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-[#1b1b1d]">Sales Ledger</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage and track all workshop transactions and invoices.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-1 rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-4 py-3 text-sm font-medium text-[#45474c]"
            >
              <ArrowDownToLine className="size-4" />
              Export
            </button>
            <button
              type="button"
              onClick={() => {
                setCreateError(null);
                setCreateForm(defaultCreateForm);
                setCreateOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0d9488] px-6 py-3 text-sm font-medium text-white"
            >
              <Plus className="size-4" />
              Create Sale
            </button>
          </div>
        </header>

        {exportError ? (
          <div className="rounded-lg border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{exportError}</div>
        ) : null}
        {actionMessage ? (
          <div className="rounded-lg border border-[#c5c6cd] bg-[#f8fafc] px-3 py-2 text-sm text-[#1e293b]">{actionMessage}</div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#45474c]">
              <Receipt className="size-4 text-[#1e293b]" />
              Total Sales
            </div>
            <p className="text-4xl font-bold tracking-[-0.02em] text-[#1b1b1d]">{summary.totalSales}</p>
            <p className="mt-2 text-xs font-semibold tracking-[0.04em] text-[#45474c]">Completed: {summary.completedSales}</p>
          </article>

          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#45474c]">
              <Wallet className="size-4 text-[#0d9488]" />
              Total Revenue
            </div>
            <p className="text-4xl font-bold tracking-[-0.02em] text-[#1b1b1d]">{toCurrency(summary.totalRevenue)}</p>
            <p className="mt-2 text-xs font-semibold tracking-[0.04em] text-[#45474c]">Pending/Failed: {summary.pendingOrFailed}</p>
          </article>

          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-6 md:col-span-2 xl:col-span-1">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#45474c]">
              <TrendingUp className="size-4 text-[#f59e0b]" />
              Revenue Trend
            </div>
            <p className="text-xl font-semibold text-[#1b1b1d]">Today: {toCurrency(summary.todayRevenue)}</p>
            <p className="mt-1 text-sm text-[#45474c]">Month: {toCurrency(summary.monthRevenue)}</p>
          </article>
        </section>

        <section className="rounded-xl border border-[#c5c6cd] bg-white p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_140px_170px] lg:items-end">
            <SearchInput value={search} onChange={setSearch} placeholder="Search invoice, customer, payment" />

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Payment</span>
              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="credit">Credit</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Date Type</span>
              <select
                value={dateFilterMode}
                onChange={(event) => {
                  setDateFilterMode(event.target.value as DateFilterMode);
                  setDateFilterValue("");
                }}
                className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
              >
                <option value="all">All</option>
                <option value="date">Date</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Period</span>
              {dateFilterMode === "date" ? (
                <input
                  type="date"
                  value={dateFilterValue}
                  onChange={(event) => setDateFilterValue(event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
                />
              ) : null}
              {dateFilterMode === "month" ? (
                <input
                  type="month"
                  value={dateFilterValue}
                  onChange={(event) => setDateFilterValue(event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
                />
              ) : null}
              {dateFilterMode === "year" ? (
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={dateFilterValue}
                  onChange={(event) => setDateFilterValue(event.target.value)}
                  placeholder="YYYY"
                  className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm"
                />
              ) : null}
              {dateFilterMode === "all" ? (
                <div className="flex h-10 items-center rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-3 text-sm text-[#64748b]">
                  <CalendarRange className="mr-2 size-4" /> No date filter
                </div>
              ) : null}
            </label>
          </div>
        </section>

        {loading ? <LoadingState message="Loading sales ledger..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-xl border border-[#c5c6cd] bg-white">
            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No sales rows" description="No sales records matched current filters." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-sm font-medium text-[#45474c]">
                      <th className="px-4 py-3">Invoice #</th>
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Sale Date</th>
                      <th className="px-4 py-3 text-right">Total Amount</th>
                      <th className="px-4 py-3">Payment Method</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => {
                      const initials = (row.customerName ?? "CU")
                        .split(" ")
                        .slice(0, 2)
                        .map((value) => value[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3 font-semibold">{row.invoiceNumber ?? row.id.slice(0, 8)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#1e293b] text-[11px] font-semibold text-white">
                                {initials || "CU"}
                              </span>
                              <span className="font-medium">{row.customerName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{toDateLabel(row.saleDate ?? row.createdAt)}</td>
                          <td className="px-4 py-3 text-right font-semibold">{toCurrency(toNumber(row.totalAmount))}</td>
                          <td className="px-4 py-3">{row.paymentMethod ?? "-"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChipClass(row.status)}`}>
                              {row.status ?? "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                title="View"
                                aria-label="View sale details"
                                onClick={() => setSelectedRow(row)}
                                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                title="Send invoice"
                                aria-label="Send invoice email"
                                onClick={() => void onSendInvoice(row.id)}
                                disabled={sendBusyId === row.id}
                                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-50"
                              >
                                <Send className="size-4" />
                              </button>
                              <button type="button" title="More" className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]">
                                <MoreVertical className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#c5c6cd] bg-white px-4 py-3 text-sm text-[#45474c]">
              <p>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-[#c5c6cd] px-2 py-1 disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-[#c5c6cd] px-2 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <Modal
        title="Sale Details"
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        maxWidthClassName="max-w-3xl"
        footer={(
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedRow(null)}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Close
            </button>
          </div>
        )}
      >
        {selectedRow ? (
          <div className="space-y-3 text-sm text-[#1b1b1d]">
            <p><span className="font-semibold">Invoice:</span> {selectedRow.invoiceNumber ?? selectedRow.id}</p>
            <p><span className="font-semibold">Customer:</span> {selectedRow.customerName ?? selectedRow.customerId ?? "-"}</p>
            <p><span className="font-semibold">Date:</span> {toDateLabel(selectedRow.saleDate ?? selectedRow.createdAt)}</p>
            <p><span className="font-semibold">Total:</span> {toCurrency(toNumber(selectedRow.totalAmount))}</p>
            <p><span className="font-semibold">Status:</span> {selectedRow.status ?? "Pending"}</p>

            <div>
              <p className="mb-2 font-semibold">Items</p>
              {selectedRow.items && selectedRow.items.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
                  <table className="w-full min-w-[560px]">
                    <thead>
                      <tr className="bg-[#f8fafc] text-left text-xs uppercase tracking-[0.08em] text-[#64748b]">
                        <th className="px-3 py-2">Part</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRow.items.map((item: SaleItemRow) => (
                        <tr key={item.id ?? item.partId} className="border-t border-[#e2e8f0] text-sm">
                          <td className="px-3 py-2">{item.partName ?? item.partNumber ?? item.partId ?? "-"}</td>
                          <td className="px-3 py-2 text-right">{toNumber(item.quantity)}</td>
                          <td className="px-3 py-2 text-right">{toCurrency(toNumber(item.unitPrice))}</td>
                          <td className="px-3 py-2 text-right">{toCurrency(toNumber(item.totalPrice))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[#64748b]">No line items returned by API.</p>
              )}
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        title="Create Sale"
        subtitle="Record a new transaction"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        maxWidthClassName="max-w-6xl"
        headerIcon={<Calculator className="size-5" />}
        footer={(
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
              disabled={createSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void onCreateSale()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              disabled={createSubmitting}
            >
              <Check className="size-4" />
              {createSubmitting ? "Creating..." : "Create Sale"}
            </button>
          </div>
        )}
      >
        <div className="space-y-5">
          {createError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
              {createError}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-sm font-medium text-[#1b1b1d]">Customer</span>
              <select
                value={createForm.customerId}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, customerId: event.target.value }))}
                className="h-11 w-full rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
              >
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.fullName}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium text-[#1b1b1d]">Payment Method</span>
              <select
                value={createForm.paymentMethod}
                onChange={(event) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    paymentMethod: event.target.value as SaleCreateForm["paymentMethod"],
                  }))
                }
                className="h-11 w-full rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Credit">Credit</option>
              </select>
            </label>
          </div>

          {createForm.paymentMethod === "Credit" ? (
            <div className="rounded-lg border border-[#bae6fd] bg-[#f0f9ff] px-3 py-2 text-xs text-[#0c4a6e]">
              Credit sales are supported. Due date is automatically set by backend to 30 days from sale date.
            </div>
          ) : null}

          <div className="overflow-hidden rounded-lg border border-[#dfe0e6] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="bg-[#f5f3f4] text-left text-xs font-semibold uppercase tracking-[0.06em] text-[#5e6068]">
                    <th className="px-4 py-3">Part / Service</th>
                    <th className="w-[120px] px-4 py-3">Qty</th>
                    <th className="w-[170px] px-4 py-3 text-right">Price</th>
                    <th className="w-[170px] px-4 py-3 text-right">Line Total</th>
                    <th className="w-[80px] px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {createForm.items.map((item, index) => {
                    const row = createDraftRows[index];
                    const hasStockIssue = row && row.stockQuantity > 0 && row.quantity > row.stockQuantity;
                    return (
                      <tr key={`${item.partId}-${index}`} className="border-t border-[#e5e7eb] align-top text-sm">
                        <td className="px-4 py-3">
                          <select
                            value={item.partId}
                            onChange={(event) => {
                              const partId = event.target.value;
                              setCreateForm((prev) => ({
                                ...prev,
                                items: prev.items.map((existingRow, rowIndex) =>
                                  rowIndex === index ? { ...existingRow, partId } : existingRow
                                ),
                              }));
                            }}
                            className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
                          >
                            <option value="">Select part</option>
                            {parts.map((part) => (
                              <option key={part.id} value={part.id}>
                                {part.partName ?? part.partNumber ?? part.id}
                              </option>
                            ))}
                          </select>
                          {hasStockIssue ? (
                            <p className="mt-1 text-xs text-[#b91c1c]">
                              Available stock: {row.stockQuantity}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) => {
                              const quantity = event.target.value;
                              setCreateForm((prev) => ({
                                ...prev,
                                items: prev.items.map((existingRow, rowIndex) =>
                                  rowIndex === index ? { ...existingRow, quantity } : existingRow
                                ),
                              }));
                            }}
                            className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-[#374151]">
                          {toCurrency(row?.unitPrice ?? 0)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-[#1f2937]">
                          {toCurrency(row?.lineTotal ?? 0)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setCreateForm((prev) => ({
                                ...prev,
                                items:
                                  prev.items.length <= 1
                                    ? prev.items
                                    : prev.items.filter((_, rowIndex) => rowIndex !== index),
                              }));
                            }}
                            aria-label="Remove line item"
                            className="rounded-md p-2 text-[#ef4444] hover:bg-[#fef2f2]"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[#e5e7eb] px-4 py-3">
              <button
                type="button"
                onClick={() =>
                  setCreateForm((prev) => ({
                    ...prev,
                    items: [...prev.items, { partId: "", quantity: "1" }],
                  }))
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[#c5c6cd] px-3 py-2 text-sm font-medium text-[#006a61]"
              >
                <Plus className="size-4" />
                Add Item
              </button>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
            <TextArea
              label="Notes"
              value={createForm.notes}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Optional notes for this transaction..."
              rows={6}
            />

            <aside className="rounded-xl border border-[#b7e1dc] bg-gradient-to-b from-[#f2fbfa] to-[#e6f5f3] p-4">
              <h3 className="mb-3 text-base font-semibold text-[#1b1b1d]">Order Summary</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-[#374151]">
                  <dt>Subtotal</dt>
                  <dd className="font-medium">{toCurrency(createSummary.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-[#0f766e]">
                  <dt>Loyalty Discount Applied</dt>
                  <dd className="font-medium">
                    {createSummary.loyaltyDiscount > 0 ? `- ${toCurrency(createSummary.loyaltyDiscount)}` : toCurrency(0)}
                  </dd>
                </div>
                <div className="rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-xs text-[#475569]">
                  Loyalty discount automatically applies at 10% for orders over {toCurrency(loyaltyThreshold)}.
                </div>
                <div className="mt-2 border-t border-[#9fd1ca] pt-2">
                  <div className="flex items-center justify-between text-base font-semibold text-[#1b1b1d]">
                    <span>Total Amount</span>
                    <span>{toCurrency(createSummary.totalAmount)}</span>
                  </div>
                </div>
                <p className="text-xs text-[#52606d]">
                  Backend calculates final discount and total. Additional manual discount is not supported by current sales API.
                </p>
              </dl>
            </aside>
          </div>
        </div>
      </Modal>
    </StaffShell>
  );
}
