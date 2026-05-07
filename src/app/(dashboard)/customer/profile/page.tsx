"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
} from "lucide-react";

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

  // Personal details state
  const [fullName,  setFullName]  = useState("Julianne Blackwood");
  const [email,     setEmail]     = useState("j.blackwood@nexus.com");
  const [phone,     setPhone]     = useState("+1 (555) 234-8901");
  const [location,  setLocation]  = useState("San Francisco, CA");
  const [bio,       setBio]       = useState(
    "Passionate car enthusiast and technology professional. Always looking for the best performance parts for my collection."
  );

  // Password state
  const [currentPw, setCurrentPw] = useState("••••••••••••");
  const [newPw,     setNewPw]     = useState("");

  // Toast
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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

          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-3 py-2.5">
            <div className="size-8 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8]" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#1e293b]">Julianne Blackw...</p>
              <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">Premium Member</p>
            </div>
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
                <div className="flex items-center gap-2">
                  <div className="text-right leading-tight">
                    <p className="text-[12px] font-semibold text-[#0f172a]">Alex Sterling</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wide text-[#4338ca]">
                      Premium Member
                    </p>
                  </div>
                  <div className="size-8 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
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
                    />
                    <Field
                      label="New Password"
                      value={newPw}
                      onChange={setNewPw}
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Shield size={16} className="text-[#4338ca]" aria-hidden="true" />
                      <span className="text-[13px] font-semibold text-[#1e293b]">
                        Two-Factor Authentication is currently{" "}
                        <span className="text-[#4338ca]">ON</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] hover:underline"
                    >
                      Manage <ArrowRight size={13} aria-hidden="true" />
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
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-[13px] font-bold text-[#4338ca] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition hover:bg-[#f5f6ff]"
                  >
                    <Save size={15} aria-hidden="true" />
                    Save Changes
                  </button>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <h3 className="mb-4 text-[14px] font-bold text-[#0f172a]">Membership Tier</h3>

                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#064e3b]">
                      <User size={18} className="text-[#6ee7b7]" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-[#0f172a]">Platinum Member</p>
                      <p className="text-[11px] text-[#94a3b8]">Since October 2022</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-[#64748b]">Service credits</span>
                      <span className="text-[12px] font-bold text-[#0f172a]">12 remaining</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f3f8]">
                      <div className="h-full w-[75%] rounded-full bg-[#059669]" />
                    </div>
                  </div>

                  <p className="mt-3 text-[11px] leading-relaxed text-[#64748b]">
                    Next reward: 15% discount on performance brake kits after 2 more service
                    bookings.
                  </p>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
