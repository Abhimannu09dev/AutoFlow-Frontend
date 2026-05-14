"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SearchInput,
} from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray } from "../shared/admin-api";
import type { SaleRow } from "../shared/admin.types";

export default function AdminSalesAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<SaleRow[]>([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<SaleRow[]>("/api/sales");
    if (result.error) {
      setError(result.error);
      setRows([]);
    } else {
      setRows(unwrapArray<SaleRow>(result.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();
    return rows.filter((row) => {
      return (
        (row.customerName ?? "").toLowerCase().includes(lowered) ||
        (row.paymentMethod ?? "").toLowerCase().includes(lowered) ||
        (row.invoiceNumber ?? row.id).toLowerCase().includes(lowered)
      );
    });
  }, [rows, search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Sales</h1>
          <p className="text-base text-[#45474c]">Track sales transactions and payment status.</p>
          <p className="rounded-lg border border-[#c5c6cd] bg-[#f5f3f4] px-3 py-2 text-sm text-[#45474c]">
            Sales are created by Staff users.
          </p>
        </header>

        {loading ? <LoadingState message="Loading sales..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="rounded-xl border border-[#c5c6cd] bg-white">
            <div className="border-b border-[#c5c6cd] px-4 py-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search sales..." />
            </div>

            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No sales records" description="No sales rows matched this search." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                      <th className="px-4 py-3">Invoice</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Subtotal</th>
                      <th className="px-4 py-3 text-right">Discount</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                        <td className="px-4 py-3 font-medium">{row.invoiceNumber ?? row.id}</td>
                        <td className="px-4 py-3 font-medium">{row.customerName ?? "-"}</td>
                        <td className="px-4 py-3">{toDateLabel(row.saleDate)}</td>
                        <td className="px-4 py-3">{row.paymentMethod ?? "-"}</td>
                        <td className="px-4 py-3 text-right">${toNumber(row.subTotal).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">${toNumber(row.discountAmount).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-medium">${toNumber(row.totalAmount).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${
                              row.status?.toLowerCase() === "completed"
                                ? "bg-[#86f2e4] text-[#006f66]"
                                : row.status?.toLowerCase() === "cancelled"
                                  ? "bg-[#fee2e2] text-[#ef4444]"
                                  : "bg-[#fef3c7] text-[#f59e0b]"
                            }`}
                          >
                            {row.status ?? "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}
      </div>
    </AdminLayout>
  );
}
