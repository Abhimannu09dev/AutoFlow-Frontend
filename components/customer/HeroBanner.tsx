import Image from "next/image";
import { CalendarCheck, PlusCircle, Package, ArrowRight } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_220px]">
      <div className="relative overflow-hidden rounded-2xl bg-[#f0f1fb] shadow-[0_1px_4px_rgba(15,23,42,0.07)]">
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
        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#3730a3]">
            <div className="h-full w-[90%] rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
