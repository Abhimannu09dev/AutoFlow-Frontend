"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { CalendarPlus } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/config/routes";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

import { SectionCard, StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, formatDateTime, toDateLabel, unwrapArray } from "../shared/customer-api";
import type { AppointmentRow } from "../shared/customer.types";

export default function CustomerServicesPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selected, setSelected] = useState<AppointmentRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiRequest<unknown>("/api/customer/services");
    if (response.error) {
      setError(response.error);
    }

    setRows(unwrapArray<AppointmentRow>(response.data));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const byVehicle = vehicleFilter === "all" || String(row.vehicleNumber ?? "").toLowerCase() === vehicleFilter;
      const byStatus = statusFilter === "all" || String(row.status ?? "").toLowerCase() === statusFilter;

      const date = row.date ? new Date(row.date) : null;
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;

      const byFrom = !from || (date && date >= from);
      const byTo = !to || (date && date <= to);

      return byVehicle && byStatus && byFrom && byTo;
    });
  }, [rows, vehicleFilter, statusFilter, dateFrom, dateTo]);

  const vehicleOptions = useMemo(() => {
    return ["all", ...new Set(rows.map((row) => String(row.vehicleNumber ?? "").trim()).filter(Boolean))];
  }, [rows]);

  const stats = useMemo(() => {
    const completed = filtered.filter((row) => (row.status ?? "").toLowerCase() === "completed").length;
    const active = filtered.filter((row) => ["inprogress", "confirmed"].includes((row.status ?? "").toLowerCase())).length;
    const cancelled = filtered.filter((row) => (row.status ?? "").toLowerCase() === "cancelled").length;

    const next = [...filtered]
      .filter((row) => row.date && new Date(row.date) >= new Date())
      .sort((a, b) => new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime())[0];

    return { completed, active, cancelled, next };
  }, [filtered]);

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="Service History"
        subtitle="Manage and track your purchase history and past vehicle services."
        actions={
          <Link href={ROUTES.customer.appointments} className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">
            <CalendarPlus className="size-4" /> Book New Appointment
          </Link>
        }
      />

      {loading ? <LoadingState message="Loading service history..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadData} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatMiniCard label="Completed Services" value={String(stats.completed)} />
            <StatMiniCard label="Active Services" value={String(stats.active)} />
            <StatMiniCard label="Cancelled Services" value={String(stats.cancelled)} />
            <StatMiniCard label="Next Service" value={stats.next ? toDateLabel(stats.next.date) : "-"} />
          </div>

          <SectionCard title="Service Records" subtitle="Filter by vehicle, status, and date range.">
            <div className="mb-4 grid gap-3 md:grid-cols-4">
              <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value.toLowerCase())} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
                {vehicleOptions.map((option) => (
                  <option key={option} value={option.toLowerCase()}>{option === "all" ? "All Vehicles" : option}</option>
                ))}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm">
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

            {filtered.length === 0 ? (
              <EmptyState title="No services found" description="No service history records match your filters." />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Service Type / Notes</th>
                      <th className="px-4 py-3 font-semibold">Date & Time</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3 text-[#091426]">{row.vehicleNumber ?? "Vehicle"}</td>
                        <td className="px-4 py-3 text-[#091426]">General Service</td>
                        <td className="px-4 py-3 text-[#091426]">{formatDateTime(row.date, row.time)}</td>
                        <td className="px-4 py-3"><StatusPill label={row.status ?? "Pending"} /></td>
                        <td className="px-4 py-3 text-right">
                          <button type="button" onClick={() => { setSelected(row); setViewOpen(true); }} className="text-xs font-semibold text-[#006a61]">View Detail</button>
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
        title="Service Detail"
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        onSubmit={() => setViewOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-lg"
      >
        {selected ? (
          <div className="space-y-2 text-sm text-[#334155]">
            <p><span className="font-semibold text-[#091426]">Vehicle:</span> {selected.vehicleNumber ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">Date & Time:</span> {formatDateTime(selected.date, selected.time)}</p>
            <p><span className="font-semibold text-[#091426]">Status:</span> {selected.status ?? "-"}</p>
          </div>
        ) : null}
      </FormDialog>
    </CustomerShell>
  );
}
