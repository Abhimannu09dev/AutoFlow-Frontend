"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useMemo, useState } from "react";
import { Download, Eye, Printer } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

import { SectionCard, StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, formatCurrency, toDateLabel, toNumber, unwrapArray } from "../shared/customer-api";
import type { PurchaseRow } from "../shared/customer.types";
import { useEffect } from "react";

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function shortSaleId(id: string): string {
  const compact = id.replaceAll("-", "");
  return compact.slice(0, 8).toLowerCase();
}

function resolveInvoiceNumber(row: PurchaseRow): string {
  const source = row as Record<string, unknown>;
  const candidates = [
    row.invoiceNumber,
    row.invoiceNo,
    row.invoice,
    row.number,
    asString(source.InvoiceNumber),
    asString(source.InvoiceNo),
    asString(source.Invoice),
    asString(source.Number),
  ];

  const invoice = candidates.map((value) => asString(value)).find(Boolean);
  if (invoice) return invoice;

  const rawId = asString(row.id) || asString(source.Id);
  return rawId ? `#${shortSaleId(rawId)}` : "#unknown";
}

function normalizePurchaseRow(row: PurchaseRow): PurchaseRow {
  const source = row as Record<string, unknown>;
  const id = asString(row.id) || asString(source.Id);
  const normalizedInvoice = resolveInvoiceNumber({ ...row, id });

  return {
    ...row,
    id,
    invoiceNumber: normalizedInvoice,
  };
}

export default function CustomerPurchasesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selected, setSelected] = useState<PurchaseRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiRequest<unknown>("/api/customer/purchases");
    if (response.error) {
      setError(response.error);
    }

    const normalizedRows = unwrapArray<PurchaseRow>(response.data)
      .map(normalizePurchaseRow)
      .filter((row) => Boolean(row.id));

    setRows(normalizedRows);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const byPayment = paymentMethod === "all" || String(row.paymentMethod ?? "").toLowerCase() === paymentMethod;
      const byStatus = status === "all" || String(row.status ?? "").toLowerCase() === status;

      const date = row.saleDate ? new Date(row.saleDate) : null;
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      const byFrom = !from || (date && date >= from);
      const byTo = !to || (date && date <= to);

      return byPayment && byStatus && byFrom && byTo;
    });
  }, [rows, paymentMethod, status, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const totalSpent = filteredRows.reduce((sum, row) => sum + toNumber(row.totalAmount, 0), 0);
    const latest = [...filteredRows].sort((a, b) => new Date(b.saleDate ?? "").getTime() - new Date(a.saleDate ?? "").getTime())[0];

    const pendingCredit = filteredRows
      .filter((row) => String(row.paymentMethod ?? "").toLowerCase().includes("credit"))
      .filter((row) => !String(row.status ?? "").toLowerCase().includes("paid"))
      .reduce((sum, row) => sum + toNumber(row.totalAmount, 0), 0);

    return {
      totalPurchases: filteredRows.length,
      totalSpent,
      latest,
      pendingCredit,
    };
  }, [filteredRows]);

  const downloadInvoice = (row: PurchaseRow) => {
    const invoiceNumber = resolveInvoiceNumber(row);
    const lines = [
      `Invoice Number,${invoiceNumber}`,
      `Sale Date,${toDateLabel(row.saleDate)}`,
      `Payment Method,${row.paymentMethod ?? "-"}`,
      `Status,${row.status ?? "-"}`,
      `Sub Total,${toNumber(row.subTotal, 0).toFixed(2)}`,
      `Discount,${toNumber(row.discountAmount, 0).toFixed(2)}`,
      `Total Amount,${toNumber(row.totalAmount, 0).toFixed(2)}`,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoiceNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = (row: PurchaseRow) => {
    const invoiceNumber = resolveInvoiceNumber(row);
    const popup = window.open("", "_blank", "width=900,height=700");
    if (!popup) return;

    popup.document.write(`
      <html><head><title>Invoice ${invoiceNumber}</title></head>
      <body style="font-family:Arial,sans-serif;padding:24px;">
        <h1>AutoFlow Invoice</h1>
        <p><strong>Invoice:</strong> ${invoiceNumber}</p>
        <p><strong>Date:</strong> ${toDateLabel(row.saleDate)}</p>
        <p><strong>Payment Method:</strong> ${row.paymentMethod ?? "-"}</p>
        <p><strong>Status:</strong> ${row.status ?? "-"}</p>
        <p><strong>Total:</strong> ${formatCurrency(row.totalAmount)}</p>
      </body></html>
    `);
    popup.document.close();
    popup.focus();
    popup.print();
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader title="Purchase History" subtitle="Manage and track your purchase history and invoice records." />

      {loading ? <LoadingState message="Loading purchases..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatMiniCard label="Total Purchases" value={String(stats.totalPurchases)} />
            <StatMiniCard label="Total Spent" value={formatCurrency(stats.totalSpent)} />
            <StatMiniCard label="Latest Purchase" value={stats.latest ? toDateLabel(stats.latest.saleDate) : "-"} />
            <StatMiniCard label="Pending Credit Amount" value={formatCurrency(stats.pendingCredit)} accent="text-[#92400e]" />
          </div>

          <SectionCard title="Invoices" subtitle="Filter by payment method, status, and date.">
            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
                <option value="all">All Methods</option>
                <option value="cash">Cash</option>
                <option value="creditcard">Credit Card</option>
                <option value="banktransfer">Bank Transfer</option>
                <option value="credit">Credit</option>
              </select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm" />
            </div>

            {filteredRows.length === 0 ? (
              <EmptyState title="No purchases found" description="No purchases match your current filters." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Invoice Number</th>
                      <th className="px-4 py-3 font-semibold">Sale Date</th>
                      <th className="px-4 py-3 font-semibold">Total Amount</th>
                      <th className="px-4 py-3 font-semibold">Payment Method</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Invoice Sent</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3 text-[#091426]">{resolveInvoiceNumber(row)}</td>
                        <td className="px-4 py-3 text-[#091426]">{toDateLabel(row.saleDate)}</td>
                        <td className="px-4 py-3 text-[#091426]">{formatCurrency(row.totalAmount)}</td>
                        <td className="px-4 py-3 text-[#091426]">{row.paymentMethod ?? "-"}</td>
                        <td className="px-4 py-3"><StatusPill label={row.status ?? "Pending"} /></td>
                        <td className="px-4 py-3 text-[#091426]">{row.invoiceSentAt ? "Yes" : "No"}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setSelected(row); setViewOpen(true); }} className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]" aria-label="View invoice"><Eye className="size-4" /></button>
                            <button type="button" onClick={() => downloadInvoice(row)} className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]" aria-label="Download invoice"><Download className="size-4" /></button>
                            <button type="button" onClick={() => printInvoice(row)} className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]" aria-label="Print invoice"><Printer className="size-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}

      <FormDialog
        title="Invoice Detail"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onSubmit={() => setViewOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-2xl"
      >
        {selected ? (
          <div className="space-y-3 text-sm text-[#334155]">
            <div className="grid gap-2 md:grid-cols-2">
              <p><span className="font-semibold text-[#091426]">Invoice Number:</span> {resolveInvoiceNumber(selected)}</p>
              <p><span className="font-semibold text-[#091426]">Sale Date:</span> {toDateLabel(selected.saleDate)}</p>
              <p><span className="font-semibold text-[#091426]">Payment Method:</span> {selected.paymentMethod ?? "-"}</p>
              <p><span className="font-semibold text-[#091426]">Status:</span> {selected.status ?? "-"}</p>
              <p><span className="font-semibold text-[#091426]">Discount:</span> {formatCurrency(selected.discountAmount)}</p>
              <p><span className="font-semibold text-[#091426]">Total:</span> {formatCurrency(selected.totalAmount)}</p>
            </div>
            <p><span className="font-semibold text-[#091426]">Notes:</span> {selected.notes ?? "-"}</p>
          </div>
        ) : null}
      </FormDialog>
    </CustomerShell>
  );
}
