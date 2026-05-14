"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { CarFront, ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, FormDialog, Input, LoadingState, Modal, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray } from "../shared/staff-api";
import type { CustomerRow, VehicleRow } from "../shared/staff.types";

type VehicleFormState = {
  vehicleNumber: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
  vin: string;
  ownerUserId: string;
};

const defaultForm: VehicleFormState = {
  vehicleNumber: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  color: "",
  vin: "",
  ownerUserId: "",
};

const pageSize = 5;

function readRecordString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return "";
}

function readRecordNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function normalizeVehicleRecord(raw: unknown): VehicleRow {
  const record = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const year = readRecordNumber(record, ["year", "Year"]);
  const mileage = readRecordNumber(record, ["mileage", "Mileage"]);
  return {
    id: readRecordString(record, ["id", "Id"]),
    vehicleNumber: readRecordString(record, ["vehicleNumber", "VehicleNumber"]),
    brand: readRecordString(record, ["brand", "Brand"]),
    model: readRecordString(record, ["model", "Model"]),
    year: year ?? undefined,
    mileage: mileage ?? undefined,
    color: readRecordString(record, ["color", "Color"]),
    vin: readRecordString(record, ["vin", "VIN", "Vin"]),
    userId: readRecordString(record, ["userId", "UserId"]),
    customerId: readRecordString(record, ["customerId", "CustomerId"]),
    applicationUserId: readRecordString(record, ["applicationUserId", "ApplicationUserId"]),
    ownerId: readRecordString(record, ["ownerId", "OwnerId"]),
    ownerName: readRecordString(record, ["ownerName", "OwnerName"]) || undefined,
    createdAt: readRecordString(record, ["createdAt", "CreatedAt"]),
  };
}

export default function StaffVehiclesManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<VehicleRow[]>([]);
  const [customers, setCustomers] = useState<CustomerRow[]>([]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<VehicleRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleFormState>(defaultForm);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [vehiclesResult, customersResult] = await Promise.all([
      apiRequest<VehicleRow[]>("/api/vehicles?page=1&pageSize=500"),
      apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=500"),
    ]);

    if (vehiclesResult.error) {
      setRows([]);
      setError(vehiclesResult.error);
    } else {
      setRows(unwrapArray<VehicleRow>(vehiclesResult.data).map((item) => normalizeVehicleRecord(item)));
    }

    setCustomers(unwrapArray<CustomerRow>(customersResult.data));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const ownerNameByCustomerId = useMemo(() => {
    return new Map(customers.map((customer) => [customer.id.toLowerCase(), customer.fullName]));
  }, [customers]);

  const ownerNameByUserId = useMemo(() => {
    return new Map(
      customers
        .filter((customer) => Boolean(customer.applicationUserId))
        .map((customer) => [String(customer.applicationUserId).toLowerCase(), customer.fullName])
    );
  }, [customers]);

  const resolvedRows = useMemo(() => {
    return rows.map((row) => {
      const ownerKey = (row.userId ?? row.applicationUserId ?? row.customerId ?? row.ownerId ?? "");
      const ownerKeyLower = ownerKey.toLowerCase();
      const ownerName =
        ownerNameByUserId.get(ownerKeyLower) ||
        ownerNameByCustomerId.get(ownerKeyLower) ||
        (row.ownerName ?? "");

      return {
        ...row,
        ownerDisplay: ownerName.length > 0 ? ownerName : "Owner unavailable",
        ownerRef: ownerKey,
      };
    });
  }, [ownerNameByCustomerId, ownerNameByUserId, rows]);

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    if (!lowered) return resolvedRows;

    return resolvedRows.filter((row) => {
      const vehicleLabel = `${row.brand ?? ""} ${row.model ?? ""}`.toLowerCase();
      return (
        (row.vehicleNumber ?? "").toLowerCase().includes(lowered) ||
        (row.vin ?? "").toLowerCase().includes(lowered) ||
        vehicleLabel.includes(lowered) ||
        String(row.year ?? "").toLowerCase().includes(lowered) ||
        row.ownerDisplay.toLowerCase().includes(lowered)
      );
    });
  }, [query, resolvedRows]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const onCreateVehicle = async () => {
    if (!form.vehicleNumber.trim()) {
      setModalError("Vehicle Number is required.");
      return;
    }
    if (!form.brand.trim() || !form.model.trim()) {
      setModalError("Make and Model are required.");
      return;
    }
    if (!form.year.trim()) {
      setModalError("Year is required.");
      return;
    }
    if (!form.ownerUserId.trim()) {
      setModalError("Owner selection is required.");
      return;
    }

    setSubmitting(true);
    setModalError(null);

    const payload = {
      vehicleNumber: form.vehicleNumber.trim(),
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      mileage: Number(form.mileage || "0"),
      color: form.color.trim() || null,
      vin: form.vin.trim() || null,
      ownerUserId: form.ownerUserId,
    };

    const result = await apiRequest<VehicleRow>("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setSubmitting(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setForm(defaultForm);
    setOpenCreateModal(false);
    await load();
  };

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#091426]">Vehicle Management</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage workshop vehicles and owner records.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setForm(defaultForm);
              setOpenCreateModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-6 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Vehicle
          </button>
        </header>

        <section className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-4">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search by VIN, plate, make, model, year, or owner"
          />
        </section>

        {loading ? <LoadingState message="Loading vehicles..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-xl border border-[#c5c6cd] bg-[#fbf8fa]">
            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No vehicles found" description="No vehicles match your search." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1120px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs font-semibold uppercase tracking-[0.08em] text-[#45474c]">
                      <th className="px-4 py-3">Vehicle</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Mileage</th>
                      <th className="px-4 py-3">VIN</th>
                      <th className="px-4 py-3">Owner</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#d9d7d8] text-sm text-[#1b1b1d]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[#1e293b] text-white">
                              <CarFront className="size-4" />
                            </span>
                            <div>
                              <p className="font-medium">{row.vehicleNumber ?? "-"}</p>
                              <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">ID: #{row.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium">{row.brand ?? "-"} {row.model ?? ""}</p>
                          <p className="text-sm text-[#45474c]">{toNumber(row.year, 0) > 0 ? row.year : "-"} • {row.color ?? "N/A"}</p>
                        </td>
                        <td className="px-4 py-4">{toNumber(row.mileage).toLocaleString()} mi</td>
                        <td className="px-4 py-4 break-all">{row.vin ?? "-"}</td>
                        <td className="px-4 py-4">
                          <p className="font-medium">{row.ownerDisplay}</p>
                          <p className="text-xs text-[#64748b]">{row.ownerRef || "Unlinked"}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button
                            type="button"
                            title="View vehicle"
                            aria-label="View vehicle details"
                            onClick={() => {
                              setSelectedRow(row);
                              setOpenViewModal(true);
                            }}
                            className="rounded-md p-2 text-[#45474c] hover:bg-[#ece9ea]"
                          >
                            <Eye className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[#c5c6cd] bg-white px-4 py-3 text-sm text-[#45474c]">
              <p>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} vehicles
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-[#c5c6cd] p-2 disabled:opacity-50"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-[#c5c6cd] p-2 disabled:opacity-50"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      <FormDialog
        title="Add Vehicle"
        description="Register a vehicle for service operations."
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={() => void onCreateVehicle()}
        submitLabel="Save Vehicle"
        isSubmitting={submitting}
        errorMessage={modalError}
        headerIcon={<CarFront className="size-5" />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="License Plate"
            value={form.vehicleNumber}
            onChange={(event) => setForm((prev) => ({ ...prev, vehicleNumber: event.target.value }))}
            placeholder="ABC-1234"
          />
          <Input
            label="VIN"
            value={form.vin}
            onChange={(event) => setForm((prev) => ({ ...prev, vin: event.target.value }))}
            placeholder="1HGCM82633A004352"
          />
          <Input
            label="Make"
            value={form.brand}
            onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
            placeholder="Toyota"
          />
          <Input
            label="Model"
            value={form.model}
            onChange={(event) => setForm((prev) => ({ ...prev, model: event.target.value }))}
            placeholder="Camry"
          />
          <Input
            label="Year"
            type="number"
            value={form.year}
            onChange={(event) => setForm((prev) => ({ ...prev, year: event.target.value }))}
            placeholder="2024"
          />
          <Input
            label="Mileage"
            type="number"
            value={form.mileage}
            onChange={(event) => setForm((prev) => ({ ...prev, mileage: event.target.value }))}
            placeholder="0"
          />
          <Input
            label="Color"
            value={form.color}
            onChange={(event) => setForm((prev) => ({ ...prev, color: event.target.value }))}
            placeholder="Silver"
          />
          <label className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">Owner</span>
            <select
              value={form.ownerUserId}
              onChange={(event) => setForm((prev) => ({ ...prev, ownerUserId: event.target.value }))}
              className="w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a]"
            >
              <option value="">Select owner</option>
              {customers.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.applicationUserId ?? ""}
                  disabled={!customer.applicationUserId}
                >
                  {customer.fullName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </FormDialog>

      <Modal
        title="Vehicle Details"
        open={openViewModal}
        onClose={() => {
          setOpenViewModal(false);
          setSelectedRow(null);
        }}
        footer={(
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setOpenViewModal(false);
                setSelectedRow(null);
              }}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Close
            </button>
          </div>
        )}
      >
        {selectedRow ? (
          <div className="space-y-3 text-sm text-[#1b1b1d]">
            <p><span className="font-semibold">License Plate:</span> {selectedRow.vehicleNumber ?? "-"}</p>
            <p><span className="font-semibold">Make / Model:</span> {selectedRow.brand ?? "-"} {selectedRow.model ?? ""}</p>
            <p><span className="font-semibold">Year:</span> {selectedRow.year ?? "-"}</p>
            <p><span className="font-semibold">Mileage:</span> {toNumber(selectedRow.mileage).toLocaleString()} mi</p>
            <p><span className="font-semibold">VIN:</span> {selectedRow.vin ?? "-"}</p>
            <p><span className="font-semibold">Owner:</span> {selectedRow.ownerDisplay ?? "-"}</p>
            <p><span className="font-semibold">Owner Ref:</span> {selectedRow.ownerRef ?? "-"}</p>
            <p><span className="font-semibold">Created:</span> {toDateLabel(selectedRow.createdAt)}</p>
          </div>
        ) : null}
      </Modal>
    </StaffShell>
  );
}
