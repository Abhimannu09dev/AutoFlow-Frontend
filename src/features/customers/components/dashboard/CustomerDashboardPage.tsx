"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Car, FileClock, MessageSquareText, ShoppingCart, Star, Wrench } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";
import { ROUTES } from "@/config/routes";

import { StatMiniCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, formatCurrency, toDateLabel, unwrapArray, unwrapObject } from "../shared/customer-api";
import type { AppointmentRow, PartRequestRow, PredictionRow, PurchaseRow, ReviewRow, VehicleRow } from "../shared/customer.types";

type DashboardState = {
  vehicles: VehicleRow[];
  appointments: AppointmentRow[];
  purchases: PurchaseRow[];
  partRequests: PartRequestRow[];
  reviews: ReviewRow[];
  predictions: PredictionRow[];
  customerId: string | null;
};

const defaultState: DashboardState = {
  vehicles: [],
  appointments: [],
  purchases: [],
  partRequests: [],
  reviews: [],
  predictions: [],
  customerId: null,
};

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const profileRes = await apiRequest<Record<string, unknown>>("/api/customer/profile");
    const profile = unwrapObject<{ id?: unknown }>(profileRes.data, {});
    const customerId = String(profile.id ?? "").trim() || null;

    const [vehiclesRes, appointmentsRes, purchasesRes, requestsRes, reviewsRes] = await Promise.all([
      apiRequest<unknown>("/api/vehicles?page=1&pageSize=100"),
      apiRequest<unknown>("/api/appointments?page=1&pageSize=100"),
      apiRequest<unknown>("/api/customer/purchases"),
      apiRequest<unknown>("/api/parts-requests?page=1&pageSize=100"),
      apiRequest<unknown>("/api/reviews?page=1&pageSize=100"),
    ]);

    let predictions: PredictionRow[] = [];
    if (customerId) {
      const predictionsRes = await apiRequest<unknown>(`/api/predictions/${customerId}`);
      predictions = unwrapArray<PredictionRow>(predictionsRes.data);
    }

    const mergedError =
      profileRes.error ??
      vehiclesRes.error ??
      appointmentsRes.error ??
      purchasesRes.error ??
      requestsRes.error ??
      reviewsRes.error;

    if (mergedError) {
      setError(mergedError);
    }

    setState({
      customerId,
      vehicles: unwrapArray<VehicleRow>(vehiclesRes.data),
      appointments: unwrapArray<AppointmentRow>(appointmentsRes.data),
      purchases: unwrapArray<PurchaseRow>(purchasesRes.data),
      partRequests: unwrapArray<PartRequestRow>(requestsRes.data),
      reviews: unwrapArray<ReviewRow>(reviewsRes.data),
      predictions,
    });

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const appointmentStats = useMemo(() => {
    const now = new Date();
    const upcoming = state.appointments.filter((item) => {
      const date = item.date ? new Date(item.date) : null;
      return !!date && !Number.isNaN(date.getTime()) && date >= now;
    });

    const pending = state.appointments.filter((item) => {
      const status = (item.status ?? "").toLowerCase();
      return status === "pending" || status === "confirmed";
    }).length;

    const next = upcoming.sort((a, b) => new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime())[0];

    return {
      count: upcoming.length,
      pending,
      next,
    };
  }, [state.appointments]);

  const recentPurchases = useMemo(() => {
    return [...state.purchases]
      .sort((a, b) => new Date(b.saleDate ?? b.createdAt ?? "").getTime() - new Date(a.saleDate ?? a.createdAt ?? "").getTime())
      .slice(0, 4);
  }, [state.purchases]);

  const recentPartRequests = useMemo(() => {
    return [...state.partRequests]
      .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
      .slice(0, 4);
  }, [state.partRequests]);

  const pendingPartRequestCount = useMemo(() => {
    return state.partRequests.filter((item) => (item.status ?? "").toLowerCase() === "pending").length;
  }, [state.partRequests]);

  const maintenanceSummary = useMemo(() => {
    let issueCount = 0;
    let highSeverity = 0;

    for (const row of state.predictions) {
      for (const issue of row.predictedFailures ?? []) {
        issueCount += 1;
        const severity = (issue.severity ?? "").toLowerCase();
        if (severity.includes("high") || severity.includes("critical")) {
          highSeverity += 1;
        }
      }
    }

    return { issueCount, highSeverity };
  }, [state.predictions]);

  const quickActions = (
    <div className="flex flex-wrap gap-2">
      <Link href={ROUTES.customer.appointments} className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white">Book Appointment</Link>
      <Link href={ROUTES.customer.vehicles} className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-semibold text-[#091426]">Add Vehicle</Link>
      <Link href={ROUTES.customer.partRequests} className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-semibold text-[#091426]">Request Part</Link>
      <Link href={ROUTES.customer.reviews} className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-semibold text-[#091426]">Write Review</Link>
    </div>
  );

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your appointments, vehicles, purchases, and requests."
        actions={quickActions}
      />

      {isLoading ? <LoadingState message="Loading customer dashboard..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={loadDashboard} /> : null}

      {!isLoading && !error ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatMiniCard label="My Vehicles" value={String(state.vehicles.length)} icon={<Car className="size-5" />} />
            <StatMiniCard label="Upcoming Appointments" value={String(appointmentStats.count)} icon={<CalendarClock className="size-5" />} />
            <StatMiniCard label="Pending Appointments" value={String(appointmentStats.pending)} icon={<FileClock className="size-5" />} />
            <StatMiniCard label="Recent Purchases" value={String(state.purchases.length)} icon={<ShoppingCart className="size-5" />} />
            <StatMiniCard label="Pending Part Requests" value={String(pendingPartRequestCount)} icon={<Wrench className="size-5" />} />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5 xl:col-span-2">
              <h2 className="text-lg font-semibold text-[#091426]">Upcoming Appointment</h2>
              {appointmentStats.next ? (
                <div className="mt-3 rounded-lg bg-[#f5f3f4] p-4">
                  <p className="text-sm font-semibold text-[#091426]">{appointmentStats.next.vehicleNumber ?? "Vehicle appointment"}</p>
                  <p className="mt-1 text-sm text-[#45474c]">
                    {toDateLabel(appointmentStats.next.date)} {appointmentStats.next.time ? `at ${appointmentStats.next.time}` : ""}
                  </p>
                  <div className="mt-3"><StatusPill label={appointmentStats.next.status ?? "Pending"} /></div>
                </div>
              ) : (
                <EmptyState title="No upcoming appointment" description="Book your next service appointment to see it here." />
              )}
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
              <h2 className="text-lg font-semibold text-[#091426]">Prediction Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-[#45474c]">
                <p>Total predicted issues: <span className="font-semibold text-[#091426]">{maintenanceSummary.issueCount}</span></p>
                <p>High severity alerts: <span className="font-semibold text-[#b91c1c]">{maintenanceSummary.highSeverity}</span></p>
              </div>
              {maintenanceSummary.issueCount === 0 ? (
                <p className="mt-3 text-xs text-[#64748b]">No prediction data available yet.</p>
              ) : null}
              <Link href={ROUTES.customer.predictions} className="mt-4 inline-flex text-sm font-semibold text-[#006a61]">View maintenance predictions</Link>
            </section>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
              <h3 className="text-base font-semibold text-[#091426]">My Vehicles</h3>
              <div className="mt-3 space-y-2">
                {state.vehicles.slice(0, 3).map((vehicle) => (
                  <div key={vehicle.id} className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm">
                    <p className="font-semibold text-[#091426]">{vehicle.brand} {vehicle.model}</p>
                    <p className="text-[#64748b]">{vehicle.vehicleNumber ?? "No plate"} • {vehicle.year ?? "-"}</p>
                  </div>
                ))}
                {state.vehicles.length === 0 ? <p className="text-sm text-[#64748b]">No vehicles added yet.</p> : null}
              </div>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
              <h3 className="text-base font-semibold text-[#091426]">Recent Purchases</h3>
              <div className="mt-3 space-y-2">
                {recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm">
                    <p className="font-semibold text-[#091426]">{purchase.invoiceNumber ?? purchase.id}</p>
                    <p className="text-[#64748b]">{toDateLabel(purchase.saleDate)} • {formatCurrency(purchase.totalAmount)}</p>
                  </div>
                ))}
                {recentPurchases.length === 0 ? <p className="text-sm text-[#64748b]">No purchases found.</p> : null}
              </div>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
              <h3 className="text-base font-semibold text-[#091426]">Recent Part Requests</h3>
              <div className="mt-3 space-y-2">
                {recentPartRequests.map((request) => (
                  <div key={request.id} className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm">
                    <p className="font-semibold text-[#091426]">{request.partName ?? "Part Request"}</p>
                    <div className="mt-1 flex items-center justify-between text-[#64748b]">
                      <span>Qty {request.quantity ?? 0}</span>
                      <StatusPill label={request.status ?? "Pending"} />
                    </div>
                  </div>
                ))}
                {recentPartRequests.length === 0 ? <p className="text-sm text-[#64748b]">No part requests submitted.</p> : null}
              </div>
            </section>
          </div>

          <section className="rounded-xl border border-[#c5c6cd] bg-white p-5">
            <h3 className="text-base font-semibold text-[#091426]">Quick Feedback</h3>
            <p className="mt-2 text-sm text-[#64748b]">You have submitted {state.reviews.length} review{state.reviews.length === 1 ? "" : "s"}.</p>
            <div className="mt-3 flex items-center gap-2 text-[#f59e0b]">
              <Star className="size-4 fill-current" />
              <span className="text-sm text-[#091426]">Keep sharing feedback to improve service quality.</span>
            </div>
            <Link href={ROUTES.customer.reviews} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#006a61]">
              <MessageSquareText className="size-4" /> Manage Reviews
            </Link>
          </section>
        </div>
      ) : null}
    </CustomerShell>
  );
}
