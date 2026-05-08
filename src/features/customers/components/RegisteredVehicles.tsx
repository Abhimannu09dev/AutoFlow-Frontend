import Image from "next/image";
import { PlusCircle } from "lucide-react";
import SectionCard from "@/shared/components/ui/SectionCard";
import Badge from "@/shared/components/ui/Badge";

interface Vehicle {
  name: string;
  vin: string;
  badge: string;
  badgeColor: string;
  serviceDue: boolean;
  img: string;
}

const vehicles: Vehicle[] = [
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

export default function RegisteredVehicles() {
  return (
    <SectionCard>
      <h2 className="mb-4 text-[15px] font-bold text-[#0f172a]">Registered Vehicles</h2>
      <div className="space-y-3">
        {vehicles.map((v) => (
          <div
            key={v.name}
            className="flex items-center gap-3 rounded-xl border border-[#f1f3f8] p-3 transition hover:bg-[#f8f9fc]"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f1f3f8]">
              <Image src={v.img} alt={v.name} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge label={v.badge} colorClass={v.badgeColor} />
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
    </SectionCard>
  );
}
