"use client";

import {
  LayoutGrid,
  UserPlus,
  Users,
  FileText,
  BarChart3,
  Mail,
  Search,
  Bell,
  Download,
  RefreshCw,
  UserRoundPlus,
  UserSearch,
  ShoppingCart,
  SendHorizonal,
  CirclePlus,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const sideNavItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Customer Registration", icon: UserPlus },
  { label: "Customer Management", icon: Users },
  { label: "Sales & Invoices", icon: FileText },
  { label: "Reports", icon: BarChart3 },
  { label: "Email Service", icon: Mail },
];

const statCards = [
  {
    label: "Today's Sales",
    value: "$4,250",
    badge: "+12% vs yesterday",
    badgeColor: "bg-[#e8f5e9] text-[#2e7d32]",
    icon: "💳",
  },
  {
    label: "Total Customers",
    value: "1,240",
    badge: null,
    icon: "👥",
  },
  {
    label: "Pending Invoices",
    value: "12",
    badge: "Action Required",
    badgeColor: "bg-[#fff3e0] text-[#e65100]",
    icon: "🧾",
  },
  {
    label: "Credit Customers",
    value: "45",
    badge: null,
    icon: "💳",
  },
];

const recentSales = [
  { time: "10:45 AM", customer: "Jonathan Meyers", amount: "$1,240.00", status: "Completed", statusColor: "bg-[#e8f5e9] text-[#2e7d32]" },
  { time: "09:30 AM", customer: "Sarah Jenkins", amount: "$450.50", status: "In Progress", statusColor: "bg-[#e3f2fd] text-[#1565c0]" },
  { time: "08:15 AM", customer: "Atlas Logistics", amount: "$2,560.00", status: "Pending Payment", statusColor: "bg-[#fce4ec] text-[#c62828]" },
];

const topParts = [
  { name: "V8 Spark Plugs", sub: "High Demand", subColor: "text-[#4338ca]", icon: "⚙️" },
  { name: "Synth-Grade Oil", sub: "12 in stock", subColor: "text-[#475569]", icon: "🛢️" },
  { name: "Michelin 245/40", sub: "Restock Needed", subColor: "text-[#c62828]", icon: "🔧" },
];

const recentActivity = [
  { title: "New Registration", desc: "David Chen joined as a Premium Member.", time: "2 mins ago", dot: "bg-[#4338ca]" },
  { title: "Profile Updated", desc: "Fleet Logistics updated billing address.", time: "1 hour ago", dot: "bg-[#16a34a]" },
  { title: "New Registration", desc: "Maria Garcia added to Customer List.", time: "3 hours ago", dot: "bg-[#4338ca]" },
];

const quickActions = [
  { label: "Register Customer", icon: UserRoundPlus },
  { label: "Search Customer", icon: UserSearch },
  { label: "New Sale", icon: ShoppingCart },
  { label: "Send Invoice", icon: SendHorizonal },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">

        {/* ── Sidebar ── */}
        <aside className="hidden w-56 shrink-0 flex-col border-r border-[#dfe4ee] bg-[#f3f5fa] px-3 py-8 lg:flex">
          {/* Brand */}
          <div className="mb-10 px-3">
            <h2 className="text-[20px] font-bold leading-none text-[#4338ca]">AutoFlow</h2>
            <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-[#6b7280]">STAFF PANEL</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {sideNavItems.map(({ label, icon: Icon }, index) => {
              const active = index === 0;
              return (
                <button
                  key={label}
                  type="button"
                  className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition ${
                    active
                      ? "bg-[#eceef5] text-[#4338ca]"
                      : "text-[#6d7785] hover:bg-[#eceef5] hover:text-[#4338ca]"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
                  <span className="leading-tight">{label}</span>
                  {active && (
                    <span className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l bg-[#4338ca]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* New Service */}
          <button
            type="button"
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3730a3] to-[#4f46e5] text-[13px] font-semibold text-white shadow-[0_6px_14px_rgba(67,56,202,0.3)] transition hover:brightness-105"
          >
            <CirclePlus size={16} aria-hidden="true" />
            New Service
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">

          {/* Header */}
          <header className="border-b border-[#dde1ed] bg-white">
            <div className="flex h-14 items-center justify-between px-6">
              {/* Search */}
              <label className="flex h-9 w-full max-w-sm items-center gap-2 rounded-full border border-[#e6e9f1] bg-[#f8f9fc] px-4 text-[13px] text-[#9aa4b2] cursor-text">
                <Search size={15} aria-hidden="true" />
                <span>Search orders, parts, or customers...</span>
              </label>

              {/* Right */}
              <div className="ml-4 flex shrink-0 items-center gap-5">
                <button type="button" className="flex items-center gap-1.5 text-[13px] font-medium text-[#475569] hover:text-[#1e293b]">
                  <span className="text-[15px]">?</span> Help
                </button>
                <button type="button" className="relative text-[#475569] hover:text-[#1e293b]">
                  <Bell size={20} aria-hidden="true" />
                  <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#ef4444]" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="text-right leading-tight">
                    <p className="text-[13px] font-semibold text-[#0f172a]">Alex Fischer</p>
                    <p className="text-[10px] uppercase tracking-wide text-[#64748b]">Senior Curator</p>
                  </div>
                  <div className="size-9 rounded-full bg-gradient-to-br from-[#ff9f7a] to-[#38bdf8] ring-2 ring-white" />
                </div>
              </div>
            </div>
          </header>

          {/* Page body */}
          <main className="flex-1 overflow-y-auto px-6 py-7">

            {/* Page title row */}
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-[26px] font-bold leading-tight text-[#0f172a]">Atelier Dashboard</h1>
                <p className="mt-1 text-[13px] text-[#64748b]">
                  Operational pulse for{" "}
                  <span className="font-semibold text-[#4338ca]">October 24, 2023</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg border border-[#dde1ed] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8f9fc]"
                >
                  <Download size={14} aria-hidden="true" />
                  Download Report
                </button>
                <button
                  type="button"
                  className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#3730a3] to-[#4f46e5] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(67,56,202,0.3)] transition hover:brightness-105"
                >
                  <RefreshCw size={14} aria-hidden="true" />
                  System Sync
                </button>
              </div>
            </div>

            {/* Content grid: left column + right sidebar */}
            <div className="grid gap-5 xl:grid-cols-[1fr_260px]">

              {/* ── Left column ── */}
              <div className="space-y-5">

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {statCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]"
                    >
                      {card.badge && (
                        <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${card.badgeColor}`}>
                          {card.badge}
                        </span>
                      )}
                      <p className="text-[12px] text-[#64748b]">{card.label}</p>
                      <p className="mt-1 text-[24px] font-bold text-[#0f172a]">{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Sales Activity */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Sales Activity</h2>
                    <button type="button" className="text-[13px] font-semibold text-[#4338ca] hover:underline">
                      View All
                    </button>
                  </div>

                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-[#f1f3f8]">
                        {["TIME", "CUSTOMER", "AMOUNT", "STATUS"].map((h) => (
                          <th
                            key={h}
                            className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((row) => (
                        <tr key={row.customer} className="border-b border-[#f8f9fc] last:border-0">
                          <td className="py-3 text-[#64748b]">{row.time}</td>
                          <td className="py-3 font-semibold text-[#1e293b]">{row.customer}</td>
                          <td className="py-3 font-semibold text-[#1e293b]">{row.amount}</td>
                          <td className="py-3">
                            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.statusColor}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top Velocity Parts */}
                <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Top Velocity Parts
                  </h2>
                  <div className="grid grid-cols-3 gap-3">
                    {topParts.map((part) => (
                      <div
                        key={part.name}
                        className="flex flex-col items-center rounded-xl bg-[#f5f6fb] p-4 text-center"
                      >
                        <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[#eceef8] text-xl">
                          {part.icon}
                        </div>
                        <p className="text-[12px] font-semibold text-[#1e293b]">{part.name}</p>
                        <p className={`mt-0.5 text-[11px] font-semibold ${part.subColor}`}>{part.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right sidebar ── */}
              <div className="space-y-4">

                {/* Quick Actions */}
                <div className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        className="flex flex-col items-center gap-2 rounded-xl bg-[#f5f6fb] px-3 py-4 text-center transition hover:bg-[#eceef8]"
                      >
                        <div className="flex size-9 items-center justify-center rounded-xl bg-[#eceef8] text-[#4338ca]">
                          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                        </div>
                        <span className="text-[11px] font-semibold leading-tight text-[#374151]">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-2xl bg-white p-4 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
                  <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {recentActivity.map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.dot}`} />
                        <div>
                          <p className="text-[13px] font-bold text-[#1e293b]">{item.title}</p>
                          <p className="mt-0.5 text-[12px] leading-snug text-[#64748b]">{item.desc}</p>
                          <p className="mt-1 text-[11px] text-[#94a3b8]">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#e8eaf2] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748b] transition hover:bg-[#f8f9fc]"
                  >
                    Load More History
                    <span className="flex size-6 items-center justify-center rounded-full bg-[#4338ca] text-white text-base font-bold leading-none">
                      +
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
