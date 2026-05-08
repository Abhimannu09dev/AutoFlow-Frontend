"use client";

import type { ReactNode } from "react";
import {
  BadgeCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Truck,
} from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";

type VendorCategory = "OEM Parts" | "Custom Fabrics" | "Electronics";

type Vendor = {
  id: string;
  shortCode: string;
  shortCodeTone: string;
  name: string;
  category: VendorCategory;
  email: string;
  phone: string;
  operationalHq: string;
};

const vendors: Vendor[] = [
  {
    id: "V-9021",
    shortCode: "BM",
    shortCodeTone: "bg-[#e8e8ff] text-[#4f46e5]",
    name: "Bayer Motoren Parts",
    category: "OEM Parts",
    email: "contact@bayermotoren.de",
    phone: "+49 89 3820",
    operationalHq: "Petuelring 130, Munich, Germany",
  },
  {
    id: "V-1142",
    shortCode: "TE",
    shortCodeTone: "bg-[#e7f8f1] text-[#0f766e]",
    name: "Titanium Exhausts Ltd",
    category: "Custom Fabrics",
    email: "supply@titanium.co.uk",
    phone: "+44 20 7946 0958",
    operationalHq: "22 Industrial Way, London, UK",
  },
  {
    id: "V-5561",
    shortCode: "NS",
    shortCodeTone: "bg-[#fff2e9] text-[#c2410c]",
    name: "NextGen Sensors",
    category: "Electronics",
    email: "p.young@nextgen.io",
    phone: "+1 650 555 0122",
    operationalHq: "101 Silicon Valley, CA, USA",
  },
];

function CategoryBadge({ category }: { category: VendorCategory }) {
  const badgeTone: Record<VendorCategory, string> = {
    "OEM Parts": "bg-[#ecebff] text-[#4f46e5]",
    "Custom Fabrics": "bg-[#d8f5ef] text-[#0f766e]",
    Electronics: "bg-[#ecebff] text-[#6366f1]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${badgeTone[category]}`}
    >
      {category}
    </span>
  );
}

function StatCard({
  icon,
  title,
  value,
  footnote,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  footnote: string;
}) {
  return (
    <section className="rounded-[24px] bg-white px-5 py-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(148,163,184,0.15)]">
      <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-[#efedff] text-[#4f46e5]">
        {icon}
      </div>
      <p className="text-[12px] font-medium text-[#475569]">{title}</p>
      <p className="mt-1 text-[26px] font-bold leading-[1.05] tracking-[-0.02em] text-[#0f172a]">{value}</p>
      <p className="mt-1 text-[11px] font-semibold text-[#0f766e]">{footnote}</p>
    </section>
  );
}

export default function AdminVendorManagementPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-[-0.03em] text-[#0f172a]">Vendor Portfolio</h1>
            <p className="mt-2 text-[13px] text-[#475569]">
              Curating high-precision suppliers and logistical partners for the atelier.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 self-start rounded-lg bg-gradient-to-r from-[#3625cf] to-[#4f46e5] px-3 text-[12px] font-semibold text-white shadow-[0_8px_16px_rgba(53,37,205,0.18)] transition hover:brightness-105"
          >
            <CirclePlus className="size-2" aria-hidden="true" />
            Register New Vendor
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr]">
          <StatCard
            icon={<Building2 className="size-5" aria-hidden="true" />}
            title="Total Vendors"
            value="42"
            footnote="↗ +3 this month"
          />
          <StatCard
            icon={<Truck className="size-5" aria-hidden="true" />}
            title="Active Logistics"
            value="12"
            footnote="Stable performance"
          />
            
          <section className="relative overflow-hidden rounded-[24px] bg-white px-6 py-5 shadow-[0_10px_26px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(148,163,184,0.15)]">
            <div className="relative z-10">
              <p className="text-[20px] font-semibold text-[#334155]">Supply Quality Score</p>
              <p className="mt-2 text-[34px] font-bold leading-[1] tracking-[-0.03em] text-[#0f766e]">98.4%</p>
              <div className="mt-4 h-2 rounded-full bg-[#e2e8f0]">
                <div className="h-full w-[98.4%] rounded-full bg-[#0f766e]" />
              </div>
            </div>
            <BadgeCheck
              className="pointer-events-none absolute right-5 top-4 size-24 text-[#cbd5e1]"
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </section>
        </div>

        <section className="overflow-hidden rounded-[26px] bg-[#eef3ff] p-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ring-1 ring-[rgba(165,180,252,0.35)]">
          <div className="overflow-x-auto rounded-[20px] bg-white">
            <table className="w-full min-w-[980px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-left text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748b]">
                  <th className="px-6 py-4">Vendor Identity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Contact Details</th>
                  <th className="px-6 py-4">Operational HQ</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-[#eef2ff] text-[12px] text-[#334155] last:border-b-0"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex size-9 items-center justify-center rounded-full text-sm font-bold ${vendor.shortCodeTone}`}
                        >
                          {vendor.shortCode}
                        </span>
                        <div>
                          <p className="max-w-[180px] text-[15px] font-semibold leading-[1.05] text-[#0f172a]">
                            {vendor.name}
                          </p>
                          <p className="mt-1 text-[9px] font-medium text-[#94a3b8]">ID: {vendor.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <CategoryBadge category={vendor.category} />
                    </td>
                    <td className="px-6 py-5 text-[13px] leading-6 text-[#1e293b]">
                      <p>{vendor.email}</p>
                      <p className="text-[#64748b]">{vendor.phone}</p>
                    </td>
                    <td className="px-6 py-5 text-[11px] leading-6 text-[#475569]">{vendor.operationalHq}</td>
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="rounded-xl border border-[#dbe3f7] px-3 py-2 text-[12px] font-semibold text-[#4338ca] transition hover:bg-[#eef2ff]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 px-3 pb-2 pt-5 text-sm text-[#64748b] sm:flex-row sm:items-center sm:justify-between">
            <p>Showing 3 of 42 registered vendors</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#d7deef] bg-white text-[#64748b] transition hover:text-[#0f172a]"
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full border border-[#d7deef] bg-white text-[#64748b] transition hover:text-[#0f172a]"
                aria-label="Next page"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
