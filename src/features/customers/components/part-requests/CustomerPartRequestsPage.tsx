"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Plus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";
import SearchInput from "@/shared/components/ui/SearchInput";

import { SectionCard, StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, toDateLabel, unwrapArray } from "../shared/customer-api";
import type { PartRequestRow } from "../shared/customer.types";

export default function CustomerPartRequestsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<PartRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [createdDate, setCreatedDate] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [partName, setPartName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selected, setSelected] = useState<PartRequestRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiRequest<unknown>("/api/parts-requests?page=1&pageSize=200");
    if (response.error) {
      setError(response.error);
    }

    setRows(unwrapArray<PartRequestRow>(response.data));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const bySearch = !term || String(row.partName ?? "").toLowerCase().includes(term);
      const byStatus = status === "all" || String(row.status ?? "").toLowerCase() === status;
      const byDate = !createdDate || String(row.createdAt ?? "").slice(0, 10) === createdDate;
      return bySearch && byStatus && byDate;
    });
  }, [rows, search, status, createdDate]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const pending = filtered.filter((row) => (row.status ?? "").toLowerCase() === "pending").length;
    const approved = filtered.filter((row) => (row.status ?? "").toLowerCase() === "approved").length;
    const fulfilled = filtered.filter((row) => {
      const statusValue = (row.status ?? "").toLowerCase();
      return statusValue === "fulfilled" || statusValue === "done";
    }).length;

    return { total, pending, approved, fulfilled };
  }, [filtered]);

  const createRequest = async () => {
    if (!partName.trim() || Number(quantity) <= 0) {
      setSubmitError("Part name and quantity are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const response = await apiRequest<unknown>("/api/parts-requests", {
      method: "POST",
      body: JSON.stringify({ partName: partName.trim(), quantity: Number(quantity) }),
    });

    if (response.error) {
      setSubmitError(response.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setFormOpen(false);
    setPartName("");
    setQuantity("1");
    await loadData();
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="Part Requests"
        subtitle="Request parts not currently available in inventory."
        actions={
          <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">
            <Plus className="size-4" /> New Part Request
          </button>
        }
      />

      {loading ? <LoadingState message="Loading part requests..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatMiniCard label="Total Requests" value={String(stats.total)} />
            <StatMiniCard label="Pending Requests" value={String(stats.pending)} />
            <StatMiniCard label="Approved Requests" value={String(stats.approved)} />
            <StatMiniCard label="Fulfilled Requests" value={String(stats.fulfilled)} />
          </div>

          <SectionCard title="Request List" subtitle="Search by part name and filter by status.">
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by part name..." />
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="rejected">Rejected</option>
              </select>
              <input type="date" value={createdDate} onChange={(event) => setCreatedDate(event.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm" />
            </div>

            {filtered.length === 0 ? (
              <EmptyState title="No part requests found" description="Submit a new request or change your filters." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Part Name</th>
                      <th className="px-4 py-3 font-semibold">Quantity</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 font-semibold">Created Date</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3 text-[#091426]">{row.partName ?? "-"}</td>
                        <td className="px-4 py-3 text-[#091426]">{row.quantity ?? 0}</td>
                        <td className="px-4 py-3"><StatusPill label={row.status ?? "Pending"} /></td>
                        <td className="px-4 py-3 text-[#091426]">{toDateLabel(row.createdAt)}</td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" onClick={() => { setSelected(row); setViewOpen(true); }} aria-label="View request" className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]">
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
        title="New Part Request"
        description="Submit part details and quantity."
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createRequest}
        submitLabel="Submit Request"
        isSubmitting={isSubmitting}
        errorMessage={submitError}
        maxWidthClassName="max-w-lg"
      >
        <div className="space-y-4">
          <label className="space-y-1 text-sm text-[#45474c]">
            Part Name
            <input value={partName} onChange={(e) => setPartName(e.target.value)} className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Quantity
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" />
          </label>
        </div>
      </FormDialog>

      <FormDialog
        title="Request Detail"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onSubmit={() => setViewOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-lg"
      >
        {selected ? (
          <div className="space-y-2 text-sm text-[#334155]">
            <p><span className="font-semibold text-[#091426]">Part Name:</span> {selected.partName ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">Quantity:</span> {selected.quantity ?? 0}</p>
            <p><span className="font-semibold text-[#091426]">Status:</span> {selected.status ?? "Pending"}</p>
            <p><span className="font-semibold text-[#091426]">Created:</span> {toDateLabel(selected.createdAt)}</p>
          </div>
        ) : null}
      </FormDialog>
    </CustomerShell>
  );
}
