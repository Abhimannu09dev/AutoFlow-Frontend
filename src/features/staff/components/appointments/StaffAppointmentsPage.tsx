"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { CalendarPlus, CircleX, Eye, PenLine } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, FormDialog, LoadingState, Modal, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, unwrapArray } from "../shared/staff-api";
import type { AppointmentRow, CustomerRow, VehicleRow } from "../shared/staff.types";

const pageSize = 6;
const appointmentStatusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Confirmed", label: "Confirmed" },
  { value: "InProgress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
] as const;

function toStatusClass(status: string | undefined): string {
  const lowered = (status ?? "pending").toLowerCase();
  if (lowered === "confirmed") return "bg-[#dbeafe] text-[#2563eb]";
  if (lowered === "inprogress" || lowered === "in progress") return "bg-[#d1fae5] text-[#059669]";
  if (lowered === "completed") return "bg-[#dcfce7] text-[#16a34a]";
  if (lowered === "cancelled") return "bg-[#fee2e2] text-[#dc2626]";
  return "bg-[#fef3c7] text-[#d97706]";
}

function toStatusLabel(status: string | undefined): string {
  const lowered = (status ?? "pending").toLowerCase();
  if (lowered === "inprogress") return "In Progress";
  if (lowered === "confirmed") return "Confirmed";
  if (lowered === "completed") return "Completed";
  if (lowered === "cancelled") return "Cancelled";
  return "Pending";
}

function normalizeStatusValue(status: string | undefined): string {
  const lowered = (status ?? "pending").toLowerCase();
  if (lowered === "in progress" || lowered === "inprogress") return "InProgress";
  if (lowered === "confirmed") return "Confirmed";
  if (lowered === "completed") return "Completed";
  if (lowered === "cancelled") return "Cancelled";
  return "Pending";
}

type ActionMode = "view" | "edit" | "cancel";

type AppointmentFormState = {
  customerId: string;
  vehicleId: string;
  date: string;
  time: string;
  status: string;
};

const defaultCreateForm: AppointmentFormState = {
  customerId: "",
  vehicleId: "",
  date: "",
  time: "",
  status: "Pending",
};

function readRecordString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return "";
}

function normalizeCustomerRecord(raw: unknown): CustomerRow {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: readRecordString(record, ["id", "Id"]),
    applicationUserId: readRecordString(record, ["applicationUserId", "ApplicationUserId"]) || undefined,
    fullName: readRecordString(record, ["fullName", "FullName"]),
    email: readRecordString(record, ["email", "Email"]),
    phone: readRecordString(record, ["phone", "Phone"]) || undefined,
    address: readRecordString(record, ["address", "Address"]) || undefined,
    createdAt: readRecordString(record, ["createdAt", "CreatedAt"]) || undefined,
  };
}

function normalizeVehicleRecord(raw: unknown): VehicleRow {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: readRecordString(record, ["id", "Id"]),
    vehicleNumber: readRecordString(record, ["vehicleNumber", "VehicleNumber"]) || undefined,
    brand: readRecordString(record, ["brand", "Brand"]) || undefined,
    model: readRecordString(record, ["model", "Model"]) || undefined,
    userId: readRecordString(record, ["userId", "UserId"]) || undefined,
    customerId: readRecordString(record, ["customerId", "CustomerId"]) || undefined,
    ownerId: readRecordString(record, ["ownerId", "OwnerId"]) || undefined,
    applicationUserId: readRecordString(record, ["applicationUserId", "ApplicationUserId"]) || undefined,
  };
}

function normalizeAppointmentRecord(raw: unknown): AppointmentRow {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    id: readRecordString(record, ["id", "Id"]),
    customerId: readRecordString(record, ["customerId", "CustomerId"]) || undefined,
    vehicleId: readRecordString(record, ["vehicleId", "VehicleId"]) || undefined,
    vehicleNumber: readRecordString(record, ["vehicleNumber", "VehicleNumber"]) || undefined,
    date: readRecordString(record, ["date", "Date"]) || undefined,
    time: readRecordString(record, ["time", "Time"]) || undefined,
    status: readRecordString(record, ["status", "Status"]) || undefined,
    createdAt: readRecordString(record, ["createdAt", "CreatedAt"]) || undefined,
    updatedAt: readRecordString(record, ["updatedAt", "UpdatedAt"]) || undefined,
  };
}

export default function StaffAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);

  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<AppointmentRow | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>("view");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<AppointmentFormState>(defaultCreateForm);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("Pending");
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [appointmentsResult, customersResult, vehiclesResult] = await Promise.all([
      apiRequest<AppointmentRow[]>("/api/appointments?page=1&pageSize=500"),
      apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=500"),
      apiRequest<VehicleRow[]>("/api/vehicles?page=1&pageSize=500"),
    ]);

    if (appointmentsResult.error) {
      setRows([]);
      setError(appointmentsResult.error);
    } else {
      setRows(unwrapArray<AppointmentRow>(appointmentsResult.data).map((item) => normalizeAppointmentRecord(item)));
    }

    setCustomers(unwrapArray<CustomerRow>(customersResult.data).map((item) => normalizeCustomerRecord(item)));
    setVehicles(unwrapArray<VehicleRow>(vehiclesResult.data).map((item) => normalizeVehicleRecord(item)));

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const customerNameById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer.fullName]));
  }, [customers]);

  const customerById = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id, customer]));
  }, [customers]);

  const vehicleById = useMemo(() => {
    return new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));
  }, [vehicles]);

  const selectableVehicles = useMemo(() => {
    if (!createForm.customerId) return vehicles;
    const selectedCustomer = customerById.get(createForm.customerId);
    if (!selectedCustomer) return vehicles;

    const customerId = selectedCustomer.id.toLowerCase();
    const appUserId = (selectedCustomer.applicationUserId ?? "").toLowerCase();

    return vehicles.filter((vehicle) => {
      const ownerUserId = (vehicle.userId ?? "").toLowerCase();
      const ownerCustomerId = (vehicle.customerId ?? "").toLowerCase();
      const ownerId = (vehicle.ownerId ?? "").toLowerCase();
      const vehicleAppUserId = (vehicle.applicationUserId ?? "").toLowerCase();

      return (
        (appUserId.length > 0 && ownerUserId === appUserId) ||
        ownerCustomerId === customerId ||
        ownerId === customerId ||
        (appUserId.length > 0 && vehicleAppUserId === appUserId)
      );
    });
  }, [createForm.customerId, customerById, vehicles]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();

    return rows.filter((row) => {
      const customerName = customerNameById.get(row.customerId ?? "") ?? row.customerId ?? "";
      const vehicle = vehicleById.get(row.vehicleId ?? "");
      const vehicleLabel = row.vehicleNumber ?? vehicle?.vehicleNumber ?? "";

      const matchesQuery =
        !lowered ||
        customerName.toLowerCase().includes(lowered) ||
        vehicleLabel.toLowerCase().includes(lowered);

      const matchesDate = !dateFilter || (row.date ?? "").startsWith(dateFilter);
      const matchesStatus =
        statusFilter === "all" || (row.status ?? "pending").toLowerCase() === statusFilter;

      return matchesQuery && matchesDate && matchesStatus;
    });
  }, [customerNameById, dateFilter, query, rows, statusFilter, vehicleById]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const onCreateAppointment = async () => {
    if (!createForm.customerId) {
      setCreateError("Customer is required.");
      return;
    }
    if (!createForm.date) {
      setCreateError("Date is required.");
      return;
    }
    if (!createForm.time) {
      setCreateError("Time is required.");
      return;
    }

    setCreateSubmitting(true);
    setCreateError(null);

    const result = await apiRequest<AppointmentRow>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        customerId: createForm.customerId,
        vehicleId: createForm.vehicleId || null,
        date: createForm.date,
        time: createForm.time,
        status: createForm.status,
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

  const onUpdateAppointmentStatus = async () => {
    if (!selected) return;

    setStatusSubmitting(true);
    setStatusError(null);

    const result = await apiRequest<AppointmentRow>(`/api/appointments/${selected.id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: editStatus }),
    });

    setStatusSubmitting(false);

    if (result.error) {
      setStatusError(result.error);
      return;
    }

    setSelected(null);
    setActionMode("view");
    await load();
  };

  const appointmentTitle =
    actionMode === "view"
      ? "Appointment Details"
      : actionMode === "edit"
        ? "Update Appointment Status"
        : "Cancel Appointment";

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Appointments</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage and schedule incoming service requests.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCreateError(null);
              setCreateForm(defaultCreateForm);
              setCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-5 py-2.5 text-sm font-medium text-white"
          >
            <CalendarPlus className="size-4" />
            Add Appointment
          </button>
        </header>

        <section className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="grid gap-4 lg:grid-cols-[1fr_180px_180px] lg:items-end">
            <SearchInput value={query} onChange={setQuery} placeholder="Search customer or vehicle" />
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Date</span>
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-[#fbf8fa] px-3 text-sm"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-[#45474c]">Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-[#fbf8fa] px-3 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        </section>

        {loading ? <LoadingState message="Loading appointments..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white">
            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No appointments found" description="No appointments matched your filters." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-sm font-medium text-[#45474c]">
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => {
                      const customerName = customerNameById.get(row.customerId ?? "") ?? row.customerId ?? "-";
                      const vehicle = vehicleById.get(row.vehicleId ?? "");
                      const vehicleLabel = row.vehicleNumber ?? vehicle?.vehicleNumber ?? "-";

                      return (
                        <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-3">
                            <p className="font-medium">{customerName}</p>
                            <p className="text-[#45474c]">{row.customerId ?? "-"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{vehicle?.brand ?? ""} {vehicle?.model ?? ""}</p>
                            <p className="text-[#45474c]">{vehicleLabel}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{toDateLabel(row.date)}</p>
                            <p className="text-[#45474c]">{row.time ?? "-"}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toStatusClass(row.status)}`}>
                              {row.status ?? "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3">{toDateLabel(row.createdAt)}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                title="View"
                                aria-label="View appointment details"
                                onClick={() => {
                                  setSelected(row);
                                  setActionMode("view");
                                }}
                                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                title="Update status"
                                aria-label="Update appointment status"
                                onClick={() => {
                                  setSelected(row);
                                  setActionMode("edit");
                                  setEditStatus(normalizeStatusValue(row.status));
                                  setStatusError(null);
                                }}
                                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                              >
                                <PenLine className="size-4" />
                              </button>
                              <button
                                type="button"
                                title="Cancel"
                                aria-label="Cancel appointment"
                              onClick={() => {
                                setSelected(row);
                                setActionMode("cancel");
                                setStatusError(null);
                              }}
                                className="rounded p-1 text-[#64748b] hover:bg-[#f1f5f9]"
                              >
                                <CircleX className="size-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-white px-4 py-3 text-sm text-[#45474c]">
              <p>
                Showing <span className="font-medium text-[#1b1b1d]">{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to <span className="font-medium text-[#1b1b1d]">{Math.min(currentPage * pageSize, filtered.length)}</span> of <span className="font-medium text-[#1b1b1d]">{filtered.length}</span> results
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-[#e2e8f0] px-3 py-1.5 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-[#e2e8f0] px-3 py-1.5 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <FormDialog
        title="Add Appointment"
        description="Create a new appointment with optional vehicle selection."
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={() => void onCreateAppointment()}
        submitLabel="Create Appointment"
        isSubmitting={createSubmitting}
        errorMessage={createError}
        maxWidthClassName="max-w-3xl"
        headerIcon={<CalendarPlus className="size-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Customer</span>
            <select
              value={createForm.customerId}
              onChange={(event) => {
                const customerId = event.target.value;
                setCreateForm((prev) => ({
                  ...prev,
                  customerId,
                  vehicleId: "",
                }));
              }}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.fullName}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Vehicle</span>
            <select
              value={createForm.vehicleId}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, vehicleId: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            >
              <option value="">No vehicle selected</option>
              {selectableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {(vehicle.vehicleNumber || "Unknown Plate")} - {[vehicle.brand, vehicle.model].filter(Boolean).join(" ")}
                </option>
              ))}
            </select>
            {createForm.customerId && selectableVehicles.length === 0 ? (
              <p className="text-xs text-[#92400e]">No vehicles found for the selected customer.</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Date</span>
            <input
              type="date"
              value={createForm.date}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, date: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            />
          </label>

          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Time</span>
            <input
              type="time"
              value={createForm.time}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, time: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Status</span>
            <select
              value={createForm.status}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
        </div>
      </FormDialog>

      <Modal
        title={appointmentTitle}
        open={Boolean(selected)}
        onClose={() => {
          setSelected(null);
          setActionMode("view");
          setStatusError(null);
        }}
        maxWidthClassName="max-w-2xl"
        footer={(
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setActionMode("view");
                setStatusError(null);
              }}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              {actionMode === "view" ? "Close" : "Cancel"}
            </button>
            {actionMode === "edit" ? (
              <button
                type="button"
                onClick={() => void onUpdateAppointmentStatus()}
                disabled={statusSubmitting}
                className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {statusSubmitting ? "Updating..." : "Update Status"}
              </button>
            ) : null}
          </div>
        )}
      >
        {selected ? (
          <div className="space-y-3 text-sm text-[#1b1b1d]">
            {actionMode === "cancel" ? (
              <div className="rounded-lg border border-[#c5c6cd] bg-[#f8fafc] px-3 py-2 text-[#1e293b]">
                Appointment cancel API is not available yet.
              </div>
            ) : null}
            {statusError ? (
              <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[#b91c1c]">
                {statusError}
              </div>
            ) : null}
            <p><span className="font-semibold">Customer:</span> {customerNameById.get(selected.customerId ?? "") ?? selected.customerId ?? "-"}</p>
            <p><span className="font-semibold">Vehicle:</span> {selected.vehicleNumber ?? "-"}</p>
            <p><span className="font-semibold">Date:</span> {toDateLabel(selected.date)}</p>
            <p><span className="font-semibold">Time:</span> {selected.time ?? "-"}</p>
            {actionMode === "edit" ? (
              <label className="block space-y-2">
                <span className="font-semibold">Status</span>
                <select
                  value={editStatus}
                  onChange={(event) => setEditStatus(event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#e2e8f0] bg-[#fbf8fa] px-3 text-sm"
                >
                  {appointmentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p><span className="font-semibold">Status:</span> {toStatusLabel(selected.status)}</p>
            )}
            <p><span className="font-semibold">Created:</span> {toDateLabel(selected.createdAt)}</p>
          </div>
        ) : null}
      </Modal>
    </StaffShell>
  );
}
