"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { Plus, UserCog } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import {
  ActionMenu,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  FilterTabs,
  FormDialog,
  LoadingState,
  SearchInput,
} from "@/shared/components/ui";

import { apiRequest, unwrapArray } from "../shared/admin-api";
import type { StaffMember } from "../shared/admin.types";

type StaffFormState = {
  staffCode: string;
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  position: string;
  role: "Staff" | "Admin";
};

const defaultForm: StaffFormState = {
  staffCode: "",
  fullName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  position: "",
  role: "Staff",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminStaffManagementPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [rows, setRows] = useState<StaffMember[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [target, setTarget] = useState<StaffMember | null>(null);
  const [form, setForm] = useState<StaffFormState>(defaultForm);
  const [modalError, setModalError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<StaffMember[]>("/api/staff");
    if (result.error) {
      setError(result.error);
      setRows([]);
    } else {
      setRows(unwrapArray<StaffMember>(result.data));
    }

    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredRows = useMemo(() => {
    const lowered = search.toLowerCase();
    return rows.filter((row) => {
      const tabOk =
        activeTab === "all" ||
        (activeTab === "active" && row.isActive !== false) ||
        (activeTab === "inactive" && row.isActive === false);
      const textOk =
        (row.fullName ?? "").toLowerCase().includes(lowered) ||
        (row.email ?? "").toLowerCase().includes(lowered) ||
        (row.staffCode ?? "").toLowerCase().includes(lowered) ||
        (row.position ?? row.role ?? "").toLowerCase().includes(lowered);
      return tabOk && textOk;
    });
  }, [activeTab, rows, search]);

  const validateForm = (): string | null => {
    if (!form.staffCode.trim()) return "Staff Code is required.";
    if (!form.fullName.trim()) return "Full Name is required.";
    if (!form.email.trim() || !emailPattern.test(form.email.trim())) {
      return "Valid email is required.";
    }
    if (!target) {
      if (!form.password.trim()) return "Password is required.";
      if (form.password.trim().length < 6) return "Password must be at least 6 characters.";
      if (form.role !== "Staff" && form.role !== "Admin") {
        return "Role must be either Staff or Admin.";
      }
    }
    if (!form.position.trim()) return "Position is required.";
    return null;
  };

  const onCreateOrUpdate = async () => {
    const validationError = validateForm();
    if (validationError) {
      setModalError(validationError);
      return;
    }

    setModalError(null);
    setIsPending(true);

    const payload = target
      ? {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          position: form.position.trim(),
        }
      : {
          staffCode: form.staffCode.trim(),
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || null,
          address: form.address.trim() || null,
          position: form.position.trim(),
          role: form.role,
        };

    const result = await apiRequest<StaffMember>(target ? `/api/staff/${target.id}` : "/api/staff", {
      method: target ? "PUT" : "POST",
      body: JSON.stringify(payload),
    });
    setIsPending(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setForm(defaultForm);
    setIsCreateOpen(false);
    setTarget(null);
    await load();
  };

  const onDelete = async () => {
    if (!target) return;

    setIsPending(true);
    const result = await apiRequest<{ success: boolean }>(`/api/staff/${target.id}`, {
      method: "DELETE",
    });
    setIsPending(false);

    if (result.error) {
      setModalError(result.error);
      return;
    }

    setIsDeleteOpen(false);
    setTarget(null);
    setModalError(null);
    await load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Staff</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage team members and operational roles.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTarget(null);
              setForm(defaultForm);
              setModalError(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2.5 text-sm font-medium text-white"
          >
            <Plus className="size-4" />
            Add Staff
          </button>
        </header>

        {loading ? <LoadingState message="Loading staff..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error ? (
          <section className="rounded-xl border border-[#c5c6cd] bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c5c6cd] px-4 py-3">
              <SearchInput value={search} onChange={setSearch} placeholder="Search staff..." />
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

            {filteredRows.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  title="No staff records"
                  description="No staff entries matched this filter."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px]">
                  <thead>
                    <tr className="bg-[#f5f3f4] text-left text-xs uppercase tracking-[0.08em] text-[#45474c]">
                      <th className="px-4 py-3">Staff</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="border-t border-[#e2e8f0] text-sm text-[#1b1b1d]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#1e293b] text-xs font-semibold text-white">
                              {(row.fullName ?? "S")
                                .split(" ")
                                .map((chunk) => chunk[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                            <div>
                              <p className="font-medium">{row.fullName}</p>
                              <p className="text-xs text-[#6b7280]">{row.address ?? "-"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{row.staffCode ?? "-"}</td>
                        <td className="px-4 py-3">{row.position ?? row.role ?? "Staff"}</td>
                        <td className="px-4 py-3">
                          <p>{row.email}</p>
                          <p className="text-xs text-[#6b7280]">{row.phone ?? "-"}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              row.isActive === false
                                ? "bg-[#f0edef] text-[#45474c]"
                                : "bg-[#86f2e4] text-[#006f66]"
                            }`}
                          >
                            {row.isActive === false ? "Inactive" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end">
                            <ActionMenu
                              items={[
                                {
                                  label: "Edit",
                                  onClick: () => {
                                    setTarget(row);
                                    setModalError(null);
                                    setForm({
                                      staffCode: row.staffCode ?? "",
                                      fullName: row.fullName,
                                      email: row.email,
                                      password: "",
                                      phone: row.phone ?? "",
                                      address: row.address ?? "",
                                      position: row.position ?? row.role ?? "",
                                      role: row.role === "Admin" ? "Admin" : "Staff",
                                    });
                                    setIsCreateOpen(true);
                                  },
                                },
                                {
                                  label: "Deactivate",
                                  onClick: () => {
                                    setTarget(row);
                                    setModalError(null);
                                    setIsDeleteOpen(true);
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
        title={target ? "Update Staff Member" : "Add Staff Member"}
        description="Fill all required details before saving."
        open={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          setTarget(null);
          setModalError(null);
          setForm(defaultForm);
        }}
        onSubmit={onCreateOrUpdate}
        submitLabel={target ? "Update" : "Create"}
        isSubmitting={isPending}
        errorMessage={modalError}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-[#45474c]">
            Staff Code *
            <input
              value={form.staffCode}
              onChange={(event) => setForm((prev) => ({ ...prev, staffCode: event.target.value }))}
              disabled={Boolean(target)}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm disabled:bg-[#f5f3f4]"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Role *
            <select
              value={form.role}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, role: event.target.value as "Staff" | "Admin" }))
              }
              disabled={Boolean(target)}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm disabled:bg-[#f5f3f4]"
            >
              <option value="Staff">Staff</option>
              <option value="Admin">Admin</option>
            </select>
          </label>
          <label className="text-sm text-[#45474c]">
            Position *
            <input
              value={form.position}
              onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c] sm:col-span-2">
            Full Name *
            <input
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
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
          <label className="text-sm text-[#45474c]">
            Password {target ? "(leave blank to keep)" : "*"}
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              disabled={Boolean(target)}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm disabled:bg-[#f5f3f4]"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
          <label className="text-sm text-[#45474c]">
            Address
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              className="mt-1 h-11 w-full rounded-lg border border-[#c5c6cd] px-3 text-sm"
            />
          </label>
        </div>
      </FormDialog>

      <ConfirmDialog
        title="Deactivate staff member"
        description={
          modalError
            ? modalError
            : `Deactivate ${target?.fullName ?? "this staff member"}? They will no longer be able to log in.`
        }
        open={isDeleteOpen}
        onCancel={() => {
          setIsDeleteOpen(false);
          setTarget(null);
          setModalError(null);
        }}
        onConfirm={onDelete}
        confirmLabel="Deactivate"
        isPending={isPending}
      />

      <div className="sr-only">
        <UserCog />
      </div>
    </AdminLayout>
  );
}
