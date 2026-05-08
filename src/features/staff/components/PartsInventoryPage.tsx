import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Filter,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Truck,
} from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";
import Badge from "@/shared/components/ui/Badge";
import PageHeader from "@/shared/components/ui/PageHeader";
import SectionCard from "@/shared/components/ui/SectionCard";
import StatCard from "@/shared/components/ui/StatCard";

type InventoryRow = {
  name: string;
  id: string;
  category: string;
  vendor: string;
  price: string;
  stock: string;
  status: "low" | "steady" | "urgent";
};

const inventoryRows: InventoryRow[] = [
  {
    name: "Turbocharger GT-358",
    id: "PR-982-SMT",
    category: "Engine Component",
    vendor: "Garrett Performance",
    price: "$1,245.00",
    stock: "14 Units",
    status: "urgent",
  },
  {
    name: "Ceramic Brake Pads (Set)",
    id: "PR-614-BRK",
    category: "Braking System",
    vendor: "Brembo Technical",
    price: "$320.00",
    stock: "42 Units",
    status: "steady",
  },
  {
    name: "Ignition Coil Gen-2",
    id: "PR-712-ELE",
    category: "Electrical",
    vendor: "Bosch Electronics",
    price: "$85.40",
    stock: "12 Units",
    status: "urgent",
  },
  {
    name: "Synthetic Oil 0W-30 (1L)",
    id: "PR-083-FLD",
    category: "Fluids",
    vendor: "Mobil 1 Global",
    price: "$18.99",
    stock: "580 Units",
    status: "steady",
  },
];

const trendingParts = [
  {
    name: "Performance ECU Chip",
    category: "HIGH DEMAND",
    price: "$499.00",
    description: "Firmware version 4.2.1 Stable",
  },
  {
    name: "Alloy Radiator Unit",
    category: "STABLE",
    price: "$215.00",
    description: "Universal Fitment Series 3",
  },
  {
    name: "HID Xenon Kit",
    category: "LOW STOCK",
    price: "$120.00",
    description: "6000K Pure White Luminescence",
  },
  {
    name: "O2 Sensor Pro",
    category: "REORDER",
    price: "$75.00",
    description: "High accuracy emissions sensor",
  },
];

const filters = ["Category: All", "Stock: Low First", "Price: Any"];

function statusStyle(status: InventoryRow["status"]) {
  if (status === "urgent") return "bg-[#fee2e2] text-[#dc2626]";
  if (status === "low") return "bg-[#fef3c7] text-[#d97706]";
  return "bg-[#e0f2fe] text-[#0369a1]";
}

function InventoryTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-3">
        <thead>
          <tr className="text-left text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
            <th className="pb-2 pl-3">Part Name &amp; ID</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Vendor</th>
            <th className="pb-2">Price (Unit)</th>
            <th className="pb-2">Stock Quantity</th>
            <th className="pb-2 text-right"> </th>
          </tr>
        </thead>
        <tbody>
          {inventoryRows.map((row) => (
            <tr
              key={row.id}
              className="rounded-2xl bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(199,196,216,0.16)]"
            >
              <td className="rounded-l-2xl px-3 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#4f46e5]">
                    <Boxes className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#0f172a]">{row.name}</p>
                    <p className="mt-0.5 text-[10px] font-medium tracking-[0.12em] text-[#94a3b8]">
                      ID: {row.id}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-2 py-4">
                <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4f46e5]">
                  {row.category}
                </span>
              </td>
              <td className="px-2 py-4 text-[13px] text-[#334155]">{row.vendor}</td>
              <td className="px-2 py-4 text-[13px] font-bold text-[#0f172a]">{row.price}</td>
              <td className="px-2 py-4">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(row.status)}`}>
                  {row.stock}
                </span>
              </td>
              <td className="rounded-r-2xl px-3 py-4 text-right text-[#94a3b8]">
                <button
                  type="button"
                  className="inline-flex size-8 items-center justify-center rounded-full hover:bg-[#f8fafc] hover:text-[#4338ca]"
                  aria-label={`Open actions for ${row.name}`}
                >
                  <MoreVertical className="size-4" aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrendingCard({ name, category, price, description }: (typeof trendingParts)[number]) {
  return (
    <article className="rounded-[24px] border border-[rgba(199,196,216,0.16)] bg-[linear-gradient(180deg,#f8faff_0%,#eef2ff_100%)] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(79,70,229,0.12)]">
      <div className="mb-4 flex items-center justify-between">
        <Badge
          label={category}
          colorClass={
            category === "HIGH DEMAND"
              ? "bg-[#dcfce7] text-[#047857]"
              : category === "LOW STOCK"
                ? "bg-[#fee2e2] text-[#dc2626]"
                : category === "REORDER"
                  ? "bg-[#fef3c7] text-[#d97706]"
                  : "bg-[#e0e7ff] text-[#4338ca]"
          }
        />
        <div className="flex size-9 items-center justify-center rounded-full bg-white text-[#4f46e5] shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
      </div>
      <h3 className="text-[15px] font-bold text-[#0f172a]">{name}</h3>
      <p className="mt-1 text-[12px] leading-5 text-[#64748b]">{description}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-[14px] font-bold text-[#4f46e5]">{price}</p>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#475569] transition hover:text-[#4338ca]"
        >
          View
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export default function PartsInventoryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader
          title="Parts Inventory"
          subtitle="Inventory · Parts Management"
          actions={
            <>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(199,196,216,0.34)] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-[#f8faff]"
              >
                <ArrowDownToLine className="size-4" aria-hidden="true" />
                Export CSV
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3525cd] to-[#4f46e5] px-4 py-2.5 text-[13px] font-semibold text-white shadow-[0_10px_15px_-3px_rgba(53,37,205,0.18)] transition hover:brightness-105"
              >
                <Plus className="size-4" aria-hidden="true" />
                Add Part
              </button>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-[rgba(199,196,216,0.14)] bg-[#eef2ff] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:col-span-1">
            <div className="flex h-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                  Stock Valuation
                </p>
                <p className="mt-2 text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-none tracking-[-0.04em] text-[#0f172a]">
                  $1,482,900.50
                </p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold text-[#047857]">
                  <span>↗</span> +12.4% vs last month
                </p>
              </div>

              <div className="relative flex h-24 w-full max-w-[150px] items-center justify-center overflow-hidden rounded-[18px] bg-[#dbe2f3] sm:h-28 sm:w-36">
                <Image
                  src="/Engine.png"
                  alt="Engine component"
                  fill
                  sizes="(max-width: 768px) 100vw, 180px"
                  className="object-cover opacity-90 grayscale"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(238,242,255,0.05),rgba(238,242,255,0.52))]" />
              </div>
            </div>
          </article>
          <StatCard
            label="Critical Alerts"
            value="12"
            icon={CircleAlert}
            iconBg="bg-[#fff1f2]"
            iconColor="text-[#dc2626]"
            badge="Restock"
            badgeColor="bg-[#fee2e2] text-[#dc2626]"
          />
          <StatCard
            label="Active Vendors"
            value="84"
            icon={Truck}
            iconBg="bg-[#ecfeff]"
            iconColor="text-[#0f766e]"
            badge="Q3"
            badgeColor="bg-[#dbeafe] text-[#1d4ed8]"
          />
        </section>

        <SectionCard className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold transition ${
                    index === 0
                      ? "bg-[#eff4ff] text-[#4338ca]"
                      : "bg-[#f8fafc] text-[#475569] hover:bg-[#eef2ff] hover:text-[#4338ca]"
                  }`}
                >
                  {index === 0 ? <Filter className="size-3.5" aria-hidden="true" /> : null}
                  {filter}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[12px] text-[#64748b]">
              <span>Showing 150 items</span>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-[#f8fafc] hover:text-[#4338ca]"
                aria-label="Adjust filters"
              >
                <SlidersHorizontal className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 hover:bg-[#f8fafc] hover:text-[#4338ca]"
                aria-label="Search inventory"
              >
                <Search className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <InventoryTable />

          <div className="flex items-center justify-between border-t border-[rgba(199,196,216,0.18)] pt-4 text-[12px] text-[#64748b]">
            <p>Displaying 10 of 150 items</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[rgba(199,196,216,0.24)] bg-white hover:bg-[#f8fafc]"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-[0_8px_16px_rgba(79,70,229,0.22)]"
              >
                1
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[rgba(199,196,216,0.24)] bg-white hover:bg-[#f8fafc]"
              >
                2
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[rgba(199,196,216,0.24)] bg-white hover:bg-[#f8fafc]"
              >
                3
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[rgba(199,196,216,0.24)] bg-white hover:bg-[#f8fafc]"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[#0f172a]">Trending Hardware</h2>
            <p className="mt-1 text-[13px] text-[#64748b]">Fast-moving inventory and restock candidates.</p>
          </div>
          <Link href="/staff/inventory" className="text-[13px] font-semibold text-[#4f46e5] transition hover:underline">
            View Market Analysis →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {trendingParts.map((part) => (
            <TrendingCard key={part.name} {...part} />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}