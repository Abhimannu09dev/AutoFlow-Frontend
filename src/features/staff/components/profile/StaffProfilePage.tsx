"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { KeyRound, PencilLine, Save, UserRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import StaffShell from "@/shared/components/layout/StaffShell";
import { ErrorState, FormDialog, Input, LoadingState } from "@/shared/components/ui";

import { apiRequest, unwrapData } from "../shared/staff-api";
import type { StaffProfileRow } from "../shared/staff.types";

type ProfileForm = {
  fullName: string;
  phone: string;
  address: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const defaultPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function readFallbackProfileFromStorage(): Partial<StaffProfileRow> {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem("autoflow_auth") ?? localStorage.getItem("user");
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      id: String(parsed.userId ?? ""),
      fullName: String(parsed.fullName ?? ""),
      email: String(parsed.email ?? ""),
      role: (Array.isArray(parsed.roles) && parsed.roles.length > 0
        ? String(parsed.roles[0])
        : "Staff") as string,
    };
  } catch {
    return {};
  }
}

export default function StaffProfilePage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUnavailableNote, setApiUnavailableNote] = useState<string | null>(null);

  const [profile, setProfile] = useState<StaffProfileRow | null>(null);
  const [form, setForm] = useState<ProfileForm>({ fullName: "", phone: "", address: "" });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(defaultPasswordForm);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setApiUnavailableNote(null);

    const result = await apiRequest<StaffProfileRow | { data?: StaffProfileRow }>("/api/staff/profile");

    if (result.error) {
      const fallback = readFallbackProfileFromStorage();
      if (fallback.fullName || fallback.email) {
        const fallbackProfile: StaffProfileRow = {
          id: fallback.id ?? user?.id ?? "-",
          staffCode: fallback.staffCode ?? "N/A",
          fullName: fallback.fullName ?? user?.name ?? "Staff User",
          email: fallback.email ?? user?.email ?? "-",
          phone: fallback.phone ?? "",
          address: fallback.address ?? "",
          position: fallback.position ?? "N/A",
          role: fallback.role ?? (user?.role === "admin" ? "Admin" : "Staff"),
        };
        setProfile(fallbackProfile);
        setForm({
          fullName: fallbackProfile.fullName,
          phone: fallbackProfile.phone ?? "",
          address: fallbackProfile.address ?? "",
        });
        setApiUnavailableNote("Staff profile API is unavailable. Showing local session profile data.");
      } else {
        setError(result.error);
      }
      setLoading(false);
      return;
    }

    const payload = unwrapData<StaffProfileRow>(result.data, {
      id: "",
      fullName: "",
      email: "",
      staffCode: "",
      phone: "",
      address: "",
      position: "",
      role: "Staff",
    });

    setProfile(payload);
    setForm({
      fullName: payload.fullName ?? "",
      phone: payload.phone ?? "",
      address: payload.address ?? "",
    });
    setLoading(false);
  }, [user?.email, user?.id, user?.name, user?.role]);

  useEffect(() => {
    void load();
  }, [load]);

  const profileRows = useMemo(() => {
    return [
      { label: "Staff Code", value: profile?.staffCode || "N/A" },
      { label: "Role", value: profile?.role || "Staff" },
      { label: "Position", value: profile?.position || "N/A" },
      { label: "Email", value: profile?.email || "-" },
    ];
  }, [profile]);

  const onSaveProfile = async () => {
    if (!form.fullName.trim()) {
      setFormError("Full name is required.");
      return;
    }

    setSaving(true);
    setFormError(null);

    const result = await apiRequest<StaffProfileRow>("/api/staff/profile", {
      method: "PATCH",
      body: JSON.stringify({
        fullName: form.fullName.trim(),
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
      }),
    });

    setSaving(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    setEditMode(false);
    await load();
  };

  const onChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setPasswordError("Current password and new password are required.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Confirm password does not match new password.");
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError(null);

    const result = await apiRequest<boolean>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }),
    });

    setPasswordSubmitting(false);

    if (result.error) {
      setPasswordError(result.error);
      return;
    }

    setPasswordOpen(false);
    setPasswordForm(defaultPasswordForm);
  };

  return (
    <StaffShell>
      <div className="space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[40px] font-semibold leading-[48px] tracking-[-0.02em] text-[#1b1b1d]">My Profile</h1>
            <p className="mt-1 text-base text-[#45474c]">Manage your account details and password.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setPasswordOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[#c5c6cd] bg-white px-4 py-2.5 text-sm font-medium text-[#1b1b1d]"
            >
              <KeyRound className="size-4" />
              Change Password
            </button>
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0d9488] px-4 py-2.5 text-sm font-medium text-white"
            >
              <PencilLine className="size-4" />
              {editMode ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </header>

        {loading ? <LoadingState message="Loading profile..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error && profile ? (
          <>
            {apiUnavailableNote ? (
              <div className="rounded-lg border border-[#f59e0b] bg-[#fffbeb] px-4 py-2 text-sm text-[#92400e]">
                {apiUnavailableNote}
              </div>
            ) : null}

            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <article className="rounded-xl border border-[#c5c6cd] bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#1e293b] text-white">
                    <UserRound className="size-6" />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-[#1b1b1d]">{profile.fullName || "Staff User"}</p>
                    <p className="text-sm text-[#45474c]">{profile.email || "-"}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input
                    label="Full Name"
                    value={form.fullName}
                    onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                    disabled={!editMode}
                  />
                  <Input
                    label="Phone"
                    value={form.phone}
                    onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                    disabled={!editMode}
                  />
                  <Input
                    label="Address"
                    value={form.address}
                    onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                    disabled={!editMode}
                  />
                </div>

                {formError ? (
                  <div className="mt-4 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">{formError}</div>
                ) : null}

                {editMode ? (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void onSaveProfile()}
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      <Save className="size-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                ) : null}
              </article>

              <article className="rounded-xl border border-[#c5c6cd] bg-white p-6">
                <h2 className="text-lg font-semibold text-[#1b1b1d]">Account Details</h2>
                <div className="mt-4 space-y-3 text-sm">
                  {profileRows.map((row) => (
                    <div key={row.label} className="rounded-lg border border-[#e2e8f0] bg-[#fbf8fa] px-3 py-2">
                      <p className="text-xs uppercase tracking-[0.08em] text-[#64748b]">{row.label}</p>
                      <p className="mt-1 font-medium text-[#1b1b1d]">{row.value}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        ) : null}
      </div>

      <FormDialog
        title="Change Password"
        description="Update your account password"
        open={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
          setPasswordForm(defaultPasswordForm);
          setPasswordError(null);
        }}
        onSubmit={() => void onChangePassword()}
        submitLabel="Update Password"
        isSubmitting={passwordSubmitting}
        errorMessage={passwordError}
        headerIcon={<KeyRound className="size-5" />}
      >
        <Input
          label="Current Password"
          type="password"
          value={passwordForm.currentPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
        />
        <Input
          label="New Password"
          type="password"
          value={passwordForm.newPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
        />
        <Input
          label="Confirm New Password"
          type="password"
          value={passwordForm.confirmPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
        />
      </FormDialog>
    </StaffShell>
  );
}
