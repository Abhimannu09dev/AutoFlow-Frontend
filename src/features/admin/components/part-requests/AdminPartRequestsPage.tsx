"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { Eye, PenLine } from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import { EmptyState, ErrorState, LoadingState, Modal, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, unwrapArray } from "../shared/admin-api";
import type { PagedResponse, PartRequestRow } from "../shared/admin.types";

function toDisplayStatus(status: string | undefined): string {
  if (!status) return "Pending";
  if (status.toLowerCase() === "fulfilled") return "Done";
  return status;
}

export default function AdminPartRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PartRequestRow[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PartRequestRow | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "status">("view");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<PagedResponse<PartRequestRow> | PartRequestRow[]>(
      "/api/parts-requests?pageNumber=1&pageSize=100"
    );
    if (result.error) {
      setError(result.error);
      setRows([]);
    } else {
      setRows(unwrapArray<PartRequestRow>(result.data));
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
        (row.customerId ?? "").toLowerCase().includes(lowered) ||
        (row.partName ?? "").toLowerCase().includes(lowered) ||
        (row.status ?? "").toLowerCase().includes(lowered)
      );
    });
  }, [rows, search]);

  const onStatusAction = async (status: "Done" | "Rejected") => {
    if (!selected) return;

    setUpdatingStatus(true);
    setActionMessage(null);

    const result = await apiRequest<PartRequestRow>(`/api/parts-requests/${selected.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (result.error) {
      setActionMessage(result.error);
      setUpdatingStatus(false);
      return;
    }

    const nextStatus = status === "Done" ? "Fulfilled" : "Rejected";
    setRows((prev) =>
      prev.map((row) => (row.id === selected.id ? { ...row, status: nextStatus } : row))
    );
    setSelected((prev) => (prev ? { ...prev, status: nextStatus } : prev));

    setActionMessage(null);
    setUpdatingStatus(false);
    await load();
    setSelected(null);
    setModalMode("view");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Part Requests</h1>
          <p className="mt-1 text-base text-[#45474c]">Manage and track required inventory for ongoing services.</p>
        </header>

        {loading ? <LoadingState message="Loading part requests..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="rounded-xl border border-[#c5c6cd] bg-white">
            <div className="border-b border-[#c5c6cd] px-4 py-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search part requests..." />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px]">
                <thead>
                  <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Part Name</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Created Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8">
                        <EmptyState
                          title="No part requests"
                          description="No part requests matched your search criteria."
                        />
                      </td>
                    </tr>
                  ) : (
                    filtered.map((row) => {
                      const statusText = toDisplayStatus(row.status);
                      const loweredStatus = statusText.toLowerCase();

                      return (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3">{row.customerName ?? row.customerId ?? "-"}</td>
                          <td className="px-4 py-3">{row.partName ?? "-"}</td>
                          <td className="px-4 py-3">{row.quantity ?? 0}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                loweredStatus === "done"
                                  ? "bg-[#d1fae5] text-[#10b981]"
                                  : loweredStatus === "rejected"
                                    ? "bg-[#fee2e2] text-[#ef4444]"
                                    : "bg-[#fef3c7] text-[#f59e0b]"
                              }`}
                            >
                              {statusText}
                            </span>
                          </td>
                          <td className="px-4 py-3">{toDateLabel(row.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                title="View request"
                                onClick={() => {
                                  setSelected(row);
                                  setModalMode("view");
                                  setActionMessage(null);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c5c6cd] text-[#0d9488] hover:bg-[#f0fdfa]"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                title="Update status"
                                onClick={() => {
                                  setSelected(row);
                                  setModalMode("status");
                                  setActionMessage(null);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#c5c6cd] text-[#1e293b] hover:bg-[#f8fafc]"
                              >
                                <PenLine className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>

      <Modal
        title={modalMode === "status" ? "Update Request Status" : "Part Request Details"}
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setActionMessage(null);
          setModalMode("view");
        }}
        footer={(
          <div className="flex flex-wrap items-center justify-end gap-2">
            {modalMode === "status" ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(null);
                    setActionMessage(null);
                    setModalMode("view");
                  }}
                  className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void onStatusAction("Rejected")}
                  disabled={updatingStatus}
                  className="rounded-lg border border-[#ef4444] px-4 py-2 text-sm font-medium text-[#ef4444] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => void onStatusAction("Done")}
                  disabled={updatingStatus}
                  className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatingStatus ? "Updating..." : "Mark Done"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  setActionMessage(null);
                  setModalMode("view");
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
            {actionMessage ? (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[#b91c1c]">
                {actionMessage}
              </div>
            ) : null}
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Customer</p>
              <p className="mt-1 font-medium">{selected.customerName ?? selected.customerId ?? "-"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Part</p>
              <p className="mt-1">{selected.partName ?? "-"}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Quantity</p>
                <p className="mt-1">{selected.quantity ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Status</p>
                <p className="mt-1">{toDisplayStatus(selected.status)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.08em] text-[#6b7280]">Created</p>
              <p className="mt-1">{toDateLabel(selected.createdAt)}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminLayout>
  );
}
