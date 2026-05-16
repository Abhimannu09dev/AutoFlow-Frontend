"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Eye, Plus, XCircle } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";
import SearchInput from "@/shared/components/ui/SearchInput";

import { SectionCard, StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, formatDateTime, toDateLabel, unwrapArray } from "../shared/customer-api";
import type { AppointmentRow, VehicleRow } from "../shared/customer.types";

type AppointmentForm = {
  vehicleId: string;
  date: string;
  time: string;
};

const emptyForm: AppointmentForm = {
  vehicleId: "",
  date: "",
  time: "",
};

type VehicleOption = {
  id: string;
  label: string;
  vehicleNumber: string;
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function getVehicleOptionLabel(vehicle: { brand?: string; model?: string; vehicleNumber?: string }): string {
  const name = [vehicle.brand, vehicle.model].map((value) => asString(value)).filter(Boolean).join(" ");
  const number = asString(vehicle.vehicleNumber);

  if (name && number) return `${name} - ${number}`;
  if (name) return name;
  if (number) return number;
  return "Vehicle unavailable";
}

function toBackendTime(time: string): string {
  const trimmed = time.trim();
  return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
}

function normalizeVehicle(row: VehicleRow): VehicleOption | null {
  const source = row as Record<string, unknown>;
  const id = asString(row.id) || asString(source.Id);
  if (!id) return null;

  const brand = asString(row.brand) || asString(source.Brand);
  const model = asString(row.model) || asString(source.Model);
  const vehicleNumber = asString(row.vehicleNumber) || asString(source.VehicleNumber);

  return {
    id,
    vehicleNumber,
    label: getVehicleOptionLabel({ brand, model, vehicleNumber }),
  };
}

function normalizeAppointment(row: AppointmentRow): AppointmentRow {
  const source = row as Record<string, unknown>;
  return {
    ...row,
    id: asString(row.id) || asString(source.Id),
    vehicleId: asString(row.vehicleId) || asString(source.VehicleId),
    vehicleNumber: asString(row.vehicleNumber) || asString(source.VehicleNumber),
    date: asString(row.date) || asString(source.Date),
    time: asString(row.time) || asString(source.Time),
    status: asString(row.status) || asString(source.Status),
  };
}

const TIME_OPTIONS: string[] = Array.from({ length: 19 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
});

export default function CustomerAppointmentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [vehicles, setVehicles] = useState<VehicleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<AppointmentForm>(emptyForm);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selected, setSelected] = useState<AppointmentRow | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("Customer requested cancellation");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [appointmentsRes, vehiclesRes] = await Promise.all([
      apiRequest<unknown>("/api/appointments?page=1&pageSize=200"),
      apiRequest<unknown>("/api/vehicles?page=1&pageSize=200"),
    ]);

    if (appointmentsRes.error || vehiclesRes.error) {
      setError(appointmentsRes.error ?? vehiclesRes.error ?? "Failed to load appointments.");
    }

    const appointmentRows = unwrapArray<AppointmentRow>(appointmentsRes.data)
      .map(normalizeAppointment)
      .filter((row) => row.id);
    const vehicleOptions = unwrapArray<VehicleRow>(vehiclesRes.data)
      .map(normalizeVehicle)
      .filter((vehicle): vehicle is VehicleOption => vehicle !== null);

    setRows(appointmentRows);
    setVehicles(vehicleOptions);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const vehicleLabel = row.vehicleNumber || vehicles.find((v) => v.id === row.vehicleId)?.label || "";
      const bySearch = !term || `${vehicleLabel} ${row.date ?? ""}`.toLowerCase().includes(term);
      const byStatus = status === "all" || (row.status ?? "").toLowerCase() === status;

      const rowDate = row.date ? new Date(row.date) : null;
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDateValue = dateTo ? new Date(dateTo) : null;

      const byDateFrom = !fromDate || (rowDate && rowDate >= fromDate);
      const byDateTo = !toDateValue || (rowDate && rowDate <= toDateValue);

      return bySearch && byStatus && byDateFrom && byDateTo;
    });
  }, [rows, vehicles, search, status, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const now = new Date();
    const upcoming = filteredRows.filter((row) => row.date && new Date(row.date) >= now);
    const pending = filteredRows.filter((row) => ["pending", "confirmed"].includes((row.status ?? "").toLowerCase()));
    const active = filteredRows.filter((row) => ["inprogress", "confirmed"].includes((row.status ?? "").toLowerCase()));

    const next = [...upcoming].sort((a, b) => new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime())[0];

    return {
      next,
      pendingCount: pending.length,
      activeCount: active.length,
    };
  }, [filteredRows]);

  const createAppointment = async () => {
    if (!form.vehicleId || !form.date || !form.time) {
      setSubmitError("Please select vehicle, date, and time.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    const response = await apiRequest<unknown>("/api/appointments", {
      method: "POST",
      body: JSON.stringify({
        vehicleId: form.vehicleId,
        date: form.date,
        time: toBackendTime(form.time),
        status: "Pending",
      }),
    });

    if (response.error) {
      setSubmitError(response.error);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setFormOpen(false);
    setForm(emptyForm);
    await loadData();
  };

  const cancelAppointment = async () => {
    if (!selected?.id) {
      setCancelError("No appointment selected.");
      return;
    }

    setCancelSubmitting(true);
    setCancelError(null);

    const response = await apiRequest<unknown>(`/api/appointments/${selected.id}/cancel`, {
      method: "PATCH",
      body: JSON.stringify({
        reason: cancelReason.trim() || "Customer requested cancellation",
      }),
    });

    if (response.error) {
      setCancelError(response.error);
      setCancelSubmitting(false);
      return;
    }

    setCancelSubmitting(false);
    setCancelOpen(false);
    setSelected(null);
    setCancelReason("Customer requested cancellation");
    await loadData();
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="My Appointments"
        subtitle="Track your scheduled appointments and service progress."
        actions={
          <button type="button" onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">
            <Plus className="size-4" /> Book Appointment
          </button>
        }
      />

      {loading ? <LoadingState message="Loading appointments..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatMiniCard label="Next Service" value={stats.next ? toDateLabel(stats.next.date) : "-"} icon={<CalendarPlus className="size-5" />} />
            <StatMiniCard label="Pending Requests" value={String(stats.pendingCount)} icon={<CalendarPlus className="size-5" />} />
            <StatMiniCard label="Active Services" value={String(stats.activeCount)} icon={<CalendarPlus className="size-5" />} />
          </div>

          <SectionCard title="Appointments" subtitle="Search by vehicle or date and filter by status.">
            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <SearchInput value={search} onChange={setSearch} placeholder="Search vehicle or date..." />
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm" />
            </div>

            {filteredRows.length === 0 ? (
              <EmptyState title="No appointments found" description="Try clearing filters or booking a new appointment." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Date & Time</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3 text-[#091426]">{row.vehicleNumber || vehicles.find((item) => item.id === row.vehicleId)?.label || "Vehicle unavailable"}</td>
                        <td className="px-4 py-3 text-[#091426]">{formatDateTime(row.date, row.time)}</td>
                        <td className="px-4 py-3"><StatusPill label={row.status ?? "Pending"} /></td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => { setSelected(row); setDetailOpen(true); }} className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]" aria-label="View appointment"><Eye className="size-4" /></button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelected(row);
                                setCancelReason("Customer requested cancellation");
                                setCancelError(null);
                                setCancelOpen(true);
                              }}
                              className="rounded-md border border-[#d5d9e2] p-2 text-[#b91c1c]"
                              aria-label="Cancel appointment"
                            >
                              <XCircle className="size-4" />
                            </button>
                          </div>
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
        title="Book Appointment"
        description="Choose your vehicle and preferred schedule."
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createAppointment}
        submitLabel="Book Appointment"
        isSubmitting={isSubmitting}
        errorMessage={submitError}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-[#45474c] md:col-span-2">
            Vehicle
            <select
              value={form.vehicleId}
              onChange={(event) => setForm((prev) => ({ ...prev, vehicleId: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Date
            <input type="date" value={form.date} onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))} className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Time
            <select
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            >
              <option value="">Select time</option>
              {TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>
      </FormDialog>

      <FormDialog
        title="Appointment Details"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onSubmit={() => setDetailOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-lg"
      >
        {selected ? (
          <div className="space-y-2 text-sm text-[#334155]">
            <p><span className="font-semibold text-[#091426]">Vehicle:</span> {selected.vehicleNumber ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">Date & Time:</span> {formatDateTime(selected.date, selected.time)}</p>
            <p><span className="font-semibold text-[#091426]">Status:</span> {selected.status ?? "Pending"}</p>
            <p className="text-xs text-[#64748b]">Status updates are managed by staff/admin workflow.</p>
          </div>
        ) : null}
      </FormDialog>

      <FormDialog
        title="Cancel Appointment"
        description="Confirm cancellation for this appointment."
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onSubmit={cancelAppointment}
        submitLabel="Cancel Appointment"
        isSubmitting={cancelSubmitting}
        errorMessage={cancelError}
        maxWidthClassName="max-w-md"
      >
        <div className="space-y-3">
          <p className="text-sm text-[#45474c]">
            This action updates appointment status to <span className="font-semibold text-[#091426]">Cancelled</span>.
          </p>
          <label className="space-y-1 text-sm text-[#45474c]">
            Reason
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(event) => setCancelReason(event.target.value)}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
              placeholder="Reason for cancellation"
            />
          </label>
        </div>
      </FormDialog>
    </CustomerShell>
  );
}
