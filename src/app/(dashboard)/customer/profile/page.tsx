"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  User,
  Car,
  CalendarCheck,
  Wrench,
  History,
  Star,
  Search,
  Bell,
  LockKeyhole,
  Save,
  CheckCircle2,
  ArrowRight,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useCustomerData } from "../../../../hooks/useCustomer";
import { CustomerProfileService } from "../../../../services/customerProfile.service";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, href: "/customer/dashboard" },
  { label: "Profile",   icon: User,        href: "/customer/profile" },
  { label: "Vehicles",  icon: Car,         href: "/customer/vehicles" },
  { label: "Book Service",   icon: CalendarCheck, href: "/customer/appointments" },
  { label: "Request Parts",  icon: Wrench,        href: "/customer/appointments" },
  { label: "History",  icon: History, href: "/customer/dashboard" },
  { label: "Reviews",  icon: Star,    href: "/customer/dashboard" },
];

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 text-[13px] text-[#1e293b] outline-none placeholder:text-[#94a3b8] focus:border-[#c7d2fe] focus:bg-white focus:ring-2 focus:ring-[#e0e7ff] transition"
      />
    </div>
  );
}

export default function ProfilePage() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const { customer, isLoading, error, refetchData } = useCustomerData();
  const [showDropdown, setShowDropdown] = useState(false);

  // Personal details state - initialize with backend data when available
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  // Update form fields when customer data loads
  useEffect(() => {
    if (customer) {
      setFullName(customer.fullName || "");
      setEmail(customer.email || "");
      setPhone(customer.phone || "");
      setLocation(customer.address || "");
      setBio("");
    }
  }, [customer]);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Toast and loading states
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleSave = async () => {

    
    try {
      setIsSaving(true);
      setSaveError(null);
      
      // Validate required fields
      if (!fullName || !email) {
        setSaveError('Name and email are required');
        return;
      }

      // Call the API to update profile
      const response = await CustomerProfileService.updateProfile({
        fullName,
        email,
        phone,
        address: location
      });



      if (response.isSuccess) {

        
        // Refresh customer data to show updated information
        await refetchData();
        
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setSaveError(response.message || 'Failed to save profile. Please try again.');
      }
    } catch (error) {

      setSaveError('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {

    
    try {
      setPasswordError(null);
      
      // Validate password fields
      if (!currentPw || !newPw || !confirmPw) {
        setPasswordError('All password fields are required');
        return;
      }
      
      if (newPw !== confirmPw) {
        setPasswordError('New passwords do not match');
        return;
      }
      
      if (newPw.length < 8) {
        setPasswordError('New password must be at least 8 characters');
        return;
      }
      
      // In a real implementation, this would call an API to change the password
      await new Promise(resolve => setTimeout(resolve, 1000));
      

      
      // Clear password fields
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {

      setPasswordError('Failed to change password. Please try again.');
    }
  };

  const handle2FAToggle = () => {

    setShow2FAModal(true);
  };

  const confirm2FAToggle = async () => {
    try {
      // In a real implementation, this would call an API to toggle 2FA
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTwoFactorEnabled(!twoFactorEnabled);
      setShow2FAModal(false);
      

      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {

    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4338ca] mx-auto"></div>
          <p className="mt-2 text-[13px] text-[#64748b]">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[13px] text-red-600">Error loading profile: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">

        <aside className="hidden w-52 shrink-0 flex-col border-r border-[#dfe4ee] bg-white px-3 py-7 lg:flex">
          <div className="mb-8 px-3">
            <h2 className="text-[18px] font-bold leading-none text-[#4338ca]">AutoFlow</h2>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Manage your vehicles
            </p>
          </div>

          <nav className="flex-1 space-y-0.5">
            {navItems.map(({ label, icon: Icon, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                    active
                      ? "bg-[#eef0fb] text-[#4338ca]"
                      : "text-[#64748b] hover:bg-[#f5f6fb] hover:text-[#4338ca]"
                  }`}
                >
                  <Icon size={16} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  {label}
                  {active && (
                    <span className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-l bg-[#4338ca]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2.5 rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-3 py-2.5">
              <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8]" />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-[#1e293b]">{user?.name || "User"}</p>
                <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">{user?.role || "Member"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#64748b] hover:bg-[#fee2e2] hover:text-[#dc2626] transition"
            >
              <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

          <header className="border-b border-[#dde1ed] bg-white">
            <div className="flex h-14 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <span className="text-[16px] font-bold text-[#4338ca] lg:hidden">AutoFlow</span>
                <label className="flex h-8 w-56 items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-3 text-[12px] text-[#9aa4b2] cursor-text">
                  <Search size={13} aria-hidden="true" />
                  <span>Search components...</span>
                </label>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="relative text-[#64748b] hover:text-[#1e293b]"
                  aria-label="Notifications"
                >
                  <Bell size={19} aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#ef4444]" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <div className="text-right leading-tight">
                      <p className="text-[12px] font-semibold text-[#0f172a]">{user?.name || "User"}</p>
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-[#4338ca]">
                        {user?.role || "Member"}
                      </p>
                    </div>
                    <div className="size-8 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
                  </button>
                  
                  {showDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-[#e8eaf2] bg-white shadow-lg z-20">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-3 text-[13px] font-medium text-[#64748b] hover:bg-[#f8f9fc] hover:text-[#dc2626] transition rounded-xl"
                        >
                          <LogOut size={16} aria-hidden="true" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-7">

            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-bold leading-tight text-[#0f172a]">
                  Account Settings
                </h1>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  Manage your personal information and security preferences.
                </p>
              </div>

              {saved && (
                <div className="flex items-center gap-2 rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2 text-[12px] font-semibold text-[#16a34a] shadow-sm">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  Profile updated successfully
                </div>
              )}

              {saveError && (
                <div className="flex items-center gap-2 rounded-full border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-[12px] font-semibold text-[#dc2626] shadow-sm">
                  {saveError}
                </div>
              )}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">

              <div className="space-y-5">

                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#c7d2fe] to-[#818cf8] ring-2 ring-[#e0e7ff]">
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <User size={28} strokeWidth={1.5} aria-hidden="true" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#0f172a]">Personal Details</h2>
                      <p className="mt-0.5 text-[12px] text-[#64748b]">
                        Your public and contact information
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Full Name"
                      value={fullName}
                      onChange={setFullName}
                    />
                    <Field
                      label="Email Address"
                      value={email}
                      onChange={setEmail}
                      type="email"
                    />
                    <Field
                      label="Phone Number"
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                    />
                    <Field
                      label="Location"
                      value={location}
                      onChange={setLocation}
                    />
                  </div>

                  <div className="mt-4 flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3 text-[13px] text-[#1e293b] outline-none placeholder:text-[#94a3b8] focus:border-[#c7d2fe] focus:bg-white focus:ring-2 focus:ring-[#e0e7ff] transition"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#eef0fb] text-[#4338ca]">
                      <LockKeyhole size={22} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#0f172a]">Password &amp; Security</h2>
                      <p className="mt-0.5 text-[12px] text-[#64748b]">
                        Update your security credentials
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Current Password"
                      value={currentPw}
                      onChange={setCurrentPw}
                      type="password"
                      placeholder="Enter current password"
                    />
                    <Field
                      label="New Password"
                      value={newPw}
                      onChange={setNewPw}
                      type="password"
                      placeholder="Enter new password"
                    />
                    <div className="sm:col-span-2">
                      <Field
                        label="Confirm New Password"
                        value={confirmPw}
                        onChange={setConfirmPw}
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                      <p className="text-[12px] text-red-600">{passwordError}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="mt-4 flex items-center gap-2 rounded-xl bg-[#4338ca] px-4 py-2 text-[13px] font-semibold text-white transition hover:brightness-105"
                  >
                    <LockKeyhole size={14} aria-hidden="true" />
                    Change Password
                  </button>

                  <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-[#4338ca]" aria-hidden="true" />
                      <span className="text-[13px] font-semibold text-[#1e293b]">
                        Two-Factor Authentication is currently{" "}
                        <span className={twoFactorEnabled ? "text-[#16a34a]" : "text-[#dc2626]"}>
                          {twoFactorEnabled ? "ON" : "OFF"}
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handle2FAToggle}
                      className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] hover:underline"
                    >
                      {twoFactorEnabled ? "Disable" : "Enable"} <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  </div>
                </div>

              </div>

              <div className="space-y-4">

                <div className="rounded-2xl bg-[#4338ca] p-6 text-white shadow-[0_4px_16px_rgba(67,56,202,0.3)]">
                  <h3 className="text-[18px] font-bold leading-snug">
                    Ready to update your profile?
                  </h3>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#c7d2fe]">
                    Ensure your contact details are up to date to receive the latest service alerts
                    and exclusive part offers.
                  </p>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[13px] font-bold text-[#4338ca] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition hover:bg-[#f5f6ff] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save size={15} aria-hidden="true" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <h3 className="mb-4 text-[14px] font-bold text-[#0f172a]">Membership Tier</h3>

                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#064e3b]">
                      <User size={18} className="text-[#6ee7b7]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">{user?.role === 'customer' ? 'Premium Member' : user?.role || 'Member'}</p>
                      <p className="text-[11px] text-[#94a3b8]">Since {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#64748b]">Service credits</span>
                      <span className="text-[12px] font-bold text-[#0f172a]">0 remaining</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f3f8]">
                      <div className="h-full w-[0%] rounded-full bg-[#059669]" />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-[#64748b]">
                    Book services to earn credits and unlock exclusive rewards.
                  </p>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 2FA Confirmation Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#eef0fb] text-[#4338ca]">
                <Shield size={24} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-[#0f172a]">
                  {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
                </h3>
                <p className="text-[12px] text-[#64748b]">
                  {twoFactorEnabled 
                    ? 'Your account will be less secure without 2FA' 
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
            </div>

            <p className="mb-6 text-[13px] text-[#64748b]">
              {twoFactorEnabled
                ? 'Are you sure you want to disable two-factor authentication? This will make your account more vulnerable to unauthorized access.'
                : 'Two-factor authentication adds an extra layer of security by requiring a verification code in addition to your password when signing in.'}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShow2FAModal(false)}
                className="flex-1 rounded-xl border border-[#e8eaf2] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#64748b] transition hover:bg-[#f8f9fc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirm2FAToggle}
                className={`flex-1 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white transition hover:brightness-105 ${
                  twoFactorEnabled ? 'bg-[#dc2626]' : 'bg-[#16a34a]'
                }`}
              >
                {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
