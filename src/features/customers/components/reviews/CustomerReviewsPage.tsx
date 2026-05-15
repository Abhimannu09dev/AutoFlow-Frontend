"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Plus, Star } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

import { SectionCard, StatMiniCard } from "../common/PortalPrimitives";
import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapObject } from "../shared/customer-api";
import type { CustomerProfile, ReviewRow } from "../shared/customer.types";

type DisplayReviewRow = ReviewRow & {
  displayName: string;
};

export default function CustomerReviewsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<DisplayReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selected, setSelected] = useState<DisplayReviewRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [profileResponse, reviewsResponse] = await Promise.all([
      apiRequest<unknown>("/api/customer/profile"),
      apiRequest<unknown>("/api/reviews?page=1&pageSize=200"),
    ]);

    if (reviewsResponse.error) {
      setError(reviewsResponse.error);
      setRows([]);
      setLoading(false);
      return;
    }

    const profile = unwrapObject<CustomerProfile>(profileResponse.data, {
      id: "",
      fullName: "",
      email: "",
    });
    const customerId = String(profile.id ?? "").trim().toLowerCase();
    const profileName = String(profile.fullName ?? "").trim();
    const fallbackName = profileName || user?.name || "Customer";

    const rawRows = unwrapArray<ReviewRow>(reviewsResponse.data);
    const visibleRows =
      customerId.length > 0
        ? rawRows.filter((row) => String(row.customerId ?? "").trim().toLowerCase() === customerId)
        : rawRows;

    const normalizedRows = visibleRows.map((row) => ({
      ...row,
      displayName:
        String(row.customerName ?? "").trim() ||
        String(row.fullName ?? "").trim() ||
        String(row.name ?? "").trim() ||
        fallbackName,
    }));

    setRows(normalizedRows);
    setLoading(false);
  }, [user?.name]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(() => {
    const total = rows.length;
    const avg = total === 0 ? 0 : rows.reduce((sum, row) => sum + toNumber(row.rating, 0), 0) / total;
    const latest = [...rows].sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())[0];

    return { total, avg, latest };
  }, [rows]);

  const submitReview = async () => {
    if (!rating) {
      setSubmitError("Rating is required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const response = await apiRequest<unknown>("/api/reviews", {
      method: "POST",
      body: JSON.stringify({ rating: Number(rating), comment: comment.trim() || null }),
    });

    if (response.error) {
      setSubmitError(response.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setFormOpen(false);
    setRating("5");
    setComment("");
    await loadData();
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="My Reviews"
        subtitle="Share your feedback for completed services."
        actions={
          <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">
            <Plus className="size-4" /> Write Review
          </button>
        }
      />

      {loading ? <LoadingState message="Loading reviews..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatMiniCard label="Total Reviews" value={String(stats.total)} />
            <StatMiniCard label="Average Rating" value={stats.avg.toFixed(1)} />
            <StatMiniCard label="Latest Review" value={stats.latest ? toDateLabel(stats.latest.createdAt) : "-"} />
            <StatMiniCard label="Pending Feedback" value="0" />
          </div>

          <SectionCard title="Review History" subtitle="Your recent service feedback entries.">
            {rows.length === 0 ? (
              <EmptyState title="No reviews yet" description="Submit your first review after a completed service." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Customer Name</th>
                      <th className="px-4 py-3 font-semibold">Rating</th>
                      <th className="px-4 py-3 font-semibold">Comment</th>
                      <th className="px-4 py-3 font-semibold">Created Date</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3 text-[#091426]">{row.displayName}</td>
                        <td className="px-4 py-3 text-[#091426]">{toNumber(row.rating, 0)} / 5</td>
                        <td className="px-4 py-3 text-[#091426]">{row.comment ?? "-"}</td>
                        <td className="px-4 py-3 text-[#091426]">{toDateLabel(row.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" onClick={() => { setSelected(row); setViewOpen(true); }} className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]" aria-label="View review">
                            <Eye className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>
      ) : null}

      <FormDialog
        title="Write Review"
        description="Rate your service experience."
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={submitReview}
        submitLabel="Submit Review"
        isSubmitting={isSubmitting}
        errorMessage={submitError}
        maxWidthClassName="max-w-lg"
      >
        <div className="space-y-4">
          <label className="space-y-1 text-sm text-[#45474c]">
            Rating
            <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2">
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Comment
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" placeholder="Share your feedback" />
          </label>
        </div>
      </FormDialog>

      <FormDialog
        title="Review Detail"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onSubmit={() => setViewOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-lg"
      >
        {selected ? (
          <div className="space-y-3">
            <p className="text-sm text-[#334155]">
              <span className="font-semibold text-[#091426]">Customer:</span> {selected.displayName}
            </p>
            <div className="flex items-center gap-2 text-[#f59e0b]">
              {Array.from({ length: toNumber(selected.rating, 0) }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-sm text-[#334155]">{selected.comment ?? "No comment"}</p>
            <p className="text-xs text-[#64748b]">Created on {toDateLabel(selected.createdAt)}</p>
          </div>
        ) : null}
      </FormDialog>
    </CustomerShell>
  );
}
