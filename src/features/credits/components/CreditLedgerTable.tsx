"use client";

import { ArrowDown, ArrowUp, Eye, HandCoins, Mail, PenLine } from "lucide-react";

import { formatCurrency, formatDate } from "../shared/credit-api";
import type {
  CreditLedgerCapabilities,
  CreditLedgerRole,
  CreditLedgerRow,
  CreditLedgerSortKey,
  CreditLedgerSortState,
} from "../shared/credit.types";

type CreditLedgerTableProps = {
  rows: CreditLedgerRow[];
  role: CreditLedgerRole;
  capabilities: CreditLedgerCapabilities;
  sortState: CreditLedgerSortState;
  sendBusySaleId: string | null;
  onSort: (key: CreditLedgerSortKey) => void;
  onView: (row: CreditLedgerRow) => void;
  onSendInvoice: (row: CreditLedgerRow) => void;
  onRecordPayment: (row: CreditLedgerRow) => void;
  onUpdateStatus: (row: CreditLedgerRow) => void;
};

function statusClass(status: CreditLedgerRow["status"]): string {
  if (status === "Paid") return "bg-[#dcfce7] text-[#16a34a]";
  if (status === "Partially Paid") return "bg-[#dbeafe] text-[#2563eb]";
  if (status === "Overdue") return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#fef3c7] text-[#d97706]";
}

function daysOverdueClass(value: number): string {
  if (value > 60) return "bg-[#fee2e2] text-[#b91c1c]";
  if (value > 30) return "bg-[#ffedd5] text-[#c2410c]";
  if (value > 0) return "bg-[#fef3c7] text-[#92400e]";
  return "bg-[#dcfce7] text-[#166534]";
}

function SortButton({
  label,
  keyName,
  sortState,
  onSort,
  align = "left",
}: {
  label: string;
  keyName: CreditLedgerSortKey;
  sortState: CreditLedgerSortState;
  onSort: (key: CreditLedgerSortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortState.key === keyName;
  return (
    <button
      type="button"
      onClick={() => onSort(keyName)}
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-[0.08em] text-[#45474c] ${
        align === "right" ? "justify-end" : ""
      }`}
    >
      {label}
      {active ? sortState.direction === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : null}
    </button>
  );
}

export default function CreditLedgerTable({
  rows,
  role,
  capabilities,
  sortState,
  sendBusySaleId,
  onSort,
  onView,
  onSendInvoice,
  onRecordPayment,
  onUpdateStatus,
}: CreditLedgerTableProps) {
  const canEditCredits = role === "staff";
  const canSendInvoice = capabilities.hasCreditReminderApi;
  const canRecordPayment = canEditCredits && capabilities.hasCreditPaymentApi;
  const canUpdateStatus = canEditCredits && capabilities.hasCreditStatusApi;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1380px]">
        <thead>
          <tr className="bg-[#f5f3f4] text-left text-xs">
            <th className="px-4 py-3"><SortButton label="Customer" keyName="customerName" sortState={sortState} onSort={onSort} /></th>
            <th className="px-4 py-3"><SortButton label="Sale / Invoice ID" keyName="saleId" sortState={sortState} onSort={onSort} /></th>
            <th className="px-4 py-3"><SortButton label="Sale Date" keyName="saleDate" sortState={sortState} onSort={onSort} /></th>
            <th className="px-4 py-3"><SortButton label="Due Date" keyName="dueDate" sortState={sortState} onSort={onSort} /></th>
            <th className="px-4 py-3 text-right"><SortButton label="Total Credit Amount" keyName="totalCreditAmount" sortState={sortState} onSort={onSort} align="right" /></th>
            <th className="px-4 py-3 text-right"><SortButton label="Paid Amount" keyName="paidAmount" sortState={sortState} onSort={onSort} align="right" /></th>
            <th className="px-4 py-3 text-right"><SortButton label="Remaining Amount" keyName="remainingAmount" sortState={sortState} onSort={onSort} align="right" /></th>
            <th className="px-4 py-3 text-right"><SortButton label="Days Overdue" keyName="daysOverdue" sortState={sortState} onSort={onSort} align="right" /></th>
            <th className="px-4 py-3"><SortButton label="Status" keyName="status" sortState={sortState} onSort={onSort} /></th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rowId} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
              <td className="px-4 py-3">
                <p className="font-medium">{row.customerName}</p>
                <p className="text-xs text-[#4b5563]">{row.customerEmail}</p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{row.saleId}</p>
                <p className="text-xs text-[#4b5563]">{row.invoiceNumber || "-"}</p>
              </td>
              <td className="px-4 py-3">{formatDate(row.saleDate)}</td>
              <td className="px-4 py-3">{formatDate(row.dueDate)}</td>
              <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.totalCreditAmount)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(row.paidAmount)}</td>
              <td className="px-4 py-3 text-right">{formatCurrency(row.remainingAmount)}</td>
              <td className="px-4 py-3 text-right">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${daysOverdueClass(row.daysOverdue)}`}>
                  {row.daysOverdue}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    title="View details"
                    aria-label="View credit ledger details"
                    onClick={() => onView(row)}
                    className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                  >
                    <Eye className="size-4" />
                  </button>
                  <button
                    type="button"
                    title={canSendInvoice ? "Send credit reminder" : "Credit reminder API is not available."}
                    aria-label="Send credit reminder"
                    onClick={() => onSendInvoice(row)}
                    disabled={!canSendInvoice || sendBusySaleId === row.saleId}
                    className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Mail className="size-4" />
                  </button>
                  <button
                    type="button"
                    title={
                      canEditCredits
                        ? canRecordPayment
                          ? "Record payment"
                          : "Credit payment API is not available."
                        : "Only staff can update credit payments/status."
                    }
                    aria-label="Record credit payment"
                    onClick={() => onRecordPayment(row)}
                    disabled={canEditCredits && !canRecordPayment}
                    className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <HandCoins className="size-4" />
                  </button>
                  <button
                    type="button"
                    title={
                      canEditCredits
                        ? canUpdateStatus
                          ? "Update credit status"
                          : "Credit status API is not available."
                        : "Only staff can update credit payments/status."
                    }
                    aria-label="Update credit status"
                    onClick={() => onUpdateStatus(row)}
                    disabled={canEditCredits && !canUpdateStatus}
                    className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PenLine className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
