"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarPlus, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/config/routes";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import ConfirmDialog from "@/shared/components/ui/ConfirmDialog";
import EmptyState from "@/shared/components/ui/EmptyState";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";
import SearchInput from "@/shared/components/ui/SearchInput";

import { SectionCard, StatusPill } from "../common/PortalPrimitives";
import { apiRequest, toNumber, unwrapArray } from "../shared/customer-api";
import type { VehicleRow } from "../shared/customer.types";

type VehicleFormState = {
  vehicleNumber: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
  vin: string;
};

const emptyVehicleForm: VehicleFormState = {
  vehicleNumber: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  color: "",
  vin: "",
};

export default function CustomerVehiclesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [formState, setFormState] = useState<VehicleFormState>(emptyVehicleForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRow | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiRequest<unknown>("/api/vehicles?page=1&pageSize=200");
    if (response.error) {
      setError(response.error);
    }

    setRows(unwrapArray<VehicleRow>(response.data));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const bySearch =
        !term ||
        [row.vehicleNumber, row.brand, row.model, row.vin]
          .map((value) => String(value ?? "").toLowerCase())
          .some((value) => value.includes(term));

      const byBrand = brandFilter === "all" || String(row.brand ?? "").toLowerCase() === brandFilter;
      const byYear = yearFilter === "all" || String(row.year ?? "") === yearFilter;
      return bySearch && byBrand && byYear;
    });
  }, [rows, search, brandFilter, yearFilter]);

  const brandOptions = useMemo(() => {
    return ["all", ...new Set(rows.map((row) => String(row.brand ?? "").trim()).filter(Boolean))];
  }, [rows]);

  const yearOptions = useMemo(() => {
    return ["all", ...new Set(rows.map((row) => String(row.year ?? "").trim()).filter(Boolean))];
  }, [rows]);

  const openCreate = () => {
    setEditingId(null);
    setFormState(emptyVehicleForm);
    setSubmitError(null);
    setFormOpen(true);
  };

  const openEdit = (row: VehicleRow) => {
    setEditingId(row.id);
    setFormState({
      vehicleNumber: row.vehicleNumber ?? "",
      brand: row.brand ?? "",
      model: row.model ?? "",
      year: String(row.year ?? ""),
      mileage: String(row.mileage ?? 0),
      color: row.color ?? "",
      vin: row.vin ?? "",
    });
    setSubmitError(null);
    setFormOpen(true);
  };

  const submitVehicle = async () => {
    if (!formState.vehicleNumber.trim() || !formState.brand.trim() || !formState.model.trim() || !formState.year.trim()) {
      setSubmitError("Vehicle number, brand, model, and year are required.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      vehicleNumber: formState.vehicleNumber.trim(),
      brand: formState.brand.trim(),
      model: formState.model.trim(),
      year: Number(formState.year),
      mileage: toNumber(formState.mileage, 0),
      color: formState.color.trim() || null,
      vin: formState.vin.trim() || null,
    };

    const response = await apiRequest<unknown>(editingId ? `/api/vehicles/${editingId}` : "/api/vehicles", {
      method: editingId ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });

    if (response.error) {
      setSubmitError(response.error);
      setIsSubmitting(false);
      return;
    }

    setFormOpen(false);
    setIsSubmitting(false);
    await loadVehicles();
  };

  const deleteVehicle = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const response = await apiRequest<unknown>(`/api/vehicles/${deleteId}`, { method: "DELETE" });
    if (response.error) {
      setError(response.error);
    }

    setIsDeleting(false);
    setDeleteId(null);
    await loadVehicles();
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title="My Vehicles"
        subtitle="Manage your garage and schedule maintenance for your cars."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="size-4" /> Add Vehicle
          </button>
        }
      />

      {loading ? <LoadingState message="Loading vehicles..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadVehicles} /> : null}

      {!loading && !error ? (
        <SectionCard title="Vehicle List" subtitle="Search by plate, brand, model, or VIN.">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_180px_180px]">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by VIN or plate..." />
            <select
              value={brandFilter}
              onChange={(event) => setBrandFilter(event.target.value.toLowerCase())}
              className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm text-[#1b1b1d]"
            >
              {brandOptions.map((option) => (
                <option key={option} value={option.toLowerCase()}>{option === "all" ? "All Brands" : option}</option>
              ))}
            </select>
            <select
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
              className="rounded-lg border border-[#c5c6cd] bg-white px-3 py-2 text-sm text-[#1b1b1d]"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>{option === "all" ? "All Years" : option}</option>
              ))}
            </select>
          </div>

          {filteredRows.length === 0 ? (
            <EmptyState title="No vehicles found" description="Try adjusting filters or add a new vehicle." />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#d9dce3]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f5f3f4] text-left text-[#45474c]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Vehicle</th>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold">Mileage</th>
                    <th className="px-4 py-3 font-semibold">VIN</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id} className="border-t border-[#eceef3]">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#091426]">{row.brand} {row.model}</p>
                        <p className="text-xs text-[#64748b]">{row.vehicleNumber ?? "No plate"} • {row.color ?? "No color"}</p>
                      </td>
                      <td className="px-4 py-3 text-[#091426]">{row.year ?? "-"}</td>
                      <td className="px-4 py-3 text-[#091426]">{toNumber(row.mileage, 0).toLocaleString()} km</td>
                      <td className="px-4 py-3 text-[#091426]">{row.vin ?? "-"}</td>
                      <td className="px-4 py-3"><StatusPill label="Active" /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => { setSelectedVehicle(row); setDetailsOpen(true); }} aria-label="View vehicle" className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]"><Eye className="size-4" /></button>
                          <button type="button" onClick={() => openEdit(row)} aria-label="Edit vehicle" className="rounded-md border border-[#d5d9e2] p-2 text-[#334155]"><Pencil className="size-4" /></button>
                          <button type="button" onClick={() => setDeleteId(row.id)} aria-label="Delete vehicle" className="rounded-md border border-[#fecaca] p-2 text-[#b91c1c]"><Trash2 className="size-4" /></button>
                          <button type="button" onClick={() => router.push(ROUTES.customer.appointments)} aria-label="Book appointment" className="rounded-md border border-[#d5d9e2] p-2 text-[#006a61]"><CalendarPlus className="size-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      ) : null}

      <FormDialog
        title={editingId ? "Edit Vehicle" : "Add Vehicle"}
        description="Update your vehicle details."
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={submitVehicle}
        submitLabel={editingId ? "Save Changes" : "Add Vehicle"}
        isSubmitting={isSubmitting}
        errorMessage={submitError}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1 text-sm text-[#45474c]">
            Vehicle Number
            <input className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.vehicleNumber} onChange={(e) => setFormState((p) => ({ ...p, vehicleNumber: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Brand
            <input className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.brand} onChange={(e) => setFormState((p) => ({ ...p, brand: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Model
            <input className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.model} onChange={(e) => setFormState((p) => ({ ...p, model: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Year
            <input type="number" className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.year} onChange={(e) => setFormState((p) => ({ ...p, year: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Mileage
            <input type="number" className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.mileage} onChange={(e) => setFormState((p) => ({ ...p, mileage: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Color
            <input className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.color} onChange={(e) => setFormState((p) => ({ ...p, color: e.target.value }))} />
          </label>
          <label className="space-y-1 text-sm text-[#45474c] md:col-span-2">
            VIN
            <input className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2" value={formState.vin} onChange={(e) => setFormState((p) => ({ ...p, vin: e.target.value }))} />
          </label>
        </div>
      </FormDialog>

      <FormDialog
        title="Vehicle Details"
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onSubmit={() => setDetailsOpen(false)}
        submitLabel="Close"
        maxWidthClassName="max-w-lg"
      >
        {selectedVehicle ? (
          <div className="grid gap-2 text-sm text-[#334155]">
            <p><span className="font-semibold text-[#091426]">Vehicle:</span> {selectedVehicle.brand} {selectedVehicle.model}</p>
            <p><span className="font-semibold text-[#091426]">Plate:</span> {selectedVehicle.vehicleNumber ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">Year:</span> {selectedVehicle.year ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">Mileage:</span> {toNumber(selectedVehicle.mileage, 0).toLocaleString()} km</p>
            <p><span className="font-semibold text-[#091426]">Color:</span> {selectedVehicle.color ?? "-"}</p>
            <p><span className="font-semibold text-[#091426]">VIN:</span> {selectedVehicle.vin ?? "-"}</p>
          </div>
        ) : null}
      </FormDialog>

      <ConfirmDialog
        title="Delete Vehicle"
        description="This action will remove the vehicle from your garage."
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteVehicle}
        isPending={isDeleting}
        confirmLabel="Delete"
      />
    </CustomerShell>
  );
}
