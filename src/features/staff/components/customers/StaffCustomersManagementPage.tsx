"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { CarFront, Eye, Mail, Phone, Plus, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import StaffShell from "@/shared/components/layout/StaffShell";
import { EmptyState, ErrorState, FormDialog, Input, LoadingState, Modal, SearchInput } from "@/shared/components/ui";

import { apiRequest, toDateLabel, toNumber, unwrapArray, unwrapData } from "../shared/staff-api";
import type { CustomerRow, VehicleRow } from "../shared/staff.types";

type VehicleDraft = {
  vehicleNumber: string;
  vin: string;
  brand: string;
  model: string;
  year: string;
  mileage: string;
  color: string;
};

type CustomerFormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createLoginAccount: boolean;
  vehicle: VehicleDraft;
};

const defaultVehicleDraft: VehicleDraft = {
  vehicleNumber: "",
  vin: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  color: "",
};

const defaultForm: CustomerFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  createLoginAccount: false,
  vehicle: defaultVehicleDraft,
};

const pageSize = 6;

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
    color: readRecordString(record, ["color", "Color"]),
    vin: readRecordString(record, ["vin", "VIN", "Vin"]),
    userId: readRecordString(record, ["userId", "UserId"]),
    customerId: readRecordString(record, ["customerId", "CustomerId"]),
    applicationUserId: readRecordString(record, ["applicationUserId", "ApplicationUserId"]),
    ownerId: readRecordString(record, ["ownerId", "OwnerId"]),
    ownerName: readRecordString(record, ["ownerName", "OwnerName"]) || undefined,
    year: year ?? undefined,
    mileage: mileage ?? undefined,
    createdAt: readRecordString(record, ["createdAt", "CreatedAt"]),
  };
}

function hasInitialVehicle(data: VehicleDraft): boolean {
  return [
    data.vehicleNumber,
    data.vin,
    data.brand,
    data.model,
    data.year,
    data.mileage,
    data.color,
  ].some((value) => value.trim().length > 0);
}

export default function StaffCustomersManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<CustomerRow[]>([]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerFormState>(defaultForm);

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRow | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [customerVehicles, setCustomerVehicles] = useState<VehicleRow[]>([]);

  const [notice, setNotice] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<CustomerRow[]>("/api/customers?page=1&pageSize=500");
    if (result.error) {
      setRows([]);
      setError(result.error);
    } else {
      setRows(unwrapArray<CustomerRow>(result.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const lowered = search.trim().toLowerCase();

    const next = rows.filter((row) => {
      if (!lowered) return true;
      return (
        (row.fullName ?? "").toLowerCase().includes(lowered) ||
        (row.email ?? "").toLowerCase().includes(lowered) ||
        (row.phone ?? "").toLowerCase().includes(lowered) ||
        (row.address ?? "").toLowerCase().includes(lowered) ||
        (row.id ?? "").toLowerCase().includes(lowered)
      );
    });

    next.sort((a, b) => {
      const aDate = new Date(a.createdAt ?? "1970-01-01").getTime();
      const bDate = new Date(b.createdAt ?? "1970-01-01").getTime();
      return sortBy === "oldest" ? aDate - bDate : bDate - aDate;
    });

    return next;
  }, [rows, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [currentPage, filtered]);

  const openCustomerView = async (customer: CustomerRow) => {
    setSelectedCustomer(customer);
    setViewOpen(true);
    setVehiclesLoading(true);
    setVehiclesError(null);
    setCustomerVehicles([]);

    const directVehicles = await apiRequest<VehicleRow[]>(`/api/customers/${customer.id}/vehicles`);
    const directItems = unwrapArray<VehicleRow>(directVehicles.data).map((item) => normalizeVehicleRecord(item));
    const directFailed = Boolean(directVehicles.error);

    if (!directFailed && directItems.length > 0) {
      setCustomerVehicles(directItems);
      setVehiclesLoading(false);
      return;
    }

    const fallback = await apiRequest<VehicleRow[]>("/api/vehicles?page=1&pageSize=1000");
    if (fallback.error) {
      if (!directFailed) {
        setCustomerVehicles([]);
        setVehiclesError(null);
        setVehiclesLoading(false);
        return;
      }
      setVehiclesError("Vehicle data unavailable from current API.");
      setVehiclesLoading(false);
      return;
    }

    const allVehicles = unwrapArray<VehicleRow>(fallback.data).map((item) => normalizeVehicleRecord(item));
    const customerId = customer.id.toLowerCase();
    const customerAppUserId = (customer.applicationUserId ?? "").toLowerCase();

    const filteredVehicles = allVehicles.filter((vehicle) => {
      const userId = (vehicle.userId ?? "").toLowerCase();
      const customerVehicleId = (vehicle.customerId ?? "").toLowerCase();
      const ownerId = (vehicle.ownerId ?? "").toLowerCase();
      const applicationUserId = (vehicle.applicationUserId ?? "").toLowerCase();

      return (
        (customerAppUserId.length > 0 && userId === customerAppUserId) ||
        customerVehicleId === customerId ||
        ownerId === customerId ||
        (customerAppUserId.length > 0 && applicationUserId === customerAppUserId)
      );
    });

    setCustomerVehicles(filteredVehicles);
    setVehiclesError(null);
    setVehiclesLoading(false);
  };

  const onCreateCustomer = async () => {
    if (!form.fullName.trim()) {
      setModalError("Full Name is required.");
      return;
    }
    if (!form.email.trim()) {
      setModalError("Email address is required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setModalError("Please enter a valid email address.");
      return;
    }
    if (!form.phone.trim()) {
      setModalError("Phone number is required.");
      return;
    }

    setSubmitting(true);
    setModalError(null);

    const createResult = await apiRequest<CustomerRow>("/api/customers", {
      method: "POST",
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim() || null,
        createLoginAccount: form.createLoginAccount,
      }),
    });

    if (createResult.error) {
      setSubmitting(false);
      setModalError(createResult.error);
      return;
    }

    const created = unwrapData<CustomerRow | null>(createResult.data, null);

    if (created?.id && hasInitialVehicle(form.vehicle)) {
      const vehiclePayload = {
        vehicleNumber: form.vehicle.vehicleNumber.trim() || null,
        vin: form.vehicle.vin.trim() || null,
        brand: form.vehicle.brand.trim() || null,
        model: form.vehicle.model.trim() || null,
        year: form.vehicle.year.trim() ? Number(form.vehicle.year) : null,
        mileage: form.vehicle.mileage.trim() ? Number(form.vehicle.mileage) : 0,
        color: form.vehicle.color.trim() || null,
      };

      const vehicleResult = await apiRequest<VehicleRow>(`/api/customers/${created.id}/vehicles`, {
        method: "POST",
        body: JSON.stringify(vehiclePayload),
      });

      if (vehicleResult.error) {
        setNotice(`Customer created, but initial vehicle could not be added: ${vehicleResult.error}`);
      } else {
        setNotice("Customer and initial vehicle created successfully.");
      }
    } else {
      setNotice("Customer created successfully.");
    }

    setSubmitting(false);
    setForm(defaultForm);
    setOpenCreateModal(false);
    await load();
  };

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Customers Management</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage client profiles, contact information, and vehicle associations.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setForm(defaultForm);
              setOpenCreateModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0d9488] px-6 py-3 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Customer
          </button>
        </header>

        {notice ? (
          <div className="rounded-lg border border-[#86efac] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">{notice}</div>
        ) : null}

        {loading ? <LoadingState message="Loading customers..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="overflow-hidden rounded-xl border border-[#c5c6cd] bg-[#fbf8fa]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] bg-white px-4 py-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="w-full sm:w-80">
                  <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search name, email, phone, address, customer ID"
                  />
                </div>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-10 rounded-md border border-[#c5c6cd] bg-[#f5f3f4] px-3 text-sm text-[#1b1b1d]"
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="oldest">Sort by: Oldest</option>
                </select>
              </div>
              <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
              </p>
            </div>

            {pagedRows.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No customers found" description="No customers match the current filter." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1020px]">
                  <thead>
                    <tr className="bg-[#e4e2e3] text-left text-sm font-medium text-[#45474c]">
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Contact Info</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">Created Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row) => {
                      const initials = row.fullName
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase();

                      return (
                        <tr key={row.id} className="border-t border-[#d9d7d8] text-sm text-[#1b1b1d]">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#1e293b] text-sm font-semibold text-white">
                                {initials || "CU"}
                              </span>
                              <div>
                                <p className="text-base font-medium">{row.fullName}</p>
                                <p className="text-xs font-semibold tracking-[0.04em] text-[#45474c]">ID: #{row.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2 text-[#1b1b1d]">
                                <Mail className="mt-0.5 size-3.5 shrink-0 text-[#45474c]" />
                                <span className="break-all text-sm leading-5">{row.email || "-"}</span>
                              </div>
                              <div className="flex items-start gap-2 text-[#1b1b1d]">
                                <Phone className="mt-0.5 size-3.5 shrink-0 text-[#45474c]" />
                                <span className="text-sm leading-5">{row.phone || "-"}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">{row.address || "-"}</td>
                          <td className="px-4 py-4">{toDateLabel(row.createdAt)}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                title="View customer"
                                aria-label="View customer details"
                                onClick={() => void openCustomerView(row)}
                                className="rounded-md p-2 text-[#45474c] hover:bg-[#ece9ea]"
                              >
                                <Eye className="size-4" />
                              </button>
                              <button
                                type="button"
                                title="View vehicles"
                                aria-label="View customer vehicles"
                                onClick={() => void openCustomerView(row)}
                                className="rounded-md p-2 text-[#45474c] hover:bg-[#ece9ea]"
                              >
                                <CarFront className="size-4" />
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

            <div className="flex items-center justify-between border-t border-[#c5c6cd] bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-[#c5c6cd] px-4 py-2 text-sm disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setPage(pageNumber)}
                      className={`h-8 w-8 rounded-md text-xs font-semibold ${
                        currentPage === pageNumber ? "bg-[#006a61] text-white" : "border border-[#c5c6cd] text-[#1b1b1d]"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md border border-[#c5c6cd] px-4 py-2 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        ) : null}
      </div>

      <FormDialog
        title="Add New Customer"
        description="Enter customer details and optionally register an initial vehicle."
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSubmit={() => void onCreateCustomer()}
        submitLabel="Save Customer"
        isSubmitting={submitting}
        errorMessage={modalError}
        maxWidthClassName="max-w-4xl"
        headerIcon={<UserPlus className="size-5" />}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-[#091426]">
            <UserPlus className="size-4" />
            Customer Information
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                label="Full Name *"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                placeholder="e.g. John Doe"
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="john@example.com"
            />
            <Input
              label="Phone Number *"
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="(555) 123-4567"
            />
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="123 Main St, Apt 4B"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#c5c6cd] bg-[#f5f3f4] p-4">
            <div>
              <p className="font-medium text-[#1b1b1d]">Create Customer Portal Account</p>
              <p className="text-sm text-[#45474c]">Send invitation email for invoice and estimate access.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={form.createLoginAccount}
              onClick={() => setForm((prev) => ({ ...prev, createLoginAccount: !prev.createLoginAccount }))}
              className={`relative h-6 w-11 rounded-full transition ${form.createLoginAccount ? "bg-[#0d9488]" : "bg-[#c5c6cd]"}`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${form.createLoginAccount ? "left-[22px]" : "left-0.5"}`}
              />
            </button>
          </div>

          <div className="border-t border-[#c5c6cd] pt-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.06em] text-[#091426]">
              <CarFront className="size-4" />
              Add Initial Vehicle <span className="normal-case font-medium text-[#45474c]">(Optional)</span>
            </div>

            <div className="rounded-lg border border-[#c5c6cd] bg-white p-4">
              <div className="grid gap-4 md:grid-cols-6">
                <div className="md:col-span-2">
                  <Input
                    label="License Plate"
                    value={form.vehicle.vehicleNumber}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, vehicleNumber: event.target.value },
                      }))
                    }
                    placeholder="ABC-1234"
                  />
                </div>
                <div className="md:col-span-4">
                  <Input
                    label="VIN"
                    value={form.vehicle.vin}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, vin: event.target.value },
                      }))
                    }
                    placeholder="1HGCM82633A004XXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <Input
                    label="Make"
                    value={form.vehicle.brand}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, brand: event.target.value },
                      }))
                    }
                    placeholder="Toyota"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Model"
                    value={form.vehicle.model}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, model: event.target.value },
                      }))
                    }
                    placeholder="Camry"
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="Year"
                    value={form.vehicle.year}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, year: event.target.value },
                      }))
                    }
                    placeholder="YYYY"
                  />
                </div>

                <div className="md:col-span-3">
                  <Input
                    label="Current Mileage"
                    type="number"
                    value={form.vehicle.mileage}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, mileage: event.target.value },
                      }))
                    }
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-3">
                  <Input
                    label="Color"
                    value={form.vehicle.color}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, color: event.target.value },
                      }))
                    }
                    placeholder="e.g. Silver"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FormDialog>

      <Modal
        title="Customer Details"
        open={viewOpen}
        onClose={() => {
          setViewOpen(false);
          setSelectedCustomer(null);
          setCustomerVehicles([]);
          setVehiclesError(null);
        }}
        maxWidthClassName="max-w-3xl"
        footer={(
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setViewOpen(false);
                setSelectedCustomer(null);
                setCustomerVehicles([]);
                setVehiclesError(null);
              }}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Close
            </button>
          </div>
        )}
      >
        {selectedCustomer ? (
          <div className="space-y-4 text-sm text-[#1b1b1d]">
            <div className="grid gap-3 md:grid-cols-2">
              <p><span className="font-semibold">Full Name:</span> {selectedCustomer.fullName}</p>
              <p><span className="font-semibold">Email:</span> {selectedCustomer.email || "-"}</p>
              <p><span className="font-semibold">Phone:</span> {selectedCustomer.phone || "-"}</p>
              <p><span className="font-semibold">Address:</span> {selectedCustomer.address || "-"}</p>
              <p><span className="font-semibold">Customer ID:</span> {selectedCustomer.id}</p>
              <p><span className="font-semibold">Application User ID:</span> {selectedCustomer.applicationUserId || "-"}</p>
              <p><span className="font-semibold">Created:</span> {toDateLabel(selectedCustomer.createdAt)}</p>
            </div>

            <div className="rounded-lg border border-[#d9d7d8] bg-[#fbf8fa] p-3">
              <h3 className="mb-2 text-sm font-semibold text-[#1b1b1d]">Vehicles</h3>
              {vehiclesLoading ? <p className="text-sm text-[#45474c]">Loading vehicles...</p> : null}
              {!vehiclesLoading && vehiclesError ? <p className="text-sm text-[#92400e]">{vehiclesError}</p> : null}
              {!vehiclesLoading && !vehiclesError && customerVehicles.length === 0 ? (
                <p className="text-sm text-[#45474c]">No vehicles registered for this customer.</p>
              ) : null}
              {!vehiclesLoading && customerVehicles.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-[0.08em] text-[#64748b]">
                        <th className="py-2 pr-3">Plate</th>
                        <th className="py-2 pr-3">VIN</th>
                        <th className="py-2 pr-3">Vehicle</th>
                        <th className="py-2 pr-3">Year</th>
                        <th className="py-2 pr-3">Mileage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-t border-[#e2e8f0] text-[#1b1b1d]">
                          <td className="py-2 pr-3">{vehicle.vehicleNumber || "-"}</td>
                          <td className="py-2 pr-3">{vehicle.vin || "-"}</td>
                          <td className="py-2 pr-3">{[vehicle.brand, vehicle.model].filter(Boolean).join(" ") || "-"}</td>
                          <td className="py-2 pr-3">{vehicle.year || "-"}</td>
                          <td className="py-2 pr-3">{toNumber(vehicle.mileage).toLocaleString()} mi</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </StaffShell>
  );
}
