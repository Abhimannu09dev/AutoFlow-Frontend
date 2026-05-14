"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Download, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  EmptyState,
  ErrorState,
  FormDialog,
  LoadingState,
  Modal,
  SearchInput,
} from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/admin-api";
import type { PartItem, PurchaseInvoice, Vendor } from "../shared/admin.types";

type InvoiceItemForm = {
  partId: string;
  quantity: string;
  unitCost: string;
};

type InvoiceFormState = {
  vendorId: string;
  notes: string;
  items: InvoiceItemForm[];
};

const defaultItem: InvoiceItemForm = {
  partId: "",
  quantity: "",
  unitCost: "",
};

const defaultForm: InvoiceFormState = {
  vendorId: "",
  notes: "",
  items: [{ ...defaultItem }],
};

function formatStatus(status: string | undefined): string {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function normalizeStatus(status: string | undefined): string {
  return (status ?? "pending").trim().toLowerCase();
}

function isOutstandingStatus(status: string | undefined): boolean {
  const normalized = normalizeStatus(status);
  return ["pending", "draft", "unpaid", "overdue"].includes(normalized);
}

function isSettledStatus(status: string | undefined): boolean {
  const normalized = normalizeStatus(status);
  return ["paid", "received", "completed"].includes(normalized);
}

function escapeCsvValue(value: unknown): string {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

export default function AdminPurchaseInvoiceManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<PurchaseInvoice[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<InvoiceFormState>(defaultForm);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [invoiceResult, vendorResult, partResult] = await Promise.all([
      apiRequest<PurchaseInvoice[]>("/api/purchase-invoices"),
      apiRequest<Vendor[]>("/api/vendors"),
      apiRequest<PartItem[]>("/api/parts"),
    ]);

    if (invoiceResult.error) {
      setError(invoiceResult.error);
      setRows([]);
    } else {
      setRows(unwrapArray<PurchaseInvoice>(invoiceResult.data));
    }

    setVendors(unwrapArray<Vendor>(vendorResult.data));
    setParts(unwrapArray<PartItem>(partResult.data));

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const availableStatuses = useMemo(() => {
    const unique = new Set(rows.map((row) => (row.status ?? "Pending").toLowerCase()));
    return ["all", ...Array.from(unique)];
  }, [rows]);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();
    return rows.filter((row) => {
      const statusText = (row.status ?? "Pending").toLowerCase();
      const invoiceDate = row.invoiceDate?.slice(0, 10) ?? "";

      const matchesSearch =
        (row.vendorName ?? "").toLowerCase().includes(lowered) ||
        (row.notes ?? "").toLowerCase().includes(lowered) ||
        statusText.includes(lowered) ||
        row.id.toLowerCase().includes(lowered);

      const matchesStatus = statusFilter === "all" || statusText === statusFilter;
      const matchesVendor = vendorFilter === "all" || row.vendorId === vendorFilter;
      const matchesDate = !dateFilter || invoiceDate === dateFilter;

      return matchesSearch && matchesStatus && matchesVendor && matchesDate;
    });
  }, [rows, search, statusFilter, vendorFilter, dateFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let outstanding = 0;
    let pending = 0;
    let paidThisMonth = 0;

    filtered.forEach((row) => {
      const total = toNumber(row.totalAmount);
      const status = row.status;

      if (isOutstandingStatus(status)) {
        outstanding += total;
      }

      if (["pending", "draft", "unpaid"].includes(normalizeStatus(status))) {
        pending += 1;
      }

      if (isSettledStatus(status)) {
        const invoiceDate = row.invoiceDate ? new Date(row.invoiceDate) : null;
        if (
          invoiceDate &&
          !Number.isNaN(invoiceDate.getTime()) &&
          invoiceDate.getFullYear() === currentYear &&
          invoiceDate.getMonth() === currentMonth
        ) {
          paidThisMonth += total;
        }
      }
    });

    return { outstanding, pending, paidThisMonth };
  }, [filtered]);

  const hasActiveFilters = Boolean(
    search.trim() || statusFilter !== "all" || vendorFilter !== "all" || dateFilter
  );
  const canExport = filtered.length > 0;

  const exportInvoices = () => {
    if (!canExport) return;

    const headers = [
      "Invoice ID",
      "Vendor Name",
      "Invoice Date",
      "Status",
      "Notes",
      "Total Amount",
      "Item Count",
    ];
    const lines = [headers.join(",")];

    filtered.forEach((invoice) => {
      lines.push(
        [
          escapeCsvValue(invoice.id),
          escapeCsvValue(invoice.vendorName ?? invoice.vendorId ?? "-"),
          escapeCsvValue(toDateLabel(invoice.invoiceDate)),
          escapeCsvValue(formatStatus(invoice.status)),
          escapeCsvValue(invoice.notes ?? ""),
          escapeCsvValue(toNumber(invoice.totalAmount).toFixed(2)),
          escapeCsvValue((invoice.items ?? []).length),
        ].join(",")
      );
    });

    const csvContent = lines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const objectUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    const today = new Date().toISOString().slice(0, 10);
    anchor.download = hasActiveFilters
      ? `purchase-invoices-filtered-${today}.csv`
      : "purchase-invoices.csv";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { ...defaultItem }] }));
  };

  const removeItem = (index: number) => {
    setForm((prev) => {
      if (prev.items.length <= 1) return prev;
      return {
        ...prev,
        items: prev.items.filter((_, rowIndex) => rowIndex !== index),
      };
    });
  };

  const updateItem = (index: number, patch: Partial<InvoiceItemForm>) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, rowIndex) => (rowIndex === index ? { ...item, ...patch } : item)),
    }));
  };

  const validate = (): string | null => {
    if (!form.vendorId) return "Vendor is required.";
    if (form.items.length === 0) return "At least one invoice item is required.";

    for (let i = 0; i < form.items.length; i += 1) {
      const item = form.items[i];
      if (!item.partId) return `Item ${i + 1}: Part is required.`;
      const quantity = Number(item.quantity);
      const unitCost = Number(item.unitCost);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        return `Item ${i + 1}: Quantity must be greater than 0.`;
      }
      if (!Number.isFinite(unitCost) || unitCost <= 0) {
        return `Item ${i + 1}: Unit Cost must be greater than 0.`;
      }
    }

    return null;
  };

  const onCreate = async () => {
    const validationError = validate();
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    const result = await apiRequest<PurchaseInvoice>("/api/purchase-invoices", {
      method: "POST",
      body: JSON.stringify({
        vendorId: form.vendorId,
        notes: form.notes.trim() || null,
        items: form.items.map((item) => ({
          partId: item.partId,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
        })),
      }),
    });
    setIsSubmitting(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setForm(defaultForm);
    setIsModalOpen(false);
    await load();
  };

  const openDetails = async (invoice: PurchaseInvoice) => {
    setSelectedInvoice(invoice);
    setViewError(null);
    setIsViewLoading(true);

    const result = await apiRequest<PurchaseInvoice>(`/api/purchase-invoices/${invoice.id}`);
    setIsViewLoading(false);

    if (result.error) {
      setSelectedInvoice(invoice);
      setViewError(result.error);
      return;
    }

    setSelectedInvoice(unwrapData<PurchaseInvoice>(result.data, invoice));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Purchase Invoices</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage and track vendor payments and bills.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setForm(defaultForm);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0d9488] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Create Purchase Invoice
          </button>
        </header>

        {loading ? <LoadingState message="Loading invoices..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Total Outstanding</p>
                <p className="mt-2 text-5xl font-semibold tracking-[-0.04em] text-[#1b1b1d]">
                  ${stats.outstanding.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </article>
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Pending Invoices</p>
                <p className="mt-2 text-5xl font-semibold tracking-[-0.04em] text-[#1b1b1d]">{stats.pending}</p>
              </article>
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Paid This Month</p>
                <p className="mt-2 text-5xl font-semibold tracking-[-0.04em] text-[#1b1b1d]">
                  ${stats.paidThisMonth.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </article>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] px-4 py-3">
                <SearchInput value={search} onChange={setSearch} placeholder="Search invoices..." />
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="h-10 rounded-lg border border-[#1e293b] px-3 text-sm text-[#1e293b]"
                  >
                    {availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status === "all" ? "All Status" : formatStatus(status)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={vendorFilter}
                    onChange={(event) => setVendorFilter(event.target.value)}
                    className="h-10 rounded-lg border border-[#1e293b] px-3 text-sm text-[#1e293b]"
                  >
                    <option value="all">All Vendors</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.vendorName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(event) => setDateFilter(event.target.value)}
                    className="h-10 rounded-lg border border-[#1e293b] px-3 text-sm text-[#1e293b]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setVendorFilter("all");
                      setDateFilter("");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] px-3 py-2 text-sm font-medium text-[#1e293b]"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={exportInvoices}
                    disabled={!canExport}
                    title={!canExport ? "No visible rows to export" : "Export visible invoices"}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#1e293b] px-3 py-2 text-sm font-medium text-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="size-4" />
                    Export
                  </button>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No invoices" description="No invoices matched your filters." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[940px]">
                    <thead>
                      <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                        <th className="px-4 py-3">Vendor Name</th>
                        <th className="px-4 py-3">Invoice Date</th>
                        <th className="px-4 py-3 text-right">Total Amount</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row) => (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3">
                            <p className="font-medium">{row.vendorName ?? row.vendorId}</p>
                            <p className="text-xs text-[#6b7280]">{row.id}</p>
                          </td>
                          <td className="px-4 py-3">{toDateLabel(row.invoiceDate)}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            ${toNumber(row.totalAmount).toFixed(2)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                (row.status ?? "").toLowerCase() === "paid"
                                  ? "bg-[#f0edef] text-[#1e293b]"
                                  : (row.status ?? "").toLowerCase() === "overdue"
                                    ? "bg-[#fee2e2] text-[#ef4444]"
                                    : "bg-[#fef3c7] text-[#f59e0b]"
                              }`}
                            >
                              {formatStatus(row.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => void openDetails(row)}
                              className="text-sm font-medium text-[#0d9488]"
                            >
                              View Details
                            </button>
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

      <FormDialog
        title="Create Purchase Invoice"
        description="Select a vendor and add one or more part rows with quantity and unit cost."
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(null);
        }}
        onSubmit={onCreate}
        submitLabel="Create"
        isSubmitting={isSubmitting}
        errorMessage={modalError}
      >
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm text-[#45474c] sm:col-span-2">
              Vendor *
              <select
                value={form.vendorId}
                onChange={(event) => setForm((prev) => ({ ...prev, vendorId: event.target.value }))}
                className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[#45474c] sm:col-span-2">
              Notes
              <textarea
                value={form.notes}
                onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                className="mt-1 min-h-20 w-full rounded-lg border border-[#c5c6cd] px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="rounded-xl border border-[#c5c6cd] bg-white p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1b1b1d]">Invoice Items</h3>
              <button
                type="button"
                onClick={addItem}
                className="rounded-lg border border-[#0d9488] px-3 py-1 text-xs font-medium text-[#0d9488]"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {form.items.map((item, index) => (
                <div
                  key={`${index}-${item.partId}`}
                  className="grid gap-2 rounded-lg border border-[#e2e8f0] p-3 sm:grid-cols-[1.2fr_0.6fr_0.6fr_auto]"
                >
                  <label className="text-xs text-[#45474c]">
                    Part *
                    <select
                      value={item.partId}
                      onChange={(event) => updateItem(index, { partId: event.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
                    >
                      <option value="">Select part</option>
                      {parts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.partName} ({part.partNumber ?? "-"})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="text-xs text-[#45474c]">
                    Quantity *
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(event) => updateItem(index, { quantity: event.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
                    />
                  </label>
                  <label className="text-xs text-[#45474c]">
                    Unit Cost *
                    <input
                      type="number"
                      value={item.unitCost}
                      onChange={(event) => updateItem(index, { unitCost: event.target.value })}
                      className="mt-1 h-10 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
                    />
                  </label>
                  <div className="self-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#fecaca] text-[#b91c1c] disabled:opacity-40"
                      disabled={form.items.length === 1}
                      aria-label="Remove item row"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormDialog>

      <Modal
        title="Purchase Invoice Details"
        open={Boolean(selectedInvoice)}
        onClose={() => {
          setSelectedInvoice(null);
          setViewError(null);
          setIsViewLoading(false);
        }}
        maxWidthClassName="max-w-3xl"
        footer={(
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setSelectedInvoice(null);
                setViewError(null);
                setIsViewLoading(false);
              }}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Close
            </button>
          </div>
        )}
      >
        {selectedInvoice ? (
          <div className="space-y-4 text-sm text-[#1b1b1d]">
            {viewError ? (
              <div className="rounded-lg border border-[#fed7aa] bg-[#fff7ed] px-3 py-2 text-[#9a3412]">
                {viewError}
              </div>
            ) : null}
            {isViewLoading ? (
              <div className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-[#45474c]">
                Loading invoice details...
              </div>
            ) : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Vendor</p>
                <p className="mt-1 font-medium">{selectedInvoice.vendorName ?? selectedInvoice.vendorId}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Invoice Date</p>
                <p className="mt-1">{toDateLabel(selectedInvoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Status</p>
                <p className="mt-1">{formatStatus(selectedInvoice.status)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Total Amount</p>
                <p className="mt-1 font-medium">${toNumber(selectedInvoice.totalAmount).toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Notes</p>
              <p className="mt-1">{selectedInvoice.notes ?? "-"}</p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                    <th className="px-3 py-2">Part</th>
                    <th className="px-3 py-2 text-right">Quantity</th>
                    <th className="px-3 py-2 text-right">Unit Cost</th>
                    <th className="px-3 py-2 text-right">SubTotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedInvoice.items ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-sm text-[#6b7280]">
                        No invoice items available.
                      </td>
                    </tr>
                  ) : (
                    (selectedInvoice.items ?? []).map((item) => (
                      <tr key={item.id ?? `${item.partId}-${item.quantity}-${item.unitCost}`} className="border-t border-[#e2e8f0]">
                        <td className="px-3 py-2">{item.partName ?? item.partId}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">${toNumber(item.unitCost).toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${toNumber(item.subTotal ?? item.quantity * item.unitCost).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminLayout>
  );
}
