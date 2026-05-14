import { ArrowDown, ArrowUp } from "lucide-react";

import { formatCurrency, formatDate } from "../shared/report-api";
import type {
  CustomerReportTabKey,
  PendingCreditReportRow,
  PendingCreditSortKey,
  PendingCreditSortState,
  RegularCustomerReportRow,
  RegularCustomerSortKey,
  RegularCustomerSortState,
  TopSpenderReportRow,
  TopSpenderSortKey,
  TopSpenderSortState,
} from "../shared/report.types";

interface CustomerReportsTableProps {
  activeTab: CustomerReportTabKey;
  topRows: TopSpenderReportRow[];
  regularRows: RegularCustomerReportRow[];
  pendingRows: PendingCreditReportRow[];
  topSort: TopSpenderSortState;
  regularSort: RegularCustomerSortState;
  pendingSort: PendingCreditSortState;
  onTopSort: (key: TopSpenderSortKey) => void;
  onRegularSort: (key: RegularCustomerSortKey) => void;
  onPendingSort: (key: PendingCreditSortKey) => void;
}

interface SortHeaderProps {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}

function SortHeaderButton({ label, active, direction, onClick, className = "" }: SortHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-[0.08em] text-[#45474c] ${className}`.trim()}
    >
      {label}
      {active ? direction === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" /> : null}
    </button>
  );
}

function overdueClass(daysOverdue: number): string {
  if (daysOverdue > 60) return "bg-[#fee2e2] text-[#b91c1c]";
  if (daysOverdue > 30) return "bg-[#ffedd5] text-[#c2410c]";
  return "bg-[#fef3c7] text-[#92400e]";
}

export default function CustomerReportsTable({
  activeTab,
  topRows,
  regularRows,
  pendingRows,
  topSort,
  regularSort,
  pendingSort,
  onTopSort,
  onRegularSort,
  onPendingSort,
}: CustomerReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      {activeTab === "top-spenders" ? (
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-[#f5f3f4] text-left text-xs">
              <th className="px-4 py-3"><SortHeaderButton label="Customer Name" active={topSort.key === "customerName"} direction={topSort.direction} onClick={() => onTopSort("customerName")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Email" active={topSort.key === "email"} direction={topSort.direction} onClick={() => onTopSort("email")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Phone" active={topSort.key === "phone"} direction={topSort.direction} onClick={() => onTopSort("phone")} /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Purchase Count" active={topSort.key === "purchaseCount"} direction={topSort.direction} onClick={() => onTopSort("purchaseCount")} className="justify-end" /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Total Spent" active={topSort.key === "totalSpent"} direction={topSort.direction} onClick={() => onTopSort("totalSpent")} className="justify-end" /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Last Purchase Date" active={topSort.key === "lastPurchaseDate"} direction={topSort.direction} onClick={() => onTopSort("lastPurchaseDate")} /></th>
            </tr>
          </thead>
          <tbody>
            {topRows.map((row) => (
              <tr key={row.rowId} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                <td className="px-4 py-3 font-medium">{row.customerName}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3 text-right">{row.purchaseCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.totalSpent)}</td>
                <td className="px-4 py-3">{formatDate(row.lastPurchaseDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {activeTab === "regular-customers" ? (
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-[#f5f3f4] text-left text-xs">
              <th className="px-4 py-3"><SortHeaderButton label="Customer Name" active={regularSort.key === "customerName"} direction={regularSort.direction} onClick={() => onRegularSort("customerName")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Email" active={regularSort.key === "email"} direction={regularSort.direction} onClick={() => onRegularSort("email")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Phone" active={regularSort.key === "phone"} direction={regularSort.direction} onClick={() => onRegularSort("phone")} /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Purchase Count" active={regularSort.key === "purchaseCount"} direction={regularSort.direction} onClick={() => onRegularSort("purchaseCount")} className="justify-end" /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Total Spent" active={regularSort.key === "totalSpent"} direction={regularSort.direction} onClick={() => onRegularSort("totalSpent")} className="justify-end" /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Last Purchase Date" active={regularSort.key === "lastPurchaseDate"} direction={regularSort.direction} onClick={() => onRegularSort("lastPurchaseDate")} /></th>
            </tr>
          </thead>
          <tbody>
            {regularRows.map((row) => (
              <tr key={row.rowId} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                <td className="px-4 py-3 font-medium">{row.customerName}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3 text-right">{row.purchaseCount.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.totalSpent)}</td>
                <td className="px-4 py-3">{formatDate(row.lastPurchaseDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {activeTab === "pending-credit" ? (
        <table className="w-full min-w-[1080px]">
          <thead>
            <tr className="bg-[#f5f3f4] text-left text-xs">
              <th className="px-4 py-3"><SortHeaderButton label="Sale ID" active={pendingSort.key === "saleId"} direction={pendingSort.direction} onClick={() => onPendingSort("saleId")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Customer Name" active={pendingSort.key === "customerName"} direction={pendingSort.direction} onClick={() => onPendingSort("customerName")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Email" active={pendingSort.key === "email"} direction={pendingSort.direction} onClick={() => onPendingSort("email")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Phone" active={pendingSort.key === "phone"} direction={pendingSort.direction} onClick={() => onPendingSort("phone")} /></th>
              <th className="px-4 py-3"><SortHeaderButton label="Sale Date" active={pendingSort.key === "saleDate"} direction={pendingSort.direction} onClick={() => onPendingSort("saleDate")} /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Credit Amount" active={pendingSort.key === "creditAmount"} direction={pendingSort.direction} onClick={() => onPendingSort("creditAmount")} className="justify-end" /></th>
              <th className="px-4 py-3 text-right"><SortHeaderButton label="Days Overdue" active={pendingSort.key === "daysOverdue"} direction={pendingSort.direction} onClick={() => onPendingSort("daysOverdue")} className="justify-end" /></th>
            </tr>
          </thead>
          <tbody>
            {pendingRows.map((row) => (
              <tr key={row.rowId} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                <td className="px-4 py-3 font-medium">{row.saleId}</td>
                <td className="px-4 py-3">{row.customerName}</td>
                <td className="px-4 py-3">{row.email}</td>
                <td className="px-4 py-3">{row.phone}</td>
                <td className="px-4 py-3">{formatDate(row.saleDate)}</td>
                <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.creditAmount)}</td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${overdueClass(row.daysOverdue)}`}>
                    {row.daysOverdue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}
