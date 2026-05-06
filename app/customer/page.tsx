"use client";

import Image from "next/image";
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
  ShoppingCart,
  PlusCircle,
  Package,
  CheckCircle,
  ShoppingBag,
  Clock,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// ─── Nav items ───────────────────────────────────────────────────────────────

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Profile", icon: User },
  { label: "Vehicles", icon: Car },
  { label: "Book Service", icon: CalendarCheck },
  { label: "Request Parts", icon: Wrench },
  { label: "History", icon: History },
  { label: "Reviews", icon: Star },
];

// ─── Stat cards ──────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Total Purchases",
    value: "$2,450.00",
    icon: ShoppingCart,
    iconBg: "bg-[#e8f5e9]",
    iconColor: "text-[#16a34a]",
    badge: null,
  },
  {
    label: "Upcoming Appointments",
    value: "1",
    icon: CalendarCheck,
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
    badge: "Next: Tomorrow",
    badgeColor: "bg-[#ede9fe] text-[#7c3aed]",
  },
  {
    label: "Registered Vehicles",
    value: "2",
    icon: Car,
    iconBg: "bg-[#e0f2fe]",
    iconColor: "text-[#0284c7]",
    badge: null,
  },
];

// ─── Recent activity ─────────────────────────────────────────────────────────

const activities = [
  {
    title: "Service Appointment Completed",
    date: "OCT 24, 2023",
    desc: "Annual maintenance check for your 2021 Silver Sedan. Everything in optimal condition.",
    icon: CheckCircle,
    iconBg: "bg-[#16a34a]",
    iconColor: "text-white",
  },
  {
    title: "Oil Filter Purchase",
    date: "OCT 20, 2023",
    desc: "High-performance synthetic oil filter (Model: HF-204) was successfully ordered.",
    icon: ShoppingBag,
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
  },
  {
    title: "Part Request Initiated",
    date: "OCT 16, 2023",
    desc: "Inquiry for brake pad replacements has been sent to our atelier team.",
    icon: Clock,
    iconBg: "bg-[#e0f2fe]",
    iconColor: "text-[#0284c7]",
  },
];

// ─── Vehicles ────────────────────────────────────────────────────────────────

const vehicles = [
  {
    name: "2021 Silver Sedan",
    vin: "VIN: **** 6920",
    badge: "Active",
    badgeColor: "bg-[#dcfce7] text-[#16a34a]",
    serviceDue: false,
    img: "/car-bg.svg",
  },
  {
    name: "2019 Black SUV",
    vin: "VIN: **** 8112",
    badge: "Service Due",
    badgeColor: "bg-[#fee2e2] text-[#dc2626]",
    serviceDue: true,
    img: "/car-bg.svg",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-[#dfe4ee] bg-white px-3 py-7 lg:flex">
          {/* Brand */}
          <div className="mb-8 px-3">
            <h2 className="text-[18px] font-bold leading-none text-[#4338ca]">AutoFlow</h2>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Manage Your Vehicles
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5">
            {navItems.map(({ label, icon: Icon }, i) => {
              const active = i === 0;
              return (
                <button
                  key={label}
                  type="button"
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
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
                </button>
              );
            })}
          </nav>

          {/* User chip */}
          <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-3 py-2.5">
            <div className="size-8 shrink-0 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8]" />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#1e293b]">Alex Sterling</p>
              <p className="text-[10px] uppercase tracking-wide text-[#94a3b8]">Gold Member</p>
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

          {/* Header */}
          <header className="border-b border-[#dde1ed] bg-white">
            <div className="flex h-13 items-center justify-between px-6 py-3">
              {/* Logo (mobile) + Search */}
              <div className="flex items-center gap-4">
                <span className="text-[16px] font-bold text-[#4338ca] lg:hidden">AutoFlow</span>
                <label className="flex h-8 w-56 items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-3 text-[12px] text-[#9aa4b2] cursor-text">
                  <Search size={13} aria-hidden="true" />
                  Search components...
                </label>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <button type="button" className="relative text-[#64748b] hover:text-[#1e293b]">
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

          {/* Page body */}
          <main className="flex-1 overflow-y-auto px-6 py-7">

            {/* Welcome */}
            <div className="mb-6">
              <h1 className="text-[26px] font-bold text-[#0f172a]">Welcome back, Alex.</h1>
              <p className="mt-1 text-[13px] text-[#64748b]">
                Your garage is looking great. Here's a summary of your performance and upcoming tasks.
              </p>
            </div>

            {/* Stat cards */}
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`flex size-9 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                        <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                      </div>
                      {s.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.badgeColor}`}>
                          {s.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748b]">{s.label}</p>
                    <p className="mt-1 text-[24px] font-bold text-[#0f172a]">{s.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Hero banner + profile completion */}
            <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px]">
              {/* Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-[#f0f1fb] shadow-[0_1px_4px_rgba(15,23,42,0.07)]">
                {/* Background car image fades in on right */}
                <div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden">
                  <Image
                    src="/car-bg.svg"
                    alt="Car interior"
                    fill
                    className="object-cover object-left opacity-60"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f0f1fb] via-[#f0f1fb]/60 to-transparent" />
                </div>

                <div className="relative z-10 p-7">
                  <h2 className="max-w-[260px] text-[20px] font-bold leading-snug text-[#0f172a]">
                    Keep your fleet in peak condition.
                  </h2>
                  <p className="mt-2 max-w-[280px] text-[12px] leading-relaxed text-[#475569]">
                    Schedule routine maintenance or request specialized parts directly from your
                    dashboard. We use only OEM certified components.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="flex h-9 items-center gap-2 rounded-xl bg-[#4338ca] px-4 text-[12px] font-semibold text-white shadow-[0_4px_10px_rgba(67,56,202,0.3)] transition hover:brightness-105"
                    >
                      <CalendarCheck size={14} aria-hidden="true" />
                      Book Service
                    </button>
                    <button
                      type="button"
                      className="flex h-9 items-center gap-2 rounded-xl border border-[#dde1ed] bg-white px-4 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f8f9fc]"
                    >
                      <PlusCircle size={14} aria-hidden="true" />
                      Add Vehicle
                    </button>
                    <button
                      type="button"
                      className="flex h-9 items-center gap-2 rounded-xl border border-[#dde1ed] bg-white px-4 text-[12px] font-semibold text-[#374151] transition hover:bg-[#f8f9fc]"
                    >
                      <Package size={14} aria-hidden="true" />
                      Request Part
                    </button>
                  </div>
                </div>
              </div>

              {/* Profile completion */}
              <div className="flex flex-col justify-between rounded-2xl bg-[#4338ca] p-5 text-white shadow-[0_4px_16px_rgba(67,56,202,0.3)]">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a5b4fc]">
                  Account Status
                </p>
                <div>
                  <p className="mt-2 text-[28px] font-bold leading-none">90% Complete</p>
                  <p className="mt-3 text-[11px] leading-relaxed text-[#c7d2fe]">
                    Add your vehicle identification number (VIN) to unlock personalised maintenance
                    schedules and part recommendations.
                  </p>
                  <button
                    type="button"
                    className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-white underline-offset-2 hover:underline"
                  >
                    Complete Profile <ArrowRight size={13} aria-hidden="true" />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3730a3]">
                    <div className="h-full w-[90%] rounded-full bg-white/80" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity + Registered Vehicles */}
            <div className="grid gap-5 lg:grid-cols-2">

              {/* Recent Activity */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Activity</h2>
                  <button type="button" className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] hover:underline">
                    View All History <ChevronRight size={13} aria-hidden="true" />
                  </button>
                </div>

                <div className="space-y-4">
                  {activities.map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={a.title} className="flex gap-3">
                        <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg} ${a.iconColor}`}>
                          <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[13px] font-semibold text-[#1e293b]">{a.title}</p>
                            <span className="shrink-0 text-[10px] text-[#94a3b8]">{a.date}</span>
                          </div>
                          <p className="mt-0.5 text-[12px] leading-snug text-[#64748b]">{a.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registered Vehicles */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                <h2 className="mb-4 text-[15px] font-bold text-[#0f172a]">Registered Vehicles</h2>

                <div className="space-y-3">
                  {vehicles.map((v) => (
                    <div
                      key={v.name}
                      className="flex items-center gap-3 rounded-xl border border-[#f1f3f8] p-3 transition hover:bg-[#f8f9fc]"
                    >
                      {/* Car thumbnail */}
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f1f3f8]">
                        <Image
                          src={v.img}
                          alt={v.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${v.badgeColor}`}>
                            {v.badge}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] font-bold text-[#1e293b]">{v.name}</p>
                        <p className="text-[11px] text-[#94a3b8]">{v.vin}</p>
                        <div className="mt-1.5 flex gap-3 text-[11px] font-semibold text-[#4338ca]">
                          {v.serviceDue ? (
                            <>
                              <button type="button" className="hover:underline">Book Now</button>
                              <button type="button" className="hover:underline">Details</button>
                            </>
                          ) : (
                            <>
                              <button type="button" className="hover:underline">Details</button>
                              <button type="button" className="hover:underline">Log History</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add vehicle CTA */}
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c7d2fe] bg-[#f5f6ff] py-3 text-[12px] font-semibold text-[#4338ca] transition hover:bg-[#eef0fb]"
                >
                  <PlusCircle size={14} aria-hidden="true" />
                  <span>
                    Add another vehicle
                    <span className="ml-1 font-normal text-[#94a3b8]">— Expand your fleet management capabilities.</span>
                  </span>
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
