"use client";

import Image from "next/image";
import {
  Plus, Pencil, Trash2, ArrowRight, ShoppingCart,
} from "lucide-react";
import type { Vehicle } from "../types";
import { DashboardLayout } from "../../../shared/components/layout/DashboardLayout";
import { customerNavItems } from "../../../shared/constants/navigation";

const vehicles: Vehicle[] = [
  { id: "1", make: "PORSCHE", model: "911 GT3\nRS", vin: "WP0AA2A9XPS2", status: "ACTIVE", img: "/car-bg.svg" },
  { id: "2", make: "AUDI SPORT", model: "RS7\nPerformance", vin: "AU99228L0012", status: "IN SERVICE", img: "/car-bg.svg" },
];

const recommendedParts = [
  { id: "1", name: "Michelin Pilot Sport 4S", description: "Premium Summer Tires", price: "$1,240", iconType: "tire" as const },
  { id: "2", name: "Liqui Moly 5W-40", description: "Synthetic Race Grade", price: "$85", iconType: "oil" as const },
  { id: "3", name: "Akrapovič Titanium", description: "Exhaust System Upgrade", price: "$4,800", iconType: "exhaust" as const },
];

function TireIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" />
      <line x1="12" y1="3" x2="12" y2="9" /><line x1="12" y1="15" x2="12" y2="21" />
      <line x1="3" y1="12" x2="9" y2="12" /><line x1="15" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function OilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" /><line x1="5" y1="9" x2="19" y2="9" /><line x1="5" y1="14" x2="19" y2="14" />
    </svg>
  );
}

function ExhaustIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 text-[#4338ca]" stroke="currentColor" strokeWidth={1.6}>
      <circle cx="6" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="18" cy="12" r="2" />
      <line x1="8" y1="12" x2="10" y2="12" /><line x1="14" y1="12" x2="16" y2="12" />
    </svg>
  );
}

const partIconMap = { tire: TireIcon, oil: OilIcon, exhaust: ExhaustIcon };

function StatusBadge({ status }: { status: Vehicle["status"] }) {
  const styles: Record<Vehicle["status"], string> = {
    ACTIVE: "bg-[#4338ca] text-white",
    "IN SERVICE": "bg-[#0d9488] text-white",
    INACTIVE: "bg-[#94a3b8] text-white",
  };
  return (
    <span className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[status]}`}>
      {status}
    </span>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.04]">
      <div className="relative h-44 w-full overflow-hidden bg-[#1a1a2e]">
        <Image src={vehicle.img} alt={`${vehicle.make} ${vehicle.model.replace("\n", " ")}`} fill className="object-cover object-center" />
        <StatusBadge status={vehicle.status} />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4338ca]">{vehicle.make}</p>
        <div className="mt-1 flex items-start justify-between gap-2">
          <h3 className="whitespace-pre-line text-[20px] font-bold leading-tight text-[#0f172a]">{vehicle.model}</h3>
          <span className="mt-1 shrink-0 rounded-lg border border-[#e8eaf2] bg-[#f8f9fc] px-2 py-1 text-[10px] font-semibold text-[#64748b]">{vehicle.vin}</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-[#f1f3f8] pt-3">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Edit vehicle" className="flex size-8 items-center justify-center rounded-lg border border-[#e8eaf2] bg-white text-[#64748b] transition hover:border-[#c7d2fe] hover:bg-[#f5f6ff] hover:text-[#4338ca]">
              <Pencil size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Delete vehicle" className="flex size-8 items-center justify-center rounded-lg border border-[#e8eaf2] bg-white text-[#64748b] transition hover:border-[#fecaca] hover:bg-[#fff5f5] hover:text-[#dc2626]">
              <Trash2 size={14} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </div>
          <button type="button" className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4338ca] transition hover:underline">
            View Specs <ArrowRight size={13} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterVehicleCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#c7d2fe] bg-[#f8f9ff] transition hover:border-[#818cf8] hover:bg-[#f0f1ff] cursor-pointer min-h-[280px]">
      <button type="button" className="flex flex-col items-center gap-3 p-8 text-center" aria-label="Register new vehicle">
        <div className="flex size-12 items-center justify-center rounded-full border-2 border-[#c7d2fe] bg-white text-[#4338ca]">
          <Plus size={22} strokeWidth={2} aria-hidden="true" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1e293b]">Register New Vehicle</p>
          <p className="mt-1 text-[12px] text-[#94a3b8]">Expand your collection</p>
        </div>
      </button>
    </div>
  );
}

function PartCard({ part }: { part: typeof recommendedParts[0] }) {
  const Icon = partIconMap[part.iconType];
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_1px_6px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#eef0fb]">
        <Icon />
      </div>
      <p className="text-[13px] font-bold text-[#1e293b]">{part.name}</p>
      <p className="mt-0.5 text-[11px] text-[#94a3b8]">{part.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[16px] font-bold text-[#4338ca]">{part.price}</span>
        <button type="button" className="flex h-8 items-center gap-1.5 rounded-lg bg-[#4338ca] px-3 text-[11px] font-semibold text-white transition hover:brightness-105">
          <ShoppingCart size={12} aria-hidden="true" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const user = {
    name: "Alex Sterling",
    role: "Premium Member"
  };

  return (
    <DashboardLayout
      navItems={customerNavItems}
      brand="AutoFlow"
      subtitle="Manage your vehicles"
      user={user}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight text-[#0f172a]">Garage</h1>
          <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[#64748b]">
            Access your curated collection of high-performance vehicles. Manage technical specs, service records, and parts availability in one seamless interface.
          </p>
        </div>
        <button type="button" className="flex h-10 items-center gap-2 rounded-xl bg-[#4338ca] px-5 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(67,56,202,0.3)] transition hover:brightness-105">
          <Plus size={16} strokeWidth={2.2} aria-hidden="true" /> Add Vehicle
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
              <RegisterVehicleCard />
            </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0f172a]">Recommended Performance Parts</h2>
          <button type="button" className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] transition hover:underline">
            Browse Catalog
            <svg viewBox="0 0 12 12" fill="none" className="size-3 ml-0.5" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
              <path d="M2 10L10 2M10 2H5M10 2v5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recommendedParts.map((part) => <PartCard key={part.id} part={part} />)}
        </div>
      </div>
    </DashboardLayout>
  );
}
