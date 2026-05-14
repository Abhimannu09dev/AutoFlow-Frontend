"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Eye, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, LoadingState, Modal } from "@/shared/components/ui";

import { apiRequest, toNumber, unwrapArray } from "../shared/staff-api";
import type { PartRow } from "../shared/staff.types";

function isLowStock(row: PartRow): boolean {
  return toNumber(row.stockQuantity) <= toNumber(row.minimumStockLevel, 0);
}

function stockStatus(row: PartRow): "low" | "ok" {
  return isLowStock(row) ? "low" : "ok";
}

export default function StaffPartsInventoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PartRow[]>([]);

  const [partNameQuery, setPartNameQuery] = useState("");
  const [partNumberQuery, setPartNumberQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("any");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedRow, setSelectedRow] = useState<PartRow | null>(null);

  const pageSize = 4;

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<PartRow[]>("/api/parts?page=1&pageSize=300");
    if (result.error) {
      setRows([]);
      setError(result.error);
    } else {
      setRows(unwrapArray<PartRow>(result.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const categoryOptions = useMemo(() => {
    const values = new Set<string>();
    rows.forEach((row) => {
      if (row.category) {
        values.add(row.category);
      }
    });
    return Array.from(values).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const nameMatches = (row.partName ?? "").toLowerCase().includes(partNameQuery.toLowerCase());
      const numberMatches = (row.partNumber ?? "").toLowerCase().includes(partNumberQuery.toLowerCase());
      const categoryMatches = categoryFilter === "all" || (row.category ?? "") === categoryFilter;

      const status = stockStatus(row);
      const statusMatches = statusFilter === "any" || (statusFilter === "low" ? status === "low" : status === "ok");
      const lowStockMatches = !lowStockOnly || status === "low";

      return nameMatches && numberMatches && categoryMatches && statusMatches && lowStockMatches;
    });
  }, [categoryFilter, lowStockOnly, partNameQuery, partNumberQuery, rows, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  return (
    <StaffShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Parts Inventory</h1>
          <p className="mt-1 text-base text-[#45474c]">View current stock levels and suggest restocking for low inventory items.</p>
        </header>

        <section className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#45474c]">Part Name</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
                <input
                  value={partNameQuery}
                  onChange={(event) => setPartNameQuery(event.target.value)}
                  placeholder="e.g. Brake Pad"
                  className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white pl-9 pr-3 text-sm"
                />
              </div>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#45474c]">Part Number (SKU)</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
                <input
                  value={partNumberQuery}
                  onChange={(event) => setPartNumberQuery(event.target.value)}
                  placeholder="e.g. BRK-CER-0942"
                  className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white pl-9 pr-3 text-sm"
                />
              </div>
            </label>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#45474c]">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[#45474c]">Stock Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full rounded-md border border-[#c5c6cd] bg-white px-3 text-sm"
              >
                <option value="any">Any Status</option>
                <option value="ok">In Stock</option>
                <option value="low">Low Stock</option>
              </select>
            </label>
            <label className="inline-flex h-10 items-center gap-2 rounded-md border border-[#c5c6cd] bg-white px-3">
              <input
                type="checkbox"
                checked={lowStockOnly}
                onChange={(event) => setLowStockOnly(event.target.checked)}
                className="size-4"
              />
              <span className="text-sm text-[#1b1b1d]">Low Stock Only</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setPartNameQuery("");
                setPartNumberQuery("");
                setCategoryFilter("all");
                setStatusFilter("any");
                setLowStockOnly(false);
              }}
              className="h-10 px-3 text-sm font-medium text-[#75777d]"
            >
              Clear Filters
            </button>
          </div>
        </section>

        {loading ? <LoadingState message="Loading parts inventory..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No parts found" description="No parts matched your filters." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1080px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#45474c]">
                      <th className="px-4 py-3">Part Details</th>
                      <th className="px-4 py-3">Category / Brand</th>
                      <th className="px-4 py-3">Pricing</th>
                      <th className="px-4 py-3">Stock Level</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => {
                      const lowStock = isLowStock(row);
                      return (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-4">
                            <p className="font-semibold">{row.partName ?? "-"}</p>
                            <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">PN: {row.partNumber ?? "-"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p>{row.category ?? "-"}</p>
                            <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">{row.brand ?? "-"}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium">${toNumber(row.sellingPrice).toFixed(2)} <span className="text-xs text-[#45474c]">Sell</span></p>
                            <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">${toNumber(row.unitPrice).toFixed(2)} Cost</p>
                          </td>
                          <td className="px-4 py-4">
                            {toNumber(row.stockQuantity)} / {toNumber(row.minimumStockLevel, 0)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${lowStock ? "bg-[#fef3c7] text-[#d97706]" : "bg-[#dbeafe] text-[#1e3a8a]"}`}>
                              {lowStock ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              title="View part"
                              onClick={() => setSelectedRow(row)}
                              className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                            >
                              <Eye className="size-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#c5c6cd] bg-[#fbf8fa] px-4 py-3 text-xs font-semibold tracking-[0.04em] text-[#45474c]">
              <p>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} parts</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-[#c5c6cd] px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-[#c5c6cd] px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <Modal
        title="Part Details"
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
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
            <p><span className="font-semibold">Part:</span> {selectedRow.partName ?? "-"}</p>
            <p><span className="font-semibold">Part Number:</span> {selectedRow.partNumber ?? "-"}</p>
            <p><span className="font-semibold">Category:</span> {selectedRow.category ?? "-"}</p>
            <p><span className="font-semibold">Brand:</span> {selectedRow.brand ?? "-"}</p>
            <p><span className="font-semibold">Unit Price:</span> ${toNumber(selectedRow.unitPrice).toFixed(2)}</p>
            <p><span className="font-semibold">Selling Price:</span> ${toNumber(selectedRow.sellingPrice).toFixed(2)}</p>
            <p><span className="font-semibold">Stock:</span> {toNumber(selectedRow.stockQuantity)} (Min {toNumber(selectedRow.minimumStockLevel, 0)})</p>
            <p><span className="font-semibold">Vendor:</span> {selectedRow.vendorName ?? "-"}</p>
          </div>
        ) : null}
      </Modal>
    </StaffShell>
  );
}
