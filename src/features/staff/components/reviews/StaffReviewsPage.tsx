"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Eye, Plus, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import {
  EmptyState,
  ErrorState,
  FormDialog,
  Input,
  LoadingState,
  Modal,
  TextArea,
} from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray } from "../shared/staff-api";
import type { CustomerRow, ReviewRow } from "../shared/staff.types";

type CreateReviewForm = {
  customerId: string;
  rating: string;
  comment: string;
};

const defaultCreateForm: CreateReviewForm = {
  customerId: "",
  rating: "5",
  comment: "",
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-[#f59e0b]">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star key={value} className={`size-4 ${rating >= value ? "fill-current" : "text-[#c5c6cd]"}`} />
      ))}
    </div>
  );
}

const pageSize = 4;

export default function StaffReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ReviewRow | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateReviewForm>(defaultCreateForm);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [reviewsResult, customersResult] = await Promise.all([
      apiRequest<ReviewRow[]>("/api/reviews?page=1&pageSize=200"),
      apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=200"),
    ]);

    if (reviewsResult.error) {
      setRows([]);
      setError(reviewsResult.error);
    } else {
      setRows(unwrapArray<ReviewRow>(reviewsResult.data));
    }

    setCustomers(unwrapArray<CustomerRow>(customersResult.data));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const customerNameById = useMemo(() => {
    return new Map(customers.map((row) => [row.id, row.fullName]));
  }, [customers]);

  const normalizedRows = useMemo(() => {
    return rows.map((row) => ({
      ...row,
      customerName: row.customerName ?? customerNameById.get(row.customerId ?? "") ?? row.customerId ?? "-",
    }));
  }, [customerNameById, rows]);

  const totalPages = Math.max(1, Math.ceil(normalizedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return normalizedRows.slice(start, start + pageSize);
  }, [currentPage, normalizedRows]);

  const averageRating = useMemo(() => {
    if (normalizedRows.length === 0) return 0;
    return normalizedRows.reduce((sum, row) => sum + toNumber(row.rating), 0) / normalizedRows.length;
  }, [normalizedRows]);

  const onCreateReview = async () => {
    const rating = Number(createForm.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      setCreateError("Rating must be between 1 and 5.");
      return;
    }

    setCreateSubmitting(true);
    setCreateError(null);

    const result = await apiRequest<ReviewRow>("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        customerId: createForm.customerId || null,
        rating,
        comment: createForm.comment.trim() || null,
      }),
    });

    setCreateSubmitting(false);

    if (result.error) {
      setCreateError(result.error);
      return;
    }

    setCreateOpen(false);
    setCreateForm(defaultCreateForm);
    await load();
  };

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-[#1b1b1d]">Staff Reviews</h1>
            <p className="mt-1 text-base text-[#45474c]">Monitor customer feedback and team performance metrics.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateForm(defaultCreateForm);
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-6 py-3 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Review
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <article className="rounded-lg border border-[#c5c6cd] bg-white p-6">
            <p className="text-sm font-medium text-[#45474c]">Average Rating</p>
            <p className="mt-3 text-5xl font-bold tracking-[-0.02em] text-[#091426]">
              {averageRating.toFixed(1)}
              <span className="ml-1 text-2xl font-normal text-[#45474c]">/ 5.0</span>
            </p>
          </article>
          <article className="rounded-lg border border-[#c5c6cd] bg-white p-6">
            <p className="text-sm font-medium text-[#45474c]">Total Reviews</p>
            <p className="mt-3 text-5xl font-bold tracking-[-0.02em] text-[#091426]">{normalizedRows.length.toLocaleString()}</p>
          </article>
        </section>

        {loading ? <LoadingState message="Loading staff reviews..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-lg border border-[#c5c6cd] bg-white">
            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No reviews" description="No review records are available." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs font-medium uppercase tracking-[0.05em] text-[#45474c]">
                      <th className="px-4 py-3">Customer Name</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Comment</th>
                      <th className="px-4 py-3">Created Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`text-sm text-[#1b1b1d] ${index % 2 === 1 ? "bg-[#f7f6f7]" : "bg-white"}`}
                      >
                        <td className="px-4 py-4 font-medium">{row.customerName ?? "-"}</td>
                        <td className="px-4 py-4"><StarRow rating={toNumber(row.rating)} /></td>
                        <td className="px-4 py-4 text-[#45474c]">{row.comment ?? "-"}</td>
                        <td className="px-4 py-4 text-[#45474c]">{toDateLabel(row.createdAt)}</td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelected(row)}
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[#45474c] hover:bg-[#f1f5f9]"
                          >
                            <Eye className="size-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#c5c6cd] px-4 py-3 text-sm text-[#45474c]">
              <p>
                Showing {normalizedRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, normalizedRows.length)} of {normalizedRows.length}
              </p>
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
          <div className="space-y-3 text-sm text-[#1b1b1d]">
            <p><span className="font-semibold">Customer:</span> {selected.customerName ?? selected.customerId ?? "-"}</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Rating:</span>
              <StarRow rating={toNumber(selected.rating)} />
            </div>
            <p><span className="font-semibold">Comment:</span> {selected.comment ?? "-"}</p>
            <p><span className="font-semibold">Created:</span> {toDateLabel(selected.createdAt)}</p>
          </div>
        ) : null}
      </Modal>

      <FormDialog
        title="Add Review"
        description="Create a new customer review entry"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={() => void onCreateReview()}
        submitLabel="Create Review"
        isSubmitting={createSubmitting}
        errorMessage={createError}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1b1b1d]">Customer</label>
            <select
              value={createForm.customerId}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, customerId: event.target.value }))}
              className="h-10 w-full rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
            >
              <option value="">Select customer (optional)</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.fullName}</option>
              ))}
            </select>
          </div>

          <Input
            label="Rating (1-5)"
            type="number"
            min="1"
            max="5"
            value={createForm.rating}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, rating: event.target.value }))}
          />

          <TextArea
            label="Comment"
            value={createForm.comment}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, comment: event.target.value }))}
            placeholder="Optional comment"
            rows={5}
          />
        </div>
      </FormDialog>
    </StaffShell>
  );
}
