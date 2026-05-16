"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CalendarPlus, Wrench } from "lucide-react";

import { ROUTES } from "@/config/routes";
import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";
import SearchInput from "@/shared/components/ui/SearchInput";

import { SectionCard, StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, unwrapArray, unwrapObject } from "../shared/customer-api";
import type { CustomerProfile, PredictionFailure, PredictionRow } from "../shared/customer.types";

type FlattenedPrediction = {
  id: string;
  vehicleName: string;
  vehicleNumber: string;
  partName: string;
  reason: string;
  severity: string;
  recommendedAction: string;
};

export default function CustomerPredictionsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");

  const loadPredictions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const profileRes = await apiRequest<unknown>("/api/customer/profile");
    if (profileRes.error) {
      setError(profileRes.error);
      setLoading(false);
      return;
    }

    const profile = unwrapObject<CustomerProfile>(profileRes.data, {
      id: "",
      fullName: "",
      email: "",
    });

    if (!profile.id) {
      setRows([]);
      setLoading(false);
      return;
    }

    const response = await apiRequest<unknown>(`/api/predictions/${profile.id}`);
    if (response.error) {
      setError(response.error);
    }

    setRows(unwrapArray<PredictionRow>(response.data));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const flattenedRows = useMemo(() => {
    const data: FlattenedPrediction[] = [];

    for (const row of rows) {
      const vehicleName = `${row.brand ?? ""} ${row.model ?? ""}`.trim() || "Vehicle";
      const vehicleNumber = row.vehicleNumber ?? "-";
      const failures = Array.isArray(row.predictedFailures) ? row.predictedFailures : [];

      for (const failure of failures) {
        const mapped = failure as PredictionFailure;
        data.push({
          id: `${row.vehicleId}-${mapped.partName}-${mapped.reason}`,
          vehicleName,
          vehicleNumber,
          partName: mapped.partName ?? "Unknown Part",
          reason: mapped.reason ?? "No reason provided",
          severity: mapped.severity ?? "Medium",
          recommendedAction: mapped.recommendedAction ?? "Schedule inspection",
        });
      }
    }

    return data;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return flattenedRows.filter((row) => {
      const bySearch =
        !term ||
        [row.vehicleName, row.vehicleNumber, row.partName, row.reason, row.recommendedAction]
          .join(" ")
          .toLowerCase()
          .includes(term);
      const byVehicle = vehicleFilter === "all" || row.vehicleNumber === vehicleFilter;
      return bySearch && byVehicle;
    });
  }, [flattenedRows, search, vehicleFilter]);

  const vehicleOptions = useMemo(() => {
    return ["all", ...new Set(flattenedRows.map((row) => row.vehicleNumber).filter(Boolean))];
  }, [flattenedRows]);

  const stats = useMemo(() => {
    const highSeverity = filteredRows.filter((row) => {
      const severity = row.severity.toLowerCase();
      return severity.includes("high") || severity.includes("critical");
    }).length;

    return {
      vehicles: rows.length,
      predictions: filteredRows.length,
      highSeverity,
    };
  }, [rows.length, filteredRows]);

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="Vehicle Predictions"
        subtitle="AI-based maintenance predictions from your current vehicle mileage and service patterns."
        actions={
          <Link href={ROUTES.customer.appointments} className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">
            <CalendarPlus className="size-4" /> Book Appointment
          </Link>
        }
      />

      {loading ? <LoadingState message="Loading predictions..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadPredictions} /> : null}

      {!loading && !error ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatMiniCard label="Vehicles Analysed" value={String(stats.vehicles)} />
            <StatMiniCard label="Predicted Issues" value={String(stats.predictions)} />
            <StatMiniCard label="High Severity Alerts" value={String(stats.highSeverity)} accent="text-[#b91c1c]" />
          </div>

          <SectionCard title="Predicted Maintenance Needs" subtitle="Use this report to proactively schedule maintenance.">
            <div className="mb-4 grid gap-3 md:grid-cols-[1fr_220px]">
              <SearchInput value={search} onChange={setSearch} placeholder="Search by vehicle, issue, or reason..." />
              <select
                value={vehicleFilter}
                onChange={(event) => setVehicleFilter(event.target.value)}
                className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm"
              >
                {vehicleOptions.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All Vehicles" : option}
                  </option>
                ))}
              </select>
            </div>

            {filteredRows.length === 0 ? (
              <EmptyState
                title="No prediction data available"
                description="No predictive maintenance issues were returned from the current API."
              />
            ) : (
              <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
                <table className="min-w-full text-sm">
                  <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Vehicle</th>
                      <th className="px-4 py-3 font-semibold">Part / Issue</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                      <th className="px-4 py-3 font-semibold">Severity</th>
                      <th className="px-4 py-3 font-semibold">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#eceef3]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#091426]">{row.vehicleName}</p>
                          <p className="text-xs text-[#64748b]">{row.vehicleNumber}</p>
                        </td>
                        <td className="px-4 py-3 text-[#091426]">{row.partName}</td>
                        <td className="px-4 py-3 text-[#091426]">{row.reason}</td>
                        <td className="px-4 py-3">
                          <StatusPill label={row.severity} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-start gap-2 text-[#091426]">
                            <Wrench className="mt-0.5 size-4 text-[#006a61]" />
                            <span>{row.recommendedAction}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>

          {stats.highSeverity > 0 ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fff1f2] p-3 text-sm text-[#9f1239]">
              <div className="inline-flex items-center gap-2 font-semibold">
                <AlertTriangle className="size-4" /> High-severity maintenance items detected.
              </div>
              <p className="mt-1">Schedule an appointment soon to prevent potential breakdowns.</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </CustomerShell>
  );
}
