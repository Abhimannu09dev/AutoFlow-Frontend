"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from "react";
import { KeyRound, Pencil } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";
import CustomerShell from "@/shared/components/layout/CustomerShell";
import ErrorState from "@/shared/components/ui/ErrorState";
import FormDialog from "@/shared/components/ui/FormDialog";
import LoadingState from "@/shared/components/ui/LoadingState";
import PageHeader from "@/shared/components/ui/PageHeader";

import { SectionCard } from "../common/PortalPrimitives";
import { apiRequest, toDateLabel, unwrapObject } from "../shared/customer-api";
import type { CustomerProfile } from "../shared/customer.types";

type ProfileFormState = {
  fullName: string;
  phone: string;
  address: string;
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ProfileFormState>({
    fullName: "",
    phone: "",
    address: "",
  });

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await apiRequest<unknown>("/api/customer/profile");
    if (response.error) {
      setError(response.error);
      setLoading(false);
      return;
    }

    const normalized = unwrapObject<CustomerProfile>(response.data, {
      id: "",
      fullName: "",
      email: "",
      phone: "",
      address: "",
      createdAt: undefined,
      applicationUserId: undefined,
    });

    setProfile(normalized);
    setEditForm({
      fullName: normalized.fullName ?? "",
      phone: normalized.phone ?? "",
      address: normalized.address ?? "",
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const submitProfileUpdate = async () => {
    if (!editForm.fullName.trim()) {
      setEditError("Full name is required.");
      return;
    }

    setEditError(null);
    setEditSubmitting(true);

    const response = await apiRequest<unknown>("/api/customer/profile", {
      method: "PATCH",
      body: JSON.stringify({
        fullName: editForm.fullName.trim(),
        phone: editForm.phone.trim() || null,
        address: editForm.address.trim() || null,
      }),
    });

    if (response.error) {
      setEditError(response.error);
      setEditSubmitting(false);
      return;
    }

    setEditSubmitting(false);
    setEditOpen(false);
    await loadProfile();
  };

  const submitPasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password must match.");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    setPasswordError(null);
    setPasswordSubmitting(true);

    const response = await apiRequest<unknown>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      }),
    });

    if (response.error) {
      setPasswordError(response.error);
      setPasswordSubmitting(false);
      return;
    }

    setPasswordSubmitting(false);
    setPasswordOpen(false);
    setPasswordForm(emptyPasswordForm);
  };

  return (
    <CustomerShell userName={user?.name ?? "Customer"} userRole="Customer Portal">
      <PageHeader
        title={pathname.startsWith("/customer/settings") ? "Settings" : "My Profile"}
        subtitle="View and update your customer profile details."
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#c5c6cd] bg-white px-4 py-2 text-sm font-semibold text-[#091426]"
            >
              <Pencil className="size-4" /> Edit Profile
            </button>
            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-semibold text-white"
            >
              <KeyRound className="size-4" /> Change Password
            </button>
          </div>
        }
      />

      {loading ? <LoadingState message="Loading profile..." /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={loadProfile} /> : null}

      {!loading && !error && profile ? (
        <SectionCard title="Profile Information" subtitle="Account and contact details.">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileItem label="Full Name" value={profile.fullName || "-"} />
            <ProfileItem label="Email" value={profile.email || "-"} />
            <ProfileItem label="Phone" value={profile.phone || "-"} />
            <ProfileItem label="Address" value={profile.address || "-"} />
            <ProfileItem label="Customer ID" value={profile.id || "-"} />
            <ProfileItem label="Created Date" value={toDateLabel(profile.createdAt)} />
          </div>
        </SectionCard>
      ) : null}

      <FormDialog
        title="Edit Profile"
        description="Update your personal contact details."
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={submitProfileUpdate}
        submitLabel="Save Changes"
        isSubmitting={editSubmitting}
        errorMessage={editError}
      >
        <div className="grid gap-4">
          <label className="space-y-1 text-sm text-[#45474c]">
            Full Name
            <input
              value={editForm.fullName}
              onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Phone
            <input
              value={editForm.phone}
              onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Address
            <textarea
              rows={3}
              value={editForm.address}
              onChange={(event) => setEditForm((prev) => ({ ...prev, address: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
        </div>
      </FormDialog>

      <FormDialog
        title="Change Password"
        description="Update your account password securely."
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        onSubmit={submitPasswordChange}
        submitLabel="Update Password"
        isSubmitting={passwordSubmitting}
        errorMessage={passwordError}
        maxWidthClassName="max-w-lg"
      >
        <div className="grid gap-4">
          <label className="space-y-1 text-sm text-[#45474c]">
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
          <label className="space-y-1 text-sm text-[#45474c]">
            Confirm Password
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              className="w-full rounded-lg border border-[#c5c6cd] px-3 py-2"
            />
          </label>
        </div>
      </FormDialog>
    </CustomerShell>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-[#fbfbfc] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#091426]">{value}</p>
    </div>
  );
}
