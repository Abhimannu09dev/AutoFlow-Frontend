"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Eye, PenLine, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, FormDialog, Input, LoadingState, Modal } from "@/shared/components/ui";

import {
  apiRequest,
  normalizePartRequestStatus,
  toDateLabel,
  toNumber,
  unwrapArray,
} from "../shared/staff-api";
import type { CustomerRow, PartRequestRow } from "../shared/staff.types";

type PartRequestForm = {
  customerId: string;
  partName: string;
  quantity: string;
};

const defaultForm: PartRequestForm = {
  customerId: "",
  partName: "",
  quantity: "1",
};

const pageSize = 3;

function statusChipClass(status: string): string {
  const lowered = status.toLowerCase();
  if (lowered === "done" || lowered === "fulfilled") return "bg-[rgba(16,185,129,0.1)] text-[#10b981]";
  if (lowered === "ordered" || lowered === "approved") return "bg-[rgba(30,41,59,0.1)] text-[#1e293b]";
  if (lowered === "rejected") return "bg-[rgba(239,68,68,0.1)] text-[#ef4444]";
  return "bg-[rgba(245,158,11,0.1)] text-[#f59e0b]";
}

export default function StaffPartRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PartRequestRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<PartRequestRow | null>(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusModalError, setStatusModalError] = useState<string | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<PartRequestForm>(defaultForm);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [requestsResult, customersResult] = await Promise.all([
      apiRequest<PartRequestRow[]>("/api/parts-requests?pageNumber=1&pageSize=200"),
      apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=200"),
    ]);

    if (requestsResult.error) {
      setRows([]);
      setError(requestsResult.error);
    } else {
      setRows(unwrapArray<PartRequestRow>(requestsResult.data));
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

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();
    const next = rows.filter((row) => {
      const customerName = customerNameById.get(row.customerId ?? "") ?? row.customerName ?? row.customerId ?? "";
      const statusLabel = normalizePartRequestStatus(row.status);

      const matchesQuery =
        customerName.toLowerCase().includes(lowered) ||
        (row.partName ?? "").toLowerCase().includes(lowered);
      const matchesStatus = statusFilter === "all" || statusLabel.toLowerCase() === statusFilter;

      return matchesQuery && matchesStatus;
    });

    next.sort((a, b) => {
      const aDate = new Date(a.createdAt ?? "1970-01-01").getTime();
      const bDate = new Date(b.createdAt ?? "1970-01-01").getTime();
      return sortBy === "oldest" ? aDate - bDate : bDate - aDate;
    });

    return next;
  }, [customerNameById, query, rows, sortBy, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const stats = useMemo(() => {
    const base = {
      total: rows.length,
      pending: 0,
      done: 0,
      rejected: 0,
    };

    for (const row of rows) {
      const status = normalizePartRequestStatus(row.status).toLowerCase();
      if (status === "pending") base.pending += 1;
      else if (status === "done" || status === "fulfilled") base.done += 1;
      else if (status === "rejected") base.rejected += 1;
    }

    return base;
  }, [rows]);

  const onCreate = async () => {
    if (!createForm.partName.trim()) {
      setCreateError("Part name is required.");
      return;
    }

    const quantity = Number(createForm.quantity);
    if (!Number.isFinite(quantity) || quantity <= 0) {
      setCreateError("Quantity must be greater than 0.");
      return;
    }

    setCreateSubmitting(true);
    setCreateError(null);

    const result = await apiRequest<PartRequestRow>("/api/parts-requests", {
      method: "POST",
      body: JSON.stringify({
        customerId: createForm.customerId || null,
        partName: createForm.partName.trim(),
        quantity,
      }),
    });

    setCreateSubmitting(false);

    if (result.error) {
      setCreateError(result.error);
      return;
    }

    setCreateForm(defaultForm);
    setCreateOpen(false);
    await load();
  };

  const onStatusUpdate = async (nextStatus: "Done" | "Rejected") => {
    if (!selected) return;

    setStatusSubmitting(true);
    setStatusModalError(null);

    const result = await apiRequest<PartRequestRow>(`/api/parts-requests/${selected.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: nextStatus }),
    });

    setStatusSubmitting(false);

    if (result.error) {
      setStatusModalError(result.error);
      return;
    }

    setStatusModalOpen(false);
    setSelected(null);
    await load();
  };

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Part Requests</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage and track component requisitions.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateForm(defaultForm);
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0d9488] px-4 py-3 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Create Part Request
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Total Requests</p>
            <p className="mt-2 text-3xl font-semibold text-[#1b1b1d]">{stats.total}</p>
          </article>
          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Pending Requests</p>
            <p className="mt-2 text-3xl font-semibold text-[#d97706]">{stats.pending}</p>
          </article>
          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Done Requests</p>
            <p className="mt-2 text-3xl font-semibold text-[#10b981]">{stats.done}</p>
          </article>
          <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">Rejected Requests</p>
            <p className="mt-2 text-3xl font-semibold text-[#ef4444]">{stats.rejected}</p>
          </article>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Customer or Part..."
              className="h-10 w-72 rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
            />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="done">Done</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-10 rounded-lg border border-[#c5c6cd] bg-white px-3 text-sm"
            >
              <option value="newest">Sort By: Newest</option>
              <option value="oldest">Sort By: Oldest</option>
            </select>
          </div>
        </section>

        {loading ? <LoadingState message="Loading part requests..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="space-y-3">
            <div className="grid grid-cols-12 gap-3 rounded-lg border border-[#c5c6cd] bg-[#fbf8fa] px-4 py-3 text-sm font-medium text-[#45474c]">
              <div className="col-span-3">Customer / Vehicle</div>
              <div className="col-span-3">Part Name</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Created Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {pagedRows.length === 0 ? (
              <EmptyState title="No part requests" description="No part requests matched your filters." />
            ) : (
              pagedRows.map((row) => {
                const customerName = customerNameById.get(row.customerId ?? "") ?? row.customerName ?? row.customerId ?? "-";
                const displayStatus = normalizePartRequestStatus(row.status);
                return (
                  <div key={row.id} className="grid grid-cols-12 items-center gap-3 rounded-lg border border-[#c5c6cd] bg-white px-4 py-3 text-sm text-[#1b1b1d]">
                    <div className="col-span-3">
                      <p className="font-medium">{customerName}</p>
                      <p className="text-xs text-[#45474c]">{row.customerId ?? "-"}</p>
                    </div>
                    <div className="col-span-3">
                      <p>{row.partName ?? "-"}</p>
                      <p className="text-xs text-[#45474c]">SKU: {row.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="col-span-1">{toNumber(row.quantity)}</div>
                    <div className="col-span-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusChipClass(displayStatus)}`}>
                        {displayStatus}
                      </span>
                    </div>
                    <div className="col-span-2">{toDateLabel(row.createdAt)}</div>
                    <div className="col-span-1 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="View part request details"
                          onClick={() => {
                            setSelected(row);
                            setStatusModalOpen(false);
                          }}
                          className="rounded p-1 text-[#45474c] hover:bg-[#ece9ea]"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Update part request status"
                          onClick={() => {
                            setSelected(row);
                            setStatusModalOpen(true);
                            setStatusModalError(null);
                          }}
                          className="rounded p-1 text-[#45474c] hover:bg-[#ece9ea]"
                        >
                          <PenLine className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <div className="flex items-center justify-between border-t border-[#c5c6cd] px-2 py-2 text-xs font-semibold tracking-[0.04em] text-[#45474c]">
              <p>Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-[#c5c6cd] p-1.5 disabled:opacity-50"
                >
                  ◀
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-[#c5c6cd] p-1.5 disabled:opacity-50"
                >
                  ▶
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <FormDialog
        title="Create Part Request"
        description="Create a new request for workshop inventory."
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={onCreate}
        submitLabel="Create Request"
        isSubmitting={createSubmitting}
        errorMessage={createError}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Customer</span>
            <select
              value={createForm.customerId}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, customerId: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>{customer.fullName}</option>
              ))}
            </select>
          </label>

          <Input
            label="Quantity"
            type="number"
            value={createForm.quantity}
            onChange={(event) => setCreateForm((prev) => ({ ...prev, quantity: event.target.value }))}
            min={1}
          />

          <div className="md:col-span-2">
            <Input
              label="Part Name"
              value={createForm.partName}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, partName: event.target.value }))}
              placeholder="Brake Pads (Front)"
            />
          </div>
        </div>
      </FormDialog>

      <Modal
        title={statusModalOpen ? "Update Request Status" : "Part Request Details"}
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setStatusModalOpen(false);
          setStatusModalError(null);
        }}
        maxWidthClassName="max-w-2xl"
        footer={(
          <div className="flex flex-wrap items-center justify-end gap-2">
            {statusModalOpen ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setStatusModalOpen(false);
                    setStatusModalError(null);
                  }}
                  className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void onStatusUpdate("Rejected")}
                  disabled={statusSubmitting}
                  className="rounded-lg border border-[#ef4444] px-4 py-2 text-sm font-medium text-[#ef4444] disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => void onStatusUpdate("Done")}
                  disabled={statusSubmitting}
                  className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {statusSubmitting ? "Updating..." : "Mark Done"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setStatusModalOpen(false);
                  setStatusModalError(null);
                }}
                className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
              >
                Close
              </button>
            )}
          </div>
        )}
      >
        {selected ? (
          <div className="space-y-3 text-sm text-[#1b1b1d]">
            {statusModalOpen ? (
              <div className="rounded-lg border border-[#c5c6cd] bg-[#f5f3f4] px-3 py-2 text-[#45474c]">
                <p className="text-xs font-semibold uppercase tracking-[0.08em]">Request ID</p>
                <p className="mt-1 text-sm font-medium">{selected.id}</p>
              </div>
            ) : null}
            {statusModalError ? (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[#b91c1c]">
                {statusModalError}
              </div>
            ) : null}
            <p><span className="font-semibold">Customer:</span> {customerNameById.get(selected.customerId ?? "") ?? selected.customerName ?? selected.customerId ?? "-"}</p>
            <p><span className="font-semibold">Part:</span> {selected.partName ?? "-"}</p>
            <p><span className="font-semibold">Quantity:</span> {toNumber(selected.quantity)}</p>
            <p><span className="font-semibold">Status:</span> {normalizePartRequestStatus(selected.status)}</p>
            <p><span className="font-semibold">Created:</span> {toDateLabel(selected.createdAt)}</p>
          </div>
        ) : null}
      </Modal>
    </StaffShell>
  );
}
