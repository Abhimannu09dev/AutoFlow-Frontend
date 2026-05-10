import Link from "next/link";
import {
  ChevronDown,
  ChevronLeft,
  CircleCheck,
  Copy,
  History,
  MapPin,
  Plus,
  ReceiptText,
  Shield,
  ShieldCheck,
  Warehouse,
  Trash2,
} from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";

type LineItem = {
  name: string;
  quantity: number;
  unitPrice: string;
  partCode: string;
};

const lineItems: LineItem[] = [
  {
    name: "High-Performance Brake Pads - Ceramic",
    quantity: 12,
    unitPrice: "$84.50",
    partCode: "BP-CRT-112",
  },
  {
    name: "Synthetic Engine Oil 5W-30 (1L)",
    quantity: 48,
    unitPrice: "$12.99",
    partCode: "OIL-5W30-1L",
  },
  {
    name: "Turbo Air Filter Element",
    quantity: 6,
    unitPrice: "$26.75",
    partCode: "FLT-TURBO-08",
  },
];

const summaryRows = [
  { label: "Subtotal", value: "$1,637.52" },
  { label: "Tax (VAT 15%)", value: "$245.63" },
  { label: "Shipping & Handling", value: "$45.00" },
];

export default function AdminPurchaseInvoiceManagementPage() {
  return (
    <AdminLayout>
      <div className="w-full space-y-6 pb-8">
        <Link
          href="/staff/inventory"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5b5ce6] transition hover:text-[#4338ca]"
        >
          <ChevronLeft className="size-3.5" />
          Back to Inventory
        </Link>

        <div className="space-y-2">
          <h1 className="text-[28px] font-bold tracking-tight text-[#101828]">
            Purchase Invoice
          </h1>
          <p className="max-w-4xl text-[14px] leading-6 text-[#667085]">
            Create a new procurement record for vehicle parts. Keep vendor details, item
            specifications, and cost totals consistent for financial auditing.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <section className="rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center gap-2 text-[#2f3b95]">
                <ReceiptText className="size-5" />
                <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#1e2a53]">
                  Vendor Details
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                    Select Registered Vendor
                  </span>
                  <div className="flex items-center justify-between rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#1d2939] shadow-inner shadow-white/50">
                    <span>Bosch Automotive Parts GmbH</span>
                    <ChevronDown className="size-4 text-[#667085]" />
                  </div>
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                    Invoice Number
                  </span>
                  <div className="rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#98a2b3]">
                    INV-2023-0045
                  </div>
                </label>

                <label>
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                    Purchase Date
                  </span>
                  <div className="rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#1d2939]">
                    10/24/2023
                  </div>
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085]">
                    Notes
                  </span>
                  <div className="rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#1d2939]">
                    Bosch Automotive Parts GmbH
                  </div>
                </label>
              </div>
            </section>

            <section className="rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-[#2f3b95]">
                  <ReceiptText className="size-5" />
                  <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#1e2a53]">
                    Line Items
                  </h2>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#4f46e5] transition hover:text-[#3730a3]"
                >
                  <Plus className="size-4" />
                  Add Row
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#e7ecf5]">
                <div className="hidden grid-cols-[1.7fr_110px_140px_28px] gap-3 border-b border-[#e7ecf5] bg-[#f8faff] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#667085] sm:grid">
                  <span>Part Name &amp; Specifications</span>
                  <span>Quantity</span>
                  <span>Unit Price ($)</span>
                  <span aria-hidden="true" />
                </div>

                <div className="divide-y divide-[#edf2f7]">
                  {lineItems.map((item, index) => (
                    <div
                      key={item.partCode}
                      className="grid gap-3 px-4 py-4 sm:grid-cols-[1.7fr_110px_140px_28px] sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-[#101828]">{item.name}</div>
                        <div className="text-xs text-[#667085]">{item.partCode}</div>
                      </div>
                      <div className="rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#1d2939]">
                        {item.quantity}
                      </div>
                      <div className="rounded-xl border border-[#d9e0ef] bg-[#f7f9ff] px-4 py-3 text-sm text-[#1d2939]">
                        {item.unitPrice.replace("$", "")}
                      </div>
                      <button
                        type="button"
                        className="inline-flex size-8 items-center justify-center rounded-lg text-[#98a2b3] transition hover:bg-[#fff1f0] hover:text-[#d92d20]"
                        aria-label={`Remove line item ${index + 1}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}

                  <div className="grid gap-3 px-4 py-4 sm:grid-cols-[1.7fr_110px_140px_28px] sm:items-center">
                    <div className="rounded-xl border border-dashed border-[#d9e0ef] bg-[#fafcff] px-4 py-3 text-sm text-[#98a2b3]">
                      Start typing part name...
                    </div>
                    <div className="rounded-xl border border-dashed border-[#d9e0ef] bg-[#fafcff] px-4 py-3 text-sm text-[#98a2b3]">
                      0
                    </div>
                    <div className="rounded-xl border border-dashed border-[#d9e0ef] bg-[#fafcff] px-4 py-3 text-sm text-[#98a2b3]">
                      0.00
                    </div>
                    <button
                      type="button"
                      className="inline-flex size-8 items-center justify-center rounded-lg text-[#c0c6d4] transition hover:bg-[#eff4ff] hover:text-[#4f46e5]"
                      aria-label="Duplicate row"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-[24px] border border-[#dbe6ff] bg-[#dce8ff] p-6 shadow-[0_12px_40px_rgba(79,70,229,0.12)]">
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[#4f46e5]">
                Invoice Summary
              </h2>

              <dl className="mt-6 space-y-4 text-sm">
                {summaryRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4 text-[#344054]">
                    <dt>{row.label}</dt>
                    <dd className="font-semibold text-[#1d2939]">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="my-6 border-t border-[#c9d8ff] pt-5">
                <div className="flex items-end justify-between gap-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#667085]">
                    Total Amount
                  </p>
                  <p className="text-[18px] font-semibold tracking-[-0.05em] text-[#4f46e5]">
                    $1,928.15
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4636d6] to-[#4f46e5] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(79,70,229,0.32)] transition hover:brightness-105"
              >
                <CircleCheck className="size-3.5" />
                Create Invoice
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-[#667085]">
                By clicking Create Invoice, you authorize the addition of these parts to the
                central inventory database.
              </p>
            </section>

            <section className="rounded-[22px] border border-white/70 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="mb-4 flex items-center gap-2 text-[#1e2a53]">
                <Warehouse className="size-6 text-[#0f766e]" />
                <h2 className="text-sm font-semibold">Storage Destination</h2>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#eef2ff] bg-[#f8faff] p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#eaf2f1] text-[#0f766e]">
                    <MapPin className="size-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">Sector B-4</p>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#667085]">
                      Main Warehouse
                    </p>
                  </div>
                </div>
                <button type="button" className="text-sm font-semibold text-[#4f46e5]">
                  Change
                </button>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-[18px] border border-[#0f172a] bg-[#0b1f35] px-3.5 py-4.5 text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] sm:px-5 sm:py-5">
              <div className="inline-flex rounded-md bg-[#0c4a54] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#67f3ef]">
                Elite Partner
              </div>
              <div className="mt-4 space-y-1.5 pr-12 sm:pr-16">
                <h3 className="text-[19px] font-semibold leading-tight text-white sm:text-[20px]">
                  Bosch Automotive
                </h3>
                <p className="max-w-[250px] text-[11px] leading-5 text-slate-420">
                  This vendor has a 98% on-time delivery rate. Last order was processed in 48
                  hours.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 pr-7 sm:pr-8">
                <div className="flex -space-x-1.5">
                  <span className="size-6.5 rounded-full border border-[#0b1f35] bg-[#c7d8f3]" />
                  <span className="size-6.5 rounded-full border border-[#0b1f35] bg-[#d8e4f7]" />
                  <span className="size-6.5 rounded-full border border-[#0b1f35] bg-[#e3dcff]" />
                </div>
                <p className="text-[11px] font-medium text-slate-100">+14 recent orders</p>
              </div>

              <div className="pointer-events-none absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
                <ShieldCheck className="size-16 text-white/10" />
              </div>
            </section>

          </aside>
        </div>

        <section className="border-t border-[rgba(203,213,225,0.45)] pt-6 text-[#3f4150]">
          <div className="flex flex-col gap-4 text-[15px] sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-2">
                <History className="size-5 text-[#525567]" />
                Draft Auto-saved 2 mins ago
              </span>
              <span className="inline-flex items-center gap-2">
                <Shield className="size-5 text-[#525567]" />
                Encrypted Connection
              </span>
            </div>
            <p className="text-[14px] text-[#525567] sm:text-[15px]">System Version: KINETIC-v2.4.1</p>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}