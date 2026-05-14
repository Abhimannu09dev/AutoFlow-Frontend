"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import { EmptyState, ErrorState, LoadingState, Modal, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray } from "../shared/admin-api";
import type { ReviewRow } from "../shared/admin.types";

function Stars({ rating = 0 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={`size-4 ${rating >= step ? "fill-[#f59e0b] text-[#f59e0b]" : "text-[#c5c6cd]"}`}
        />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ReviewRow | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<ReviewRow[]>("/api/reviews");
    if (result.error) {
      setError(result.error);
      setRows([]);
    } else {
      setRows(unwrapArray<ReviewRow>(result.data));
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
        (row.comment ?? "").toLowerCase().includes(lowered) ||
        (row.customerId ?? "").toLowerCase().includes(lowered)
      );
    });
  }, [rows, search]);

  const stats = useMemo(() => {
    if (rows.length === 0) {
      return { average: 0, total: 0 };
    }

    const total = rows.length;
    const average = rows.reduce((sum, row) => sum + toNumber(row.rating), 0) / total;
    return { average, total };
  }, [rows]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Reviews</h1>
          <p className="mt-1 text-base text-[#45474c]">Manage customer feedback and ratings.</p>
        </header>

        {loading ? <LoadingState message="Loading reviews..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 md:grid-cols-2">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-sm text-[#45474c]">Average Rating</p>
                <p className="mt-2 text-5xl font-semibold text-[#1b1b1d]">
                  {stats.average.toFixed(1)} <span className="text-2xl text-[#45474c]">/ 5.0</span>
                </p>
              </article>
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-sm text-[#45474c]">Total Reviews</p>
                <p className="mt-2 text-5xl font-semibold text-[#1b1b1d]">{stats.total.toLocaleString()}</p>
              </article>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] px-4 py-3">
                <SearchInput value={search} onChange={setSearch} placeholder="Search reviews..." />
              </div>

              {filtered.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No reviews" description="No reviews matched your search query." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px]">
                    <thead>
                      <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3">Comment</th>
                        <th className="px-4 py-3">Created Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((row) => (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3 font-medium">{row.customerName ?? row.customerId ?? "-"}</td>
                          <td className="px-4 py-3"><Stars rating={toNumber(row.rating)} /></td>
                          <td className="px-4 py-3 max-w-[420px] truncate">{row.comment ?? "-"}</td>
                          <td className="px-4 py-3">{toDateLabel(row.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => setSelected(row)}
                              className="text-sm font-medium text-[#0d9488]"
                            >
                              View
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

      <Modal
        title="Review Details"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        footer={(
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Close
            </button>
          </div>
        )}
      >
        {selected ? (
          <div className="space-y-4 text-sm text-[#1b1b1d]">
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Customer</p>
              <p className="mt-1 font-medium">{selected.customerName ?? selected.customerId ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Rating</p>
              <div className="mt-1 flex items-center gap-2">
                <Stars rating={toNumber(selected.rating)} />
                <span>{toNumber(selected.rating).toFixed(1)} / 5</span>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Comment</p>
              <p className="mt-1 whitespace-pre-wrap">{selected.comment ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Created Date</p>
              <p className="mt-1">{toDateLabel(selected.createdAt)}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminLayout>
  );
}
