import SearchInput from "@/shared/components/ui/SearchInput";

import type { CreditLedgerFilters } from "../shared/credit.types";

type CreditLedgerFiltersProps = {
  filters: CreditLedgerFilters;
  onFiltersChange: (next: CreditLedgerFilters) => void;
};

export default function CreditLedgerFilters({ filters, onFiltersChange }: CreditLedgerFiltersProps) {
  return (
    <section className="rounded-xl border border-[#c5c6cd] bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SearchInput
            value={filters.search}
            onChange={(value) => onFiltersChange({ ...filters, search: value })}
            placeholder="Search customer, email, phone, invoice ID, sale ID"
          />
        </div>

        <label className="space-y-1 text-xs text-[#4b5563]">
          Status
          <select
            value={filters.status}
            onChange={(event) => onFiltersChange({ ...filters, status: event.target.value as CreditLedgerFilters["status"] })}
            className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="partially-paid">Partially Paid</option>
            <option value="paid">Paid / Cleared</option>
            <option value="overdue">Overdue</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-[#4b5563]">
          Sale Date From
          <input
            type="date"
            value={filters.saleDateFrom}
            onChange={(event) => onFiltersChange({ ...filters, saleDateFrom: event.target.value })}
            className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
          />
        </label>

        <label className="space-y-1 text-xs text-[#4b5563]">
          Sale Date To
          <input
            type="date"
            value={filters.saleDateTo}
            onChange={(event) => onFiltersChange({ ...filters, saleDateTo: event.target.value })}
            className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
          />
        </label>

        <label className="space-y-1 text-xs text-[#4b5563]">
          Due Date From
          <input
            type="date"
            value={filters.dueDateFrom}
            onChange={(event) => onFiltersChange({ ...filters, dueDateFrom: event.target.value })}
            className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
          />
        </label>

        <label className="space-y-1 text-xs text-[#4b5563]">
          Due Date To
          <input
            type="date"
            value={filters.dueDateTo}
            onChange={(event) => onFiltersChange({ ...filters, dueDateTo: event.target.value })}
            className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm text-[#111827]"
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-[#111827]">
          <input
            type="checkbox"
            checked={filters.overdueOnly}
            onChange={(event) => onFiltersChange({ ...filters, overdueOnly: event.target.checked })}
          />
          Overdue only
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-[#111827]">
          <input
            type="checkbox"
            checked={filters.outstandingOnly}
            onChange={(event) => onFiltersChange({ ...filters, outstandingOnly: event.target.checked })}
          />
          Outstanding only
        </label>
        <button
          type="button"
          onClick={() =>
            onFiltersChange({
              search: "",
              status: "all",
              saleDateFrom: "",
              saleDateTo: "",
              dueDateFrom: "",
              dueDateTo: "",
              overdueOnly: false,
              outstandingOnly: false,
            })
          }
          className="rounded-md border border-[#c5c6cd] px-3 py-2 text-sm text-[#4b5563]"
        >
          Clear Filters
        </button>
      </div>
    </section>
  );
}
