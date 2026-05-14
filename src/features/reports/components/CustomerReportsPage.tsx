"use client";

import { Download, FileText } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState, ErrorState, LoadingState, SearchInput } from "@/shared/components/ui";

import CustomerReportsTable from "./CustomerReportsTable";
import ReportTabs from "./ReportTabs";
import {
  downloadCsv,
  exportPrintableReport,
  fetchPendingCredit,
  fetchRegularCustomers,
  fetchTopSpenders,
  formatCurrency,
  formatDate,
} from "../shared/report-api";
import type {
  CustomerReportTabKey,
  PendingCreditReportRow,
  PendingCreditSortKey,
  PendingCreditSortState,
  RegularCustomerReportRow,
  RegularCustomerSortKey,
  RegularCustomerSortState,
  ReportRole,
  TopSpenderReportRow,
  TopSpenderSortKey,
  TopSpenderSortState,
} from "../shared/report.types";

interface CustomerReportsPageProps {
  role: ReportRole;
}

type DateRange = {
  from: string;
  to: string;
};

const tabTitleMap: Record<CustomerReportTabKey, string> = {
  "top-spenders": "Top Spenders",
  "regular-customers": "Regular Customers",
  "pending-credit": "Pending Credit",
};

const tabDescriptionMap: Record<CustomerReportTabKey, string> = {
  "top-spenders": "Customers ranked by total spending.",
  "regular-customers": "Customers with recurring purchase history.",
  "pending-credit": "Overdue credit sales (older than 30 days) that need follow-up.",
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

function applyDirection(value: number, direction: "asc" | "desc"): number {
  return direction === "asc" ? value : value * -1;
}

function inDateRange(dateValue: string | undefined, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  if (!dateValue) return false;

  const target = new Date(dateValue);
  if (Number.isNaN(target.getTime())) return false;

  if (range.from) {
    const from = new Date(range.from);
    if (!Number.isNaN(from.getTime()) && target < from) return false;
  }

  if (range.to) {
    const to = new Date(range.to);
    if (!Number.isNaN(to.getTime())) {
      to.setHours(23, 59, 59, 999);
      if (target > to) return false;
    }
  }

  return true;
}

function topRowsToExport(rows: TopSpenderReportRow[]): Array<Array<string | number>> {
  return rows.map((row) => [
    row.customerName,
    row.email,
    row.phone,
    row.purchaseCount,
    row.totalSpent.toFixed(2),
    formatDate(row.lastPurchaseDate),
  ]);
}

function regularRowsToExport(rows: RegularCustomerReportRow[]): Array<Array<string | number>> {
  return rows.map((row) => [
    row.customerName,
    row.email,
    row.phone,
    row.purchaseCount,
    row.totalSpent.toFixed(2),
    formatDate(row.lastPurchaseDate),
  ]);
}

function pendingRowsToExport(rows: PendingCreditReportRow[]): Array<Array<string | number>> {
  return rows.map((row) => [
    row.saleId,
    row.customerName,
    row.email,
    row.phone,
    formatDate(row.saleDate),
    row.creditAmount.toFixed(2),
    row.daysOverdue,
  ]);
}

export default function CustomerReportsPage({ role }: CustomerReportsPageProps) {
  const [activeTab, setActiveTab] = useState<CustomerReportTabKey>("top-spenders");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });

  const [topRows, setTopRows] = useState<TopSpenderReportRow[]>([]);
  const [regularRows, setRegularRows] = useState<RegularCustomerReportRow[]>([]);
  const [pendingRows, setPendingRows] = useState<PendingCreditReportRow[]>([]);

  const [loadingTop, setLoadingTop] = useState(false);
  const [loadingRegular, setLoadingRegular] = useState(false);
  const [loadingPending, setLoadingPending] = useState(false);

  const [topError, setTopError] = useState<string | null>(null);
  const [regularError, setRegularError] = useState<string | null>(null);
  const [pendingError, setPendingError] = useState<string | null>(null);

  const [topSort, setTopSort] = useState<TopSpenderSortState>({ key: "totalSpent", direction: "desc" });
  const [regularSort, setRegularSort] = useState<RegularCustomerSortState>({ key: "purchaseCount", direction: "desc" });
  const [pendingSort, setPendingSort] = useState<PendingCreditSortState>({ key: "daysOverdue", direction: "desc" });

  const loadTopSpenders = useCallback(async () => {
    setLoadingTop(true);
    const { rows, error } = await fetchTopSpenders();
    setTopRows(rows);
    setTopError(error);
    setLoadingTop(false);
  }, []);

  const loadRegularCustomers = useCallback(async () => {
    setLoadingRegular(true);
    const { rows, error } = await fetchRegularCustomers();
    setRegularRows(rows);
    setRegularError(error);
    setLoadingRegular(false);
  }, []);

  const loadPendingCredit = useCallback(async () => {
    setLoadingPending(true);
    const { rows, error } = await fetchPendingCredit();
    setPendingRows(rows);
    setPendingError(error);
    setLoadingPending(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void Promise.all([loadTopSpenders(), loadRegularCustomers(), loadPendingCredit()]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadPendingCredit, loadRegularCustomers, loadTopSpenders]);

  const sortedTopRows = useMemo(() => {
    const rows = [...topRows];
    rows.sort((a, b) => {
      const compared = (() => {
        switch (topSort.key) {
          case "customerName":
            return compareStrings(a.customerName, b.customerName);
          case "email":
            return compareStrings(a.email, b.email);
          case "phone":
            return compareStrings(a.phone, b.phone);
          case "purchaseCount":
            return compareNumbers(a.purchaseCount, b.purchaseCount);
          case "totalSpent":
            return compareNumbers(a.totalSpent, b.totalSpent);
          case "lastPurchaseDate":
            return compareDates(a.lastPurchaseDate, b.lastPurchaseDate);
          default:
            return 0;
        }
      })();
      return applyDirection(compared, topSort.direction);
    });
    return rows;
  }, [topRows, topSort]);

  const sortedRegularRows = useMemo(() => {
    const rows = [...regularRows];
    rows.sort((a, b) => {
      const compared = (() => {
        switch (regularSort.key) {
          case "customerName":
            return compareStrings(a.customerName, b.customerName);
          case "email":
            return compareStrings(a.email, b.email);
          case "phone":
            return compareStrings(a.phone, b.phone);
          case "purchaseCount":
            return compareNumbers(a.purchaseCount, b.purchaseCount) || compareNumbers(a.totalSpent, b.totalSpent);
          case "totalSpent":
            return compareNumbers(a.totalSpent, b.totalSpent);
          case "lastPurchaseDate":
            return compareDates(a.lastPurchaseDate, b.lastPurchaseDate);
          default:
            return 0;
        }
      })();
      return applyDirection(compared, regularSort.direction);
    });
    return rows;
  }, [regularRows, regularSort]);

  const sortedPendingRows = useMemo(() => {
    const rows = [...pendingRows];
    rows.sort((a, b) => {
      const compared = (() => {
        switch (pendingSort.key) {
          case "saleId":
            return compareStrings(a.saleId, b.saleId);
          case "customerName":
            return compareStrings(a.customerName, b.customerName);
          case "email":
            return compareStrings(a.email, b.email);
          case "phone":
            return compareStrings(a.phone, b.phone);
          case "saleDate":
            return compareDates(a.saleDate, b.saleDate);
          case "creditAmount":
            return compareNumbers(a.creditAmount, b.creditAmount);
          case "daysOverdue":
            return compareNumbers(a.daysOverdue, b.daysOverdue);
          default:
            return 0;
        }
      })();
      return applyDirection(compared, pendingSort.direction);
    });
    return rows;
  }, [pendingRows, pendingSort]);

  const filteredTopRows = useMemo(() => {
    const q = search.toLowerCase();
    return sortedTopRows.filter((row) => {
      const textMatch = row.customerName.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
      return textMatch && inDateRange(row.lastPurchaseDate, dateRange);
    });
  }, [dateRange, search, sortedTopRows]);

  const filteredRegularRows = useMemo(() => {
    const q = search.toLowerCase();
    return sortedRegularRows.filter((row) => {
      const textMatch = row.customerName.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
      return textMatch && inDateRange(row.lastPurchaseDate, dateRange);
    });
  }, [dateRange, search, sortedRegularRows]);

  const filteredPendingRows = useMemo(() => {
    const q = search.toLowerCase();
    return sortedPendingRows.filter((row) => {
      const textMatch = row.customerName.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
      return textMatch && inDateRange(row.saleDate, dateRange);
    });
  }, [dateRange, search, sortedPendingRows]);

  const isLoading =
    (activeTab === "top-spenders" && loadingTop) ||
    (activeTab === "regular-customers" && loadingRegular) ||
    (activeTab === "pending-credit" && loadingPending);

  const activeError =
    activeTab === "top-spenders" ? topError : activeTab === "regular-customers" ? regularError : pendingError;

  const activeCount =
    activeTab === "top-spenders"
      ? filteredTopRows.length
      : activeTab === "regular-customers"
        ? filteredRegularRows.length
        : filteredPendingRows.length;

  const summaryText =
    activeTab === "pending-credit"
      ? `Showing ${activeCount} overdue credit sales`
      : `Showing ${activeCount} customers`;

  const statsCards = useMemo(() => {
    if (activeTab === "top-spenders") {
      const totalPurchases = filteredTopRows.reduce((acc, row) => acc + row.purchaseCount, 0);
      const totalSpent = filteredTopRows.reduce((acc, row) => acc + row.totalSpent, 0);
      const highestSpender = filteredTopRows.reduce<TopSpenderReportRow | null>((acc, row) => {
        if (!acc) return row;
        return row.totalSpent > acc.totalSpent ? row : acc;
      }, null);

      return [
        { label: "Total Customers", value: String(filteredTopRows.length) },
        { label: "Total Purchases", value: totalPurchases.toLocaleString() },
        { label: "Total Spent", value: formatCurrency(totalSpent) },
        { label: "Highest Spender", value: highestSpender ? highestSpender.customerName : "-" },
      ];
    }

    if (activeTab === "regular-customers") {
      const totalPurchases = filteredRegularRows.reduce((acc, row) => acc + row.purchaseCount, 0);
      const totalSpent = filteredRegularRows.reduce((acc, row) => acc + row.totalSpent, 0);
      const averagePurchaseCount = filteredRegularRows.length === 0
        ? 0
        : totalPurchases / filteredRegularRows.length;

      return [
        { label: "Regular Customers", value: String(filteredRegularRows.length) },
        { label: "Total Purchases", value: totalPurchases.toLocaleString() },
        { label: "Total Spent", value: formatCurrency(totalSpent) },
        { label: "Average Purchase Count", value: averagePurchaseCount.toFixed(1) },
      ];
    }

    const totalCreditAmount = filteredPendingRows.reduce((acc, row) => acc + row.creditAmount, 0);
    const totalDaysOverdue = filteredPendingRows.reduce((acc, row) => acc + row.daysOverdue, 0);
    const averageDaysOverdue = filteredPendingRows.length === 0 ? 0 : totalDaysOverdue / filteredPendingRows.length;
    const criticalOverdueCount = filteredPendingRows.filter((row) => row.daysOverdue > 60).length;

    return [
      { label: "Pending Credit Sales", value: String(filteredPendingRows.length) },
      { label: "Total Credit Amount", value: formatCurrency(totalCreditAmount) },
      { label: "Average Days Overdue", value: averageDaysOverdue.toFixed(1) },
      { label: "Critical Overdue Count", value: criticalOverdueCount.toLocaleString() },
    ];
  }, [activeTab, filteredPendingRows, filteredRegularRows, filteredTopRows]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (search.trim().length > 0) {
      parts.push(`search="${search.trim()}"`);
    }
    if (dateRange.from || dateRange.to) {
      parts.push(`dateRange=${dateRange.from || "any"}..${dateRange.to || "any"}`);
    }
    parts.push(`visibleRows=${activeCount}`);
    return parts.join(", ");
  }, [activeCount, dateRange.from, dateRange.to, search]);

  const toggleTopSort = (key: TopSpenderSortKey) => {
    setTopSort((prev) => ({
      key,
      direction: prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "desc",
    }));
  };

  const toggleRegularSort = (key: RegularCustomerSortKey) => {
    setRegularSort((prev) => ({
      key,
      direction: prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "desc",
    }));
  };

  const togglePendingSort = (key: PendingCreditSortKey) => {
    setPendingSort((prev) => ({
      key,
      direction: prev.key === key ? (prev.direction === "asc" ? "desc" : "asc") : "desc",
    }));
  };

  const onRetry = () => {
    if (activeTab === "top-spenders") {
      void loadTopSpenders();
      return;
    }

    if (activeTab === "regular-customers") {
      void loadRegularCustomers();
      return;
    }

    void loadPendingCredit();
  };

  const exportCsv = () => {
    if (activeTab === "top-spenders") {
      downloadCsv(
        "autoflow-top-spenders-report.csv",
        ["Customer Name", "Email", "Phone", "Purchase Count", "Total Spent", "Last Purchase Date"],
        topRowsToExport(filteredTopRows)
      );
      return;
    }

    if (activeTab === "regular-customers") {
      downloadCsv(
        "autoflow-regular-customers-report.csv",
        ["Customer Name", "Email", "Phone", "Purchase Count", "Total Spent", "Last Purchase Date"],
        regularRowsToExport(filteredRegularRows)
      );
      return;
    }

    downloadCsv(
      "autoflow-pending-credit-report.csv",
      ["Sale ID", "Customer Name", "Email", "Phone", "Sale Date", "Credit Amount", "Days Overdue"],
      pendingRowsToExport(filteredPendingRows)
    );
  };

  const exportPdf = () => {
    if (activeTab === "top-spenders") {
      exportPrintableReport(
        "AutoFlow Top Spenders Report",
        ["Customer Name", "Email", "Phone", "Purchase Count", "Total Spent", "Last Purchase Date"],
        topRowsToExport(filteredTopRows),
        {
          activeReport: tabTitleMap[activeTab],
          filterSummary,
        }
      );
      return;
    }

    if (activeTab === "regular-customers") {
      exportPrintableReport(
        "AutoFlow Regular Customers Report",
        ["Customer Name", "Email", "Phone", "Purchase Count", "Total Spent", "Last Purchase Date"],
        regularRowsToExport(filteredRegularRows),
        {
          activeReport: tabTitleMap[activeTab],
          filterSummary,
        }
      );
      return;
    }

    exportPrintableReport(
      "AutoFlow Pending Credit Report",
      ["Sale ID", "Customer Name", "Email", "Phone", "Sale Date", "Credit Amount", "Days Overdue"],
      pendingRowsToExport(filteredPendingRows),
      {
        activeReport: tabTitleMap[activeTab],
        filterSummary,
      }
    );
  };

  const activeRowsEmpty = activeCount === 0;
  const disableExport = activeRowsEmpty || isLoading || Boolean(activeError);

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-sm font-medium text-[#6b7280]">Reports &gt; Customer Reports &gt; {tabTitleMap[activeTab]}</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Customer Reports</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#4b5563]">
              Review top spenders, regular customers, and pending credit sales for {role === "admin" ? "administrative" : "staff"} operations.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportCsv}
              disabled={disableExport}
              className="inline-flex items-center gap-2 rounded-xl border border-[#111827] bg-white px-4 py-2 text-sm font-medium text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="size-4" /> Export CSV
            </button>
            <button
              type="button"
              onClick={exportPdf}
              disabled={disableExport}
              className="inline-flex items-center gap-2 rounded-xl bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileText className="size-4" /> Export PDF
            </button>
          </div>
        </div>
      </header>

      <section className="rounded-xl border border-[#c5c6cd] bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ReportTabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSearch("");
              setDateRange({ from: "", to: "" });
            }}
          />
          <SearchInput value={search} onChange={setSearch} placeholder="Search by customer name or email" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-xs text-[#4b5563]">
            From
            <input
              type="date"
              value={dateRange.from}
              onChange={(event) => setDateRange((prev) => ({ ...prev, from: event.target.value }))}
              className="mt-1 block h-10 rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
            />
          </label>
          <label className="text-xs text-[#4b5563]">
            To
            <input
              type="date"
              value={dateRange.to}
              onChange={(event) => setDateRange((prev) => ({ ...prev, to: event.target.value }))}
              className="mt-1 block h-10 rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
            />
          </label>
          <button
            type="button"
            onClick={() => setDateRange({ from: "", to: "" })}
            className="mt-5 rounded-md border border-[#c5c6cd] px-3 py-2 text-sm text-[#4b5563]"
          >
            Clear Dates
          </button>
        </div>

        <div className="mt-4 rounded-md bg-[#f5f3f4] px-3 py-2 text-sm font-medium text-[#374151]">{summaryText}</div>

        <p className="mt-2 text-xs text-[#6b7280]">{tabDescriptionMap[activeTab]}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <article key={card.label} className="rounded-xl border border-[#c5c6cd] bg-white px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-[#64748b]">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-[#1b1b1d]">{card.value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-[#c5c6cd] bg-white">
        {isLoading ? <div className="p-4"><LoadingState message="Loading customer report..." /></div> : null}

        {!isLoading && activeError ? <div className="p-4"><ErrorState message={activeError} onRetry={onRetry} /></div> : null}

        {!isLoading && !activeError && activeRowsEmpty ? (
          <div className="p-4">
            <EmptyState
              title={activeTab === "pending-credit" ? "No pending credit sales found" : "No customers found"}
              description={
                activeTab === "pending-credit"
                  ? "No overdue credit sales found. Backend only returns credit sales older than 30 days."
                  : "Try adjusting search or date filters."
              }
            />
          </div>
        ) : null}

        {!isLoading && !activeError && !activeRowsEmpty ? (
          <CustomerReportsTable
            activeTab={activeTab}
            topRows={filteredTopRows}
            regularRows={filteredRegularRows}
            pendingRows={filteredPendingRows}
            topSort={topSort}
            regularSort={regularSort}
            pendingSort={pendingSort}
            onTopSort={toggleTopSort}
            onRegularSort={toggleRegularSort}
            onPendingSort={togglePendingSort}
          />
        ) : null}
      </section>
    </div>
  );
}
