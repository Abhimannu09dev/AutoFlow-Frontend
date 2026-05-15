"use client";

import { EmptyState, ErrorState, LoadingState } from "@/shared/components/ui";
import Modal from "@/shared/components/ui/Modal";

import { formatCurrency, formatDate } from "../shared/credit-api";
import type { CreditDetail, CreditLedgerRow } from "../shared/credit.types";

type CreditDetailModalProps = {
  row: CreditLedgerRow | null;
  detail: CreditDetail | null;
  loading: boolean;
  error: string | null;
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
};

function getStatusPill(status: string): string {
  const lowered = status.toLowerCase();
  if (lowered.includes("paid") && !lowered.includes("partial")) return "bg-[#dcfce7] text-[#16a34a]";
  if (lowered.includes("partial")) return "bg-[#dbeafe] text-[#2563eb]";
  if (lowered.includes("overdue")) return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#fef3c7] text-[#d97706]";
}

export default function CreditDetailModal({ row, detail, loading, error, open, onClose, onRetry }: CreditDetailModalProps) {
  const fallback = row;

  const paymentHistory = detail?.paymentHistory ?? [];

  return (
    <Modal
      title="Credit Sale Details"
      subtitle="Review customer credit balance and payment history."
      open={open}
      onClose={onClose}
      maxWidthClassName="max-w-4xl"
      footer={(
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
          >
            Close
          </button>
        </div>
      )}
    >
      {loading ? <LoadingState message="Loading credit details..." /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={onRetry} /> : null}

      {!loading && !error && !detail && !fallback ? (
        <EmptyState title="No credit details available" description="Unable to load sale details." />
      ) : null}

      {!loading && !error && (detail || fallback) ? (
        <div className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2">
            <p><span className="font-semibold">Customer:</span> {detail?.customerName ?? fallback?.customerName ?? "-"}</p>
            <p><span className="font-semibold">Email:</span> {detail?.customerEmail ?? fallback?.customerEmail ?? "-"}</p>
            <p><span className="font-semibold">Phone:</span> {detail?.customerPhone ?? fallback?.customerPhone ?? "-"}</p>
            <p><span className="font-semibold">Customer ID:</span> {detail?.customerId ?? fallback?.customerId ?? "-"}</p>
            <p><span className="font-semibold">Sale ID:</span> {detail?.saleId ?? fallback?.saleId ?? "-"}</p>
            <p><span className="font-semibold">Invoice #:</span> {detail?.invoiceNumber ?? fallback?.invoiceNumber ?? "-"}</p>
            <p><span className="font-semibold">Sale Date:</span> {formatDate(detail?.saleDate ?? fallback?.saleDate)}</p>
            <p><span className="font-semibold">Due Date:</span> {formatDate(detail?.dueDate ?? fallback?.dueDate)}</p>
            <p><span className="font-semibold">Total Credit:</span> {formatCurrency(detail?.totalCreditAmount ?? fallback?.totalCreditAmount ?? 0)}</p>
            <p><span className="font-semibold">Paid:</span> {formatCurrency(detail?.paidAmount ?? fallback?.paidAmount ?? 0)}</p>
            <p><span className="font-semibold">Remaining:</span> {formatCurrency(detail?.remainingAmount ?? fallback?.remainingAmount ?? 0)}</p>
            <p><span className="font-semibold">Days Overdue:</span> {detail?.daysOverdue ?? fallback?.daysOverdue ?? 0}</p>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusPill(detail?.status ?? fallback?.status ?? "Pending")}`}>
                {detail?.status ?? fallback?.status ?? "Pending"}
              </span>
            </p>
          </div>

          <section className="space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[#45474c]">Payment History</h3>
            {paymentHistory.length === 0 ? (
              <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-sm text-[#475569]">
                No payments recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#e2e8f0]">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-[#f8fafc] text-left text-xs uppercase tracking-[0.08em] text-[#475569]">
                    <tr>
                      <th className="px-3 py-2">Payment ID</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Method</th>
                      <th className="px-3 py-2">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((item) => (
                      <tr key={item.paymentId} className="border-t border-[#e2e8f0]">
                        <td className="px-3 py-2 font-medium">{item.paymentId}</td>
                        <td className="px-3 py-2">{formatCurrency(item.amount)}</td>
                        <td className="px-3 py-2">{formatDate(item.paymentDate)}</td>
                        <td className="px-3 py-2">{item.paymentMethod}</td>
                        <td className="px-3 py-2">{item.note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </Modal>
  );
}
