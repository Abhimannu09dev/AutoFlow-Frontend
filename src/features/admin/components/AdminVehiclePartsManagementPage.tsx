"use client";

import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Gauge,
  Eye,
  MoreVertical,
  Plus,
  SlidersHorizontal,
  Wrench,
} from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";

type Part = {
  id: string;
  name: string;
  code: string;
  category: string;
  categoryTone: string;
  vendor: string;
  price: string;
  stock: string;
  stockTone: string;
};

type TrendingPart = {
  label: string;
  labelTone: string;
  name: string;
  subtitle: string;
  price: string;
};

const parts: Part[] = [
  {
    id: "part-gt-358",
    name: "Turbocharger GT-358",
    code: "PR-R82-KMT",
    category: "Engine Component",
    categoryTone: "bg-[#e9ebff] text-[#3f51dd]",
    vendor: "Garrett Performance",
    price: "$1,245.00",
    stock: "14 Units",
    stockTone: "bg-[#ffe8e8] text-[#d92d20]",
  },
  {
    id: "part-cb-042",
    name: "Ceramic Brake Pads (Set)",
    code: "PR-C14-BRK",
    category: "Braking System",
    categoryTone: "bg-[#eaf0ff] text-[#445be8]",
    vendor: "Brembo Technical",
    price: "$320.00",
    stock: "42 Units",
    stockTone: "bg-[#eaf8ef] text-[#107f42]",
  },
  {
    id: "part-in-112",
    name: "Ignition Coil Gen-2",
    code: "PN-I12-ELE",
    category: "Electrical",
    categoryTone: "bg-[#ebeefe] text-[#4c5ddf]",
    vendor: "Bosch Electronics",
    price: "$85.40",
    stock: "12 Units",
    stockTone: "bg-[#ffe8e8] text-[#d92d20]",
  },
  {
    id: "part-ow-081",
    name: "Synthetic Oil 0W-30 (1L)",
    code: "PR-O81-FLU",
    category: "Fluids",
    categoryTone: "bg-[#e8eeff] text-[#4f60de]",
    vendor: "Mobil 1 Global",
    price: "$18.99",
    stock: "580 Units",
    stockTone: "bg-[#eaf8ef] text-[#107f42]",
  },
];

const trendingParts: TrendingPart[] = [
  {
    label: "High Demand",
    labelTone: "bg-[#d9f7e8] text-[#0f766e]",
    name: "Performance ECU Chip",
    subtitle: "Firmware version 4.2.1 Stable",
    price: "$499.00",
  },
  {
    label: "Stable",
    labelTone: "bg-[#eef2ff] text-[#4f46e5]",
    name: "Alloy Radiator Unit",
    subtitle: "Universal Fitment Series 3",
    price: "$215.00",
  },
  {
    label: "Low Stock",
    labelTone: "bg-[#ffe8e8] text-[#d92d20]",
    name: "HID Xenon Kit",
    subtitle: "6000K Pure White Luminescence",
    price: "$120.00",
  },
  {
    label: "OEM",
    labelTone: "bg-[#e9ebff] text-[#4338ca]",
    name: "O2 Sensor Pro",
    subtitle: "Adaptive catalytic monitoring",
    price: "$79.00",
  },
];

function FilterPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#dce3f5] bg-[#f8faff] px-3 py-2 text-[12px] font-semibold text-[#334155] transition hover:bg-white"
    >
      {label}
      <ChevronDown className="size-3.5 text-[#64748b]" aria-hidden="true" />
    </button>
  );
}

export default function AdminVehiclePartsManagementPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold text-[#94a3b8]">
              Inventory <span className="text-[#4338ca]">&gt; Parts Management</span>
            </p>
            <h1 className="mt-1 text-[24px] font-bold leading-[1.08] tracking-[-0.03em] text-[#0f172a] ">
              Parts Inventory
            </h1>
            <p className="mt-3 max-w-xl text-[13px] leading-6 text-[#475569]">
              Manage precision-engineered components, monitor real-time stock levels,
              and coordinate with specialized vendors.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d9e2f4] bg-white px-4 text-[13px] font-semibold text-[#334155] transition hover:bg-[#f8faff]"
            >
              <Download className="size-4" aria-hidden="true" />
              Export CSV
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#3625cf] to-[#4f46e5] px-4 text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(53,37,205,0.28)] transition hover:brightness-105"
            >
              <Plus className="size-4" aria-hidden="true" />
              Add Part
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.45fr_0.68fr_0.74fr]">
          <article className="relative min-h-[148px] overflow-hidden rounded-[22px] bg-[#edf2fb] px-5 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(148,163,184,0.18)]">
            <div className="pointer-events-none absolute inset-y-0 right-3 hidden w-[150px] sm:block">
              <Image
                src="/Engine%20detail.png"
                alt="Engine component background"
                fill
                sizes="150px"
                className="object-contain object-center opacity-30 grayscale"
                priority
              />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8f99af]">
              Stock Valuation
            </p>
            <p className="mt-2 text-[34px] font-bold leading-none tracking-[-0.02em] text-[#10223b]">
              $1,482,900.50
            </p>
            <p className="mt-2.5 text-[11px] font-semibold text-[#065f46]">↗ +12.4% vs last month</p>
          </article>

          <article className="min-h-[148px] rounded-[22px] bg-[#f7f8fa] px-5 py-4 shadow-[0_8px_22px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(148,163,184,0.14)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8f99af]">Critical Alerts</p>
            <p className="mt-2 text-[38px] font-bold leading-none tracking-[-0.04em] text-[#b91c1c]">12</p>
            <p className="mt-2 max-w-[180px] text-[12px] leading-5 text-[#334155]">Items require urgent restock</p>
          </article>

          <article className="relative min-h-[148px] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#3b2ed0] via-[#3a2ccc] to-[#3323bb] px-5 py-4 text-white shadow-[0_10px_24px_rgba(59,46,208,0.3)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#cfd6ff]">Active Vendors</p>
            <p className="mt-2 text-[38px] font-bold leading-none tracking-[-0.04em]">84</p>
            <p className="mt-2 max-w-[185px] text-[12px] leading-5 text-[#dbe2ff]">9 new partnerships this Q3</p>
            <div className="pointer-events-none absolute -bottom-2 right-0 h-24 w-28 rotate-[8deg] rounded-tl-3xl bg-[#6f66ff]/20" />
            <div className="pointer-events-none absolute bottom-3 right-6 h-4 w-14 rounded-md bg-[#8b84ff]/30" />
            <div className="pointer-events-none absolute bottom-8 right-6 h-4 w-14 rounded-md bg-[#8b84ff]/20" />
          </article>
        </section>

        <section className="overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.06)] ring-1 ring-[rgba(148,163,184,0.18)]">
          <div className="flex flex-col gap-3 border-b border-[#edf2ff] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill label="Category: All" />
              <FilterPill label="Stock: Low First" />
              <FilterPill label="Price: Any" />
            </div>

            <div className="flex items-center gap-3 text-[12px] text-[#64748b]">
              <span>Showing 150 items</span>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-[#dce3f5] text-[#64748b] transition hover:bg-[#f8faff]"
                aria-label="Open filters"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-[0.17em] text-[#94a3b8]">
                  <th className="px-2 py-4">Part Name &amp; ID</th>
                  <th className="px-2 py-4">Category</th>
                  <th className="px-2 py-4">Vendor</th>
                  <th className="px-2 py-4">Price (Unit)</th>
                  <th className="px-2 py-4">Stock &amp; Quantity</th>
                  <th className="px-2 py-4" />
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => (
                  <tr key={part.id} className="border-t border-[#eef2ff] text-[13px] text-[#334155]">
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#eef2ff] text-[#4f46e5]">
                          <Wrench className="size-4" aria-hidden="true" />
                        </span>
                        <div>
                          <p className="text-[16px] font-semibold leading-tight text-[#0f172a]">{part.name}</p>
                          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.14em] text-[#94a3b8]">
                            ID: {part.code}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${part.categoryTone}`}
                      >
                        {part.category}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-[14px] leading-5 text-[#334155]">{part.vendor}</td>
                    <td className="px-2 py-4 text-[15px] font-semibold text-[#0f172a]">{part.price}</td>
                    <td className="px-2 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${part.stockTone}`}>
                        {part.stock}
                      </span>
                    </td>
                    <td className="px-2 py-4 text-right">
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center rounded-full text-[#94a3b8] transition hover:bg-[#f8faff] hover:text-[#475569]"
                        aria-label={`Open actions for ${part.name}`}
                      >
                        <MoreVertical className="size-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 text-[13px] text-[#64748b] sm:flex-row sm:items-center sm:justify-between">
            <p>Displaying 10 of 150 items</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#dae2f4] text-[#64748b] transition hover:bg-[#f8faff]"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full bg-[#4338ca] text-sm font-semibold text-white"
              >
                1
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full text-[#475569] transition hover:bg-[#f8faff]"
              >
                2
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full text-[#475569] transition hover:bg-[#f8faff]"
              >
                3
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#dae2f4] text-[#64748b] transition hover:bg-[#f8faff]"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[24px] font-bold tracking-[-0.03em] text-[#0f172a]">Trending Hardware</h2>
            <button type="button" className="text-[13px] font-semibold text-[#4338ca] hover:underline">
              View Market Analysis &gt;
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {trendingParts.map((part) => (
              <article
                key={part.name}
                className="rounded-3xl bg-[#eef3ff] p-4 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(148,163,184,0.16)]"
              >
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${part.labelTone}`}>
                  {part.label}
                </span>
                <h3 className="mt-3 text-[18px] font-semibold leading-tight text-[#0f172a]">{part.name}</h3>
                <p className="mt-2 text-[12px] leading-5 text-[#64748b]">{part.subtitle}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[24px] font-bold tracking-[-0.02em] text-[#4338ca]">{part.price}</p>
                  <button
                    type="button"
                    className="inline-flex size-7 items-center justify-center rounded-full border border-[#d9e2f4] bg-white text-[#64748b] transition hover:text-[#0f172a]"
                    aria-label={`Inspect ${part.name}`}
                  >
                    <Eye className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
