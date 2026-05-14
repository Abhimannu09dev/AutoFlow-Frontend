"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  ActionMenu,
  EmptyState,
  ErrorState,
  FormDialog,
  LoadingState,
  SearchInput,
} from "@/shared/components/ui";

import { apiRequest, toNumber, unwrapArray } from "../shared/admin-api";
import type { PartItem, Vendor } from "../shared/admin.types";

type PartFormState = {
  partName: string;
  partNumber: string;
  brand: string;
  category: string;
  description: string;
  unitPrice: string;
  sellingPrice: string;
  stockQuantity: string;
  minimumStockLevel: string;
  vendorId: string;
};

const defaultForm: PartFormState = {
  partName: "",
  partNumber: "",
  brand: "",
  category: "",
  description: "",
  unitPrice: "",
  sellingPrice: "",
  stockQuantity: "",
  minimumStockLevel: "",
  vendorId: "",
};

export default function AdminVehiclePartsManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<PartItem[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<PartFormState>(defaultForm);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingPart, setEditingPart] = useState<PartItem | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const [partsResult, vendorsResult] = await Promise.all([
      apiRequest<PartItem[]>("/api/parts"),
      apiRequest<Vendor[]>("/api/vendors"),
    ]);

    if (partsResult.error) {
      setError(partsResult.error);
      setRows([]);
    } else {
      setRows(unwrapArray<PartItem>(partsResult.data));
    }

    setVendors(unwrapArray<Vendor>(vendorsResult.data));

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();
    return rows.filter((part) => {
      return (
        (part.partName ?? "").toLowerCase().includes(lowered) ||
        (part.partNumber ?? "").toLowerCase().includes(lowered) ||
        (part.brand ?? "").toLowerCase().includes(lowered) ||
        (part.category ?? "").toLowerCase().includes(lowered) ||
        (part.vendorName ?? "").toLowerCase().includes(lowered)
      );
    });
  }, [rows, search]);

  const totals = useMemo(() => {
    const inventoryValue = rows.reduce(
      (sum, part) => sum + toNumber(part.unitPrice) * toNumber(part.stockQuantity),
      0
    );
    const critical = rows.filter(
      (part) => toNumber(part.stockQuantity) <= toNumber(part.minimumStockLevel ?? part.reorderLevel, 0)
    ).length;
    return { inventoryValue, critical };
  }, [rows]);

  const validate = (): string | null => {
    if (!form.partName.trim()) return "Part Name is required.";
    if (!form.partNumber.trim()) return "Part Number is required.";
    if (!form.brand.trim()) return "Brand is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.description.trim()) return "Description is required.";

    const unitPrice = Number(form.unitPrice);
    const sellingPrice = Number(form.sellingPrice);
    const stockQuantity = Number(form.stockQuantity);
    const minimumStockLevel = Number(form.minimumStockLevel);

    if (!Number.isFinite(unitPrice) || unitPrice <= 0) return "Unit Price must be greater than 0.";
    if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) return "Selling Price must be greater than 0.";
    if (!Number.isFinite(stockQuantity) || stockQuantity < 0) return "Stock Quantity must be 0 or more.";
    if (!Number.isFinite(minimumStockLevel) || minimumStockLevel < 0) {
      return "Minimum Stock Level must be 0 or more.";
    }
    if (!form.vendorId) return "Vendor is required.";

    return null;
  };

  const onCreateOrUpdate = async () => {
    const validationError = validate();
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setModalError(null);
    setIsSubmitting(true);
    const result = await apiRequest<PartItem>(editingPart ? `/api/parts/${editingPart.id}` : "/api/parts", {
      method: editingPart ? "PUT" : "POST",
      body: JSON.stringify({
        partName: form.partName.trim(),
        partNumber: form.partNumber.trim(),
        brand: form.brand.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        unitPrice: Number(form.unitPrice),
        sellingPrice: Number(form.sellingPrice),
        stockQuantity: Number(form.stockQuantity),
        minimumStockLevel: Number(form.minimumStockLevel),
        vendorId: form.vendorId,
      }),
    });
    setIsSubmitting(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setIsModalOpen(false);
    setEditingPart(null);
    setForm(defaultForm);
    await load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Inventory</h1>
            <p className="mt-1 text-base text-[#45474c]">Track parts stock and valuation.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setModalError(null);
              setEditingPart(null);
              setForm(defaultForm);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Part
          </button>
        </header>

        {loading ? <LoadingState message="Loading parts..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Stock Valuation</p>
                <p className="mt-2 text-4xl font-semibold text-[#1b1b1d]">
                  ${totals.inventoryValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </article>
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Critical Alerts</p>
                <p className="mt-2 text-4xl font-semibold text-[#ba1a1a]">{totals.critical}</p>
              </article>
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-[#45474c]">Total Parts</p>
                <p className="mt-2 text-4xl font-semibold text-[#1b1b1d]">{rows.length}</p>
              </article>
            </section>

            <section className="rounded-xl border border-[#c5c6cd] bg-white">
              <div className="border-b border-[#c5c6cd] px-4 py-3">
                <SearchInput value={search} onChange={setSearch} placeholder="Search parts..." />
              </div>

              {filtered.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No parts found" description="No parts match this search query." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1080px]">
                    <thead>
                      <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                        <th className="px-4 py-3">Part</th>
                        <th className="px-4 py-3">Brand</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Vendor</th>
                        <th className="px-4 py-3 text-right">Unit</th>
                        <th className="px-4 py-3 text-right">Selling</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((part) => {
                        const minLevel = toNumber(part.minimumStockLevel ?? part.reorderLevel, 0);
                        const isLow = toNumber(part.stockQuantity) <= minLevel;
                        return (
                          <tr key={part.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                            <td className="px-4 py-3">
                              <p className="font-medium">{part.partName}</p>
                              <p className="text-xs text-[#6b7280]">{part.partNumber ?? "-"}</p>
                            </td>
                            <td className="px-4 py-3">{part.brand ?? "-"}</td>
                            <td className="px-4 py-3">{part.category ?? "-"}</td>
                            <td className="px-4 py-3">{part.vendorName ?? "-"}</td>
                            <td className="px-4 py-3 text-right">${toNumber(part.unitPrice).toFixed(2)}</td>
                            <td className="px-4 py-3 text-right">${toNumber(part.sellingPrice).toFixed(2)}</td>
                            <td className="px-4 py-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                  isLow ? "bg-[#fee2e2] text-[#ba1a1a]" : "bg-[#86f2e4] text-[#006f66]"
                                }`}
                              >
                                {toNumber(part.stockQuantity)} Units (Min {minLevel})
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end">
                                <ActionMenu
                                  items={[
                                    {
                                      label: "Edit",
                                      onClick: () => {
                                        setEditingPart(part);
                                        setModalError(null);
                                        setForm({
                                          partName: part.partName ?? "",
                                          partNumber: part.partNumber ?? "",
                                          brand: part.brand ?? "",
                                          category: part.category ?? "",
                                          description: part.description ?? "",
                                          unitPrice: String(toNumber(part.unitPrice)),
                                          sellingPrice: String(toNumber(part.sellingPrice)),
                                          stockQuantity: String(toNumber(part.stockQuantity)),
                                          minimumStockLevel: String(
                                            toNumber(part.minimumStockLevel ?? part.reorderLevel)
                                          ),
                                          vendorId: part.vendorId ?? "",
                                        });
                                        setIsModalOpen(true);
                                      },
                                    },
                                  ]}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>

      <FormDialog
        title={editingPart ? "Edit Part" : "Add New Part"}
        description="Use the backend-required fields exactly to avoid validation errors."
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(null);
          setEditingPart(null);
        }}
        onSubmit={onCreateOrUpdate}
        submitLabel={editingPart ? "Update" : "Create"}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-[#45474c]">
            Part Name *
            <input
              value={form.partName}
              onChange={(event) => setForm((prev) => ({ ...prev, partName: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Part Number *
            <input
              value={form.partNumber}
              onChange={(event) => setForm((prev) => ({ ...prev, partNumber: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Brand *
            <input
              value={form.brand}
              onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Category *
            <input
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c] sm:col-span-2">
            Description *
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="mt-1 min-h-20 w-full rounded-lg border border-[#c5c6cd] px-3 py-2 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Unit Price *
            <input
              type="number"
              value={form.unitPrice}
              onChange={(event) => setForm((prev) => ({ ...prev, unitPrice: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Selling Price *
            <input
              type="number"
              value={form.sellingPrice}
              onChange={(event) => setForm((prev) => ({ ...prev, sellingPrice: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Stock Quantity *
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(event) => setForm((prev) => ({ ...prev, stockQuantity: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Minimum Stock Level *
            <input
              type="number"
              value={form.minimumStockLevel}
              onChange={(event) => setForm((prev) => ({ ...prev, minimumStockLevel: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c] sm:col-span-2">
            Vendor *
            <select
              value={form.vendorId}
              onChange={(event) => setForm((prev) => ({ ...prev, vendorId: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.vendorName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </FormDialog>
    </AdminLayout>
  );
}
