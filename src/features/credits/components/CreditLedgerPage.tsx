"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Download, FileText, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState, ErrorState, LoadingState } from "@/shared/components/ui";

import CreditDetailModal from "./CreditDetailModal";
import CreditLedgerFilters from "./CreditLedgerFilters";
import CreditLedgerStats from "./CreditLedgerStats";
import CreditLedgerTable from "./CreditLedgerTable";
import CreditPaymentModal from "./CreditPaymentModal";
import CreditStatusModal from "./CreditStatusModal";
import {
  exportCreditCsv,
  exportCreditPrintable,
  fetchCreditDetail,
  fetchCreditLedgerRows,
  formatCurrency,
  getCreditLedgerCapabilities,
  sendCreditReminder,
} from "../shared/credit-api";
import type {
  CreditDetail,
  CreditLedgerFilters as CreditLedgerFiltersShape,
  CreditLedgerRole,
  CreditLedgerRow,
  CreditLedgerSortKey,
  CreditLedgerSortState,
} from "../shared/credit.types";

const defaultFilters: CreditLedgerFiltersShape = {
  search: "",
  status: "all",
  saleDateFrom: "",
  saleDateTo: "",
  dueDateFrom: "",
  dueDateTo: "",
  overdueOnly: false,
  outstandingOnly: false,
};

type CreditLedgerPageProps = {
  role: CreditLedgerRole;
};

function compareStrings(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: "base" });
}

function compareNumbers(a: number, b: number): number {
  return a - b;
}

function compareDates(a?: string, b?: string): number {
  const aTs = a ? new Date(a).getTime() : 0;
  const bTs = b ? new Date(b).getTime() : 0;
  return aTs - bTs;
}

function inDateRange(value: string | undefined, from: string, to: string): boolean {
  if (!from && !to) return true;
  if (!value) return false;
  const target = new Date(value);
  if (Number.isNaN(target.getTime())) return false;

  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime()) && target < fromDate) return false;
  }

  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      toDate.setHours(23, 59, 59, 999);
      if (target > toDate) return false;
    }
  }
  return true;
}

export default function CreditLedgerPage({ role }: CreditLedgerPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CreditLedgerRow[]>([]);

  const [filters, setFilters] = useState<CreditLedgerFiltersShape>(defaultFilters);
  const [sortState, setSortState] = useState<CreditLedgerSortState>({
    key: "daysOverdue",
    direction: "desc",
  });

  const [selectedRow, setSelectedRow] = useState<CreditLedgerRow | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<CreditDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [sendBusySaleId, setSendBusySaleId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const capabilities = useMemo(() => getCreditLedgerCapabilities(), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchCreditLedgerRows();
    setRows(result.rows);
    setError(result.error);
    setLoading(false);
  }, []);

  const refreshSelectedDetail = useCallback(async (saleId: string) => {
    setDetailLoading(true);
    setDetailError(null);
    const result = await fetchCreditDetail(saleId);
    setSelectedDetail(result.detail);
    setDetailError(result.error);
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!selectedRow?.saleId) {
      setSelectedDetail(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }

    void refreshSelectedDetail(selectedRow.saleId);
  }, [refreshSelectedDetail, selectedRow?.saleId]);

  const filteredRows = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const next = rows.filter((row) => {
      const statusLower = row.status.toLowerCase();
      const matchesSearch =
        !q ||
        row.customerName.toLowerCase().includes(q) ||
        row.customerEmail.toLowerCase().includes(q) ||
        row.customerPhone.toLowerCase().includes(q) ||
        row.saleId.toLowerCase().includes(q) ||
        row.invoiceNumber.toLowerCase().includes(q);

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "pending" && statusLower === "pending") ||
        (filters.status === "partially-paid" && statusLower === "partially paid") ||
        (filters.status === "paid" && (statusLower === "paid" || statusLower === "cleared")) ||
        (filters.status === "overdue" && statusLower === "overdue");

      const matchesSaleDate = inDateRange(row.saleDate, filters.saleDateFrom, filters.saleDateTo);
      const matchesDueDate = inDateRange(row.dueDate, filters.dueDateFrom, filters.dueDateTo);
      const matchesOverdueOnly = !filters.overdueOnly || row.daysOverdue > 0 || row.status === "Overdue";
      const matchesOutstandingOnly = !filters.outstandingOnly || row.remainingAmount > 0;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSaleDate &&
        matchesDueDate &&
        matchesOverdueOnly &&
        matchesOutstandingOnly
      );
    });

    next.sort((a, b) => {
      const compared = (() => {
        switch (sortState.key) {
          case "customerName":
            return compareStrings(a.customerName, b.customerName);
          case "saleId":
            return compareStrings(a.saleId, b.saleId);
          case "saleDate":
            return compareDates(a.saleDate, b.saleDate);
          case "dueDate":
            return compareDates(a.dueDate, b.dueDate);
          case "totalCreditAmount":
            return compareNumbers(a.totalCreditAmount, b.totalCreditAmount);
          case "paidAmount":
            return compareNumbers(a.paidAmount, b.paidAmount);
          case "remainingAmount":
            return compareNumbers(a.remainingAmount, b.remainingAmount);
          case "daysOverdue":
            return compareNumbers(a.daysOverdue, b.daysOverdue);
          case "status":
            return compareStrings(a.status, b.status);
          default:
            return 0;
        }
      })();

      return sortState.direction === "asc" ? compared : compared * -1;
    });

    return next;
  }, [filters, rows, sortState.direction, sortState.key]);

  const stats = useMemo(() => {
    const totalCreditAmount = filteredRows.reduce((acc, row) => acc + row.totalCreditAmount, 0);
    const totalPaidAmount = filteredRows.reduce((acc, row) => acc + row.paidAmount, 0);
    const totalRemainingAmount = filteredRows.reduce((acc, row) => acc + row.remainingAmount, 0);

    return {
      totalCreditAmount,
      totalPaidAmount,
      totalRemainingAmount,
      overdueCredits: filteredRows.filter((row) => row.remainingAmount > 0 && row.daysOverdue > 0).length,
      pendingCredits: filteredRows.filter((row) => row.remainingAmount > 0 && row.paidAmount <= 0 && row.daysOverdue <= 0).length,
      partiallyPaidCredits: filteredRows.filter((row) => row.paidAmount > 0 && row.remainingAmount > 0).length,
    };
  }, [filteredRows]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.search.trim().length > 0) parts.push(`search=\"${filters.search.trim()}\"`);
    if (filters.status !== "all") parts.push(`status=${filters.status}`);
    if (filters.saleDateFrom || filters.saleDateTo) parts.push(`sale=${filters.saleDateFrom || "any"}..${filters.saleDateTo || "any"}`);
    if (filters.dueDateFrom || filters.dueDateTo) parts.push(`due=${filters.dueDateFrom || "any"}..${filters.dueDateTo || "any"}`);
    if (filters.overdueOnly) parts.push("overdueOnly=true");
    if (filters.outstandingOnly) parts.push("outstandingOnly=true");
    parts.push(`visibleRows=${filteredRows.length}`);
    return parts.join(", ");
  }, [filteredRows.length, filters]);

  const hasActiveFilters = useMemo(
    () =>
      filters.search.trim().length > 0 ||
      filters.status !== "all" ||
      Boolean(filters.saleDateFrom || filters.saleDateTo || filters.dueDateFrom || filters.dueDateTo) ||
      filters.overdueOnly ||
      filters.outstandingOnly,
    [filters]
  );

  const onSort = (key: CreditLedgerSortKey) => {
    setSortState((prev) => ({
      key,
      direction: prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "desc",
    }));
  };

  const onExportCsv = () => {
    if (filteredRows.length === 0) return;
    const suffix = filters.status === "all" ? "" : `-${filters.status}`;
    exportCreditCsv(`autoflow-credit-ledger${suffix}.csv`, filteredRows);
  };

  const onExportPdf = () => {
    if (filteredRows.length === 0) return;
    exportCreditPrintable(filteredRows, {
      filterSummary,
      generatedAt: new Date().toLocaleString(),
      totals: {
        totalCreditAmount: stats.totalCreditAmount,
        totalPaidAmount: stats.totalPaidAmount,
        totalRemainingAmount: stats.totalRemainingAmount,
      },
    });
  };

  const onSendReminder = async (row: CreditLedgerRow) => {
    setSendBusySaleId(row.saleId);
    const result = await sendCreditReminder(row.saleId);
    setSendBusySaleId(null);
    setActionMessage(result.message || (result.success ? "Credit reminder request completed." : "Failed to send credit reminder."));
    if (result.success) {
      await load();
      if (selectedRow?.saleId === row.saleId) {
        await refreshSelectedDetail(row.saleId);
      }
    }
  };

  const onRecordPayment = (row: CreditLedgerRow) => {
    if (role !== "staff") {
      setActionMessage("Only staff can update credit payments/status.");
      return;
    }
    if (!capabilities.hasCreditPaymentApi) {
      setActionMessage("Credit payment API is not available.");
      return;
    }

    setSelectedRow(row);
    setPaymentModalOpen(true);
  };

  const onUpdateStatus = (row: CreditLedgerRow) => {
    if (role !== "staff") {
      setActionMessage("Only staff can update credit payments/status.");
      return;
    }
    if (!capabilities.hasCreditStatusApi) {
      setActionMessage("Credit status API is not available.");
      return;
    }

    setSelectedRow(row);
    setStatusModalOpen(true);
  };

  const handleMutationSuccess = async (message: string) => {
    setActionMessage(message);
    await load();
    if (selectedRow?.saleId) {
      await refreshSelectedDetail(selectedRow.saleId);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Credit Ledger</h1>
          <p className="mt-1 max-w-2xl text-sm text-[#4b5563]">
            Track pending credit sales, overdue balances, and customer payment status.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onExportCsv}
            disabled={filteredRows.length === 0 || loading || Boolean(error)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#111827] bg-white px-4 py-2 text-sm font-medium text-[#111827] disabled:opacity-50"
          >
            <Download className="size-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={onExportPdf}
            disabled={filteredRows.length === 0 || loading || Boolean(error)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            <FileText className="size-4" />
            Export PDF / Print
          </button>
          <button
            type="button"
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#c5c6cd] bg-white px-4 py-2 text-sm font-medium text-[#111827]"
          >
            <RefreshCcw className="size-4" />
            Refresh
          </button>
        </div>
      </header>

      {actionMessage ? (
        <div className="rounded-lg border border-[#c5c6cd] bg-[#f8fafc] px-3 py-2 text-sm text-[#1e293b]">{actionMessage}</div>
      ) : null}

      <CreditLedgerStats
        totalCreditAmount={stats.totalCreditAmount}
        totalPaidAmount={stats.totalPaidAmount}
        totalRemainingAmount={stats.totalRemainingAmount}
        overdueCredits={stats.overdueCredits}
        pendingCredits={stats.pendingCredits}
        partiallyPaidCredits={stats.partiallyPaidCredits}
      />

      <CreditLedgerFilters filters={filters} onFiltersChange={setFilters} />

      <div className="rounded-md bg-[#f5f3f4] px-3 py-2 text-sm font-medium text-[#374151]">
        Showing {filteredRows.length} credit ledger rows | Total Remaining: {formatCurrency(stats.totalRemainingAmount)}
      </div>

      <section className="rounded-xl border border-[#c5c6cd] bg-white">
        {loading ? <div className="p-4"><LoadingState message="Loading credit ledger..." /></div> : null}
        {!loading && error ? <div className="p-4"><ErrorState message={error} onRetry={load} /></div> : null}
        {!loading && !error && filteredRows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title="No pending credit sales found"
              description={
                hasActiveFilters
                  ? "No credit sales found for the current filters. Try clearing filters."
                  : "No credit sales found."
              }
            />
          </div>
        ) : null}

        {!loading && !error && filteredRows.length > 0 ? (
          <CreditLedgerTable
            rows={filteredRows}
            role={role}
            capabilities={capabilities}
            sortState={sortState}
            sendBusySaleId={sendBusySaleId}
            onSort={onSort}
            onView={(row) => setSelectedRow(row)}
            onSendInvoice={(row) => void onSendReminder(row)}
            onRecordPayment={onRecordPayment}
            onUpdateStatus={onUpdateStatus}
          />
        ) : null}
      </section>

      <CreditDetailModal
        row={selectedRow}
        detail={selectedDetail}
        loading={detailLoading}
        error={detailError}
        open={Boolean(selectedRow) && !paymentModalOpen && !statusModalOpen}
        onRetry={() => {
          if (selectedRow?.saleId) {
            void refreshSelectedDetail(selectedRow.saleId);
          }
        }}
        onClose={() => {
          setSelectedRow(null);
          setSelectedDetail(null);
          setDetailError(null);
        }}
      />

      <CreditPaymentModal
        key={`credit-payment-${selectedRow?.saleId ?? "none"}-${paymentModalOpen ? "open" : "closed"}`}
        open={paymentModalOpen}
        row={selectedRow}
        detail={selectedDetail}
        onClose={() => {
          setPaymentModalOpen(false);
        }}
        onSuccess={(message) => {
          void handleMutationSuccess(message);
        }}
      />

      <CreditStatusModal
        key={`credit-status-${selectedRow?.saleId ?? "none"}-${statusModalOpen ? "open" : "closed"}`}
        open={statusModalOpen}
        row={selectedRow}
        detail={selectedDetail}
        onClose={() => {
          setStatusModalOpen(false);
        }}
        onSuccess={(message) => {
          void handleMutationSuccess(message);
        }}
      />
    </div>
  );
}
