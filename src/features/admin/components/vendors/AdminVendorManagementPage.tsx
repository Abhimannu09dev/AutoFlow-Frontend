"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  ActionMenu,
  EmptyState,
  ErrorState,
  FilterTabs,
  FormDialog,
  LoadingState,
  SearchInput,
} from "@/shared/components/ui";

import { apiRequest, unwrapArray } from "../shared/admin-api";
import type { Vendor } from "../shared/admin.types";

type VendorFormState = {
  vendorName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
};

const defaultForm: VendorFormState = {
  vendorName: "",
  contactPerson: "",
  email: "",
  phone: "",
  address: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminVendorManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<VendorFormState>(defaultForm);
  const [target, setTarget] = useState<Vendor | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<Vendor[]>("/api/vendors");
    if (result.error) {
      setError(result.error);
      setRows([]);
    } else {
      setRows(unwrapArray<Vendor>(result.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const lowered = search.toLowerCase();
    return rows.filter((vendor) => {
      const vendorName = vendor.vendorName ?? "";
      const contactPerson = vendor.contactPerson ?? "";
      const email = vendor.email ?? "";
      const phone = vendor.phone ?? "";
      const address = vendor.address ?? "";

      const textOk =
        vendorName.toLowerCase().includes(lowered) ||
        contactPerson.toLowerCase().includes(lowered) ||
        email.toLowerCase().includes(lowered) ||
        phone.toLowerCase().includes(lowered) ||
        address.toLowerCase().includes(lowered);

      const tabOk =
        activeTab === "all" ||
        (activeTab === "active" && vendor.isActive !== false) ||
        (activeTab === "inactive" && vendor.isActive === false);

      return textOk && tabOk;
    });
  }, [activeTab, rows, search]);

  const validate = (): string | null => {
    if (!form.vendorName.trim()) return "Vendor Name is required.";
    if (!form.contactPerson.trim()) return "Contact Person is required.";
    if (!form.phone.trim()) return "Phone is required.";
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) return "Valid email is required.";
    if (!form.address.trim()) return "Address is required.";
    return null;
  };

  const onSave = async () => {
    const validationError = validate();
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setModalError(null);
    setIsSubmitting(true);

    const payload = {
      vendorName: form.vendorName.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
    };

    const result = await apiRequest<Vendor>(target ? `/api/vendors/${target.id}` : "/api/vendors", {
      method: target ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    setIsSubmitting(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setIsModalOpen(false);
    setTarget(null);
    setForm(defaultForm);
    await load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Vendors</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage suppliers and order contacts.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTarget(null);
              setModalError(null);
              setForm(defaultForm);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Vendor
          </button>
        </header>

        {loading ? <LoadingState message="Loading vendors..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="rounded-xl border border-[#c5c6cd] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] px-4 py-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search vendors..." />
              <FilterTabs
                tabs={[
                  { key: "all", label: "All" },
                  { key: "active", label: "Active" },
                  { key: "inactive", label: "Inactive" },
                ]}
                activeKey={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState title="No vendors" description="No vendor entries matched your query." />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[940px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                      <th className="px-4 py-3">Vendor Name</th>
                      <th className="px-4 py-3">Contact Person</th>
                      <th className="px-4 py-3">Contact Info</th>
                      <th className="px-4 py-3">Address</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((vendor) => (
                      <tr key={vendor.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                        <td className="px-4 py-3">
                          <p className="font-medium">{vendor.vendorName}</p>
                          <p className="text-xs text-[#6b7280]">ID: {vendor.id}</p>
                        </td>
                        <td className="px-4 py-3">{vendor.contactPerson ?? "-"}</td>
                        <td className="px-4 py-3">
                          <p>{vendor.phone ?? "-"}</p>
                          <p className="text-xs text-[#6b7280]">{vendor.email ?? "-"}</p>
                        </td>
                        <td className="px-4 py-3">{vendor.address ?? "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              vendor.isActive === false
                                ? "bg-[#f0edef] text-[#45474c]"
                                : "bg-[#86f2e4] text-[#006f66]"
                            }`}
                          >
                            {vendor.isActive === false ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <ActionMenu
                              items={[
                                {
                                  label: "Edit",
                                  onClick: () => {
                                    setTarget(vendor);
                                    setModalError(null);
                                    setForm({
                                      vendorName: vendor.vendorName ?? "",
                                      contactPerson: vendor.contactPerson ?? "",
                                      email: vendor.email ?? "",
                                      phone: vendor.phone ?? "",
                                      address: vendor.address ?? "",
                                    });
                                    setIsModalOpen(true);
                                  },
                                },
                              ]}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}
      </div>

      <FormDialog
        title={target ? "Update Vendor" : "Add Vendor"}
        description="Provide supplier details exactly as required by the backend API."
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTarget(null);
          setModalError(null);
        }}
        onSubmit={onSave}
        submitLabel={target ? "Update" : "Create"}
        isSubmitting={isSubmitting}
        errorMessage={modalError}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-[#45474c]">
            Vendor Name *
            <input
              value={form.vendorName}
              onChange={(event) => setForm((prev) => ({ ...prev, vendorName: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Contact Person *
            <input
              value={form.contactPerson}
              onChange={(event) => setForm((prev) => ({ ...prev, contactPerson: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Phone *
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Email *
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c] sm:col-span-2">
            Address *
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
        </div>
      </FormDialog>
    </AdminLayout>
  );
}
