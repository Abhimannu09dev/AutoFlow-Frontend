"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import { LockKeyhole, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import { ErrorState, LoadingState, Modal } from "@/shared/components/ui";

import { apiRequest, unwrapData } from "../shared/admin-api";
import type { AdminProfile } from "../shared/admin.types";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<"profile" | "security">("profile");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(initialPasswordForm);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);

    const result = await apiRequest<AdminProfile>("/api/admin/profile");

    if (result.error) {
      setError(result.error);
      setProfile(null);
      setLoading(false);
      return;
    }

    const nextProfile = unwrapData<AdminProfile | null>(result.data, null);
    setProfile(nextProfile);
    setFullName(nextProfile?.fullName ?? "");
    setPhone(nextProfile?.phone ?? "");
    setAddress(nextProfile?.address ?? "");

    setLoading(false);
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const handleProfileSave = async () => {
    setProfileError(null);
    setProfileSuccess(null);

    if (!fullName.trim()) {
      setProfileError("Full name is required.");
      return;
    }

    setSavingProfile(true);

    const result = await apiRequest<AdminProfile>("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
      }),
    });

    if (result.error) {
      setProfileError(result.error);
      setSavingProfile(false);
      return;
    }

    const updatedProfile = unwrapData<AdminProfile | null>(result.data, null);
    setProfile(updatedProfile);
    setFullName(updatedProfile?.fullName ?? fullName.trim());
    setPhone(updatedProfile?.phone ?? "");
    setAddress(updatedProfile?.address ?? "");
    setProfileSuccess("Profile updated successfully.");
    setSavingProfile(false);
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Confirm password must match new password.");
      return;
    }

    setChangingPassword(true);

    const result = await apiRequest<boolean>("/api/admin/change-password", {
      method: "POST",
      body: JSON.stringify(passwordForm),
    });

    if (result.error) {
      setPasswordError(result.error);
      setChangingPassword(false);
      return;
    }

    setPasswordSuccess("Password updated successfully.");
    setPasswordForm(initialPasswordForm);
    setChangingPassword(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-[32px] font-semibold tracking-[-0.02em] text-[#1b1b1d]">Admin Settings</h1>
          <p className="mt-1 text-base text-[#45474c]">Manage your workshop preferences and administrative details.</p>
        </header>

        {loading ? <LoadingState message="Loading settings..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={loadProfile} /> : null}

        {!loading && !error ? (
          <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
            <aside className="h-fit rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setTab("profile")}
                className={`flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-lg ${
                  tab === "profile"
                    ? "border-l-2 border-[#0d9488] bg-[#f0edef] text-[#1b1b1d]"
                    : "text-[#45474c]"
                }`}
              >
                <User className="size-4" />
                Profile Settings
              </button>
              <button
                type="button"
                onClick={() => setTab("security")}
                className={`flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-lg ${
                  tab === "security"
                    ? "border-l-2 border-[#0d9488] bg-[#f0edef] text-[#1b1b1d]"
                    : "text-[#45474c]"
                }`}
              >
                <ShieldCheck className="size-4" />
                Security Settings
              </button>
            </aside>

            <section className="space-y-4">
              <article className="rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] shadow-sm">
                <header className="border-b border-[#c5c6cd] px-5 py-4">
                  <h2 className="text-3xl font-semibold text-[#1b1b1d]">
                    {tab === "profile" ? "Profile Settings" : "Security Settings"}
                  </h2>
                  <p className="text-sm font-semibold text-[#45474c]">
                    {tab === "profile"
                      ? "Profile data is loaded from backend and can be updated."
                      : "Use change password to update your account credentials."}
                  </p>
                </header>

                {tab === "profile" ? (
                  <div className="grid gap-4 p-5 md:grid-cols-2">
                    {profileError ? (
                      <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c] md:col-span-2">
                        {profileError}
                      </div>
                    ) : null}
                    {profileSuccess ? (
                      <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534] md:col-span-2">
                        {profileSuccess}
                      </div>
                    ) : null}

                    <label className="text-sm font-medium text-[#1b1b1d]">
                      Full Name
                      <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-lg"
                      />
                    </label>

                    <label className="text-sm font-medium text-[#1b1b1d]">
                      Email Address
                      <input
                        value={profile?.email ?? ""}
                        readOnly
                        className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-[#f5f3f4] px-3 py-2 text-lg"
                      />
                    </label>

                    <label className="text-sm font-medium text-[#1b1b1d]">
                      Phone Number
                      <input
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-lg"
                      />
                    </label>

                    <label className="text-sm font-medium text-[#1b1b1d]">
                      Role
                      <input
                        value={profile?.role ?? "Admin"}
                        readOnly
                        className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-[#f5f3f4] px-3 py-2 text-lg"
                      />
                    </label>

                    <label className="text-sm font-medium text-[#1b1b1d] md:col-span-2">
                      Address
                      <input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-lg"
                      />
                    </label>

                    <div className="md:col-span-2">
                      <button
                        type="button"
                        onClick={() => void handleProfileSave()}
                        disabled={savingProfile}
                        className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {savingProfile ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid place-items-center gap-4 p-6 text-center">
                    <span className="rounded-full bg-[#f0edef] p-4 text-[#1e293b]">
                      <LockKeyhole className="size-6" />
                    </span>
                    <div>
                      <p className="text-3xl font-medium text-[#1b1b1d]">Password Management</p>
                      <p className="text-sm font-semibold text-[#45474c]">Use the backend change-password API securely.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordModalOpen(true);
                        setPasswordError(null);
                        setPasswordSuccess(null);
                      }}
                      className="w-full rounded-lg border border-[#1e293b] px-4 py-2 text-2xl font-medium text-[#1e293b]"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </article>
            </section>
          </div>
        ) : null}
      </div>

      <Modal
        title="Change Password"
        open={passwordModalOpen}
        onClose={() => {
          setPasswordModalOpen(false);
          setPasswordError(null);
          setPasswordSuccess(null);
          setPasswordForm(initialPasswordForm);
        }}
        maxWidthClassName="max-w-lg"
        footer={(
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setPasswordModalOpen(false);
                setPasswordError(null);
                setPasswordSuccess(null);
                setPasswordForm(initialPasswordForm);
              }}
              className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleChangePassword()}
              disabled={changingPassword}
              className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}
      >
        <div className="space-y-4">
          {passwordError ? (
            <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
              {passwordError}
            </div>
          ) : null}

          {passwordSuccess ? (
            <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
              {passwordSuccess}
            </div>
          ) : null}

          <label className="block text-sm font-medium text-[#1b1b1d]">
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-[#1b1b1d]">
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2"
            />
          </label>

          <label className="block text-sm font-medium text-[#1b1b1d]">
            Confirm Password
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2"
            />
          </label>
        </div>
      </Modal>
    </AdminLayout>
  );
}
