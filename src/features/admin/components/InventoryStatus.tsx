"use client";

export interface InventoryBreakdownItem {
  label: string;
  value: string;
  dotClass: string;
}

interface InventoryStatusProps {
  totalSkus: string;
  breakdown: InventoryBreakdownItem[];
}

export default function InventoryStatus({ totalSkus, breakdown }: InventoryStatusProps) {
  return (
    <section className="rounded-[24px] border border-[rgba(199,196,216,0.14)] bg-[#f6f7fb] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <h2 className="text-[clamp(1.375rem,2.1vw,1.875rem)] font-bold leading-none tracking-[-0.03em] text-[#0b1c30]">
        Inventory Composition
      </h2>
      <div className="mt-6 flex flex-wrap items-center gap-8">
        <div className="relative flex size-[170px] items-center justify-center rounded-full bg-[conic-gradient(#4338ca_0_54%,#047857_54%_76%,#9ca3af_76%_91%,#cbd5e1_91%_100%)]">
          <div className="flex size-[128px] flex-col items-center justify-center rounded-full bg-white">
            <span className="text-[34px] font-extrabold leading-none tracking-[-0.03em] text-[#0b1c30]">
              {totalSkus}
            </span>
            <span className="mt-1 text-[10px] font-bold tracking-[0.12em] text-[#64748b]">
              SKUS
            </span>
          </div>
        </div>
        <ul className="space-y-3">
          {breakdown.map((item) => (
            <li key={item.label} className="text-xs">
              <p className="flex items-center gap-2 font-bold text-[#0b1c30]">
                <span className={`size-2 rounded-full ${item.dotClass}`} />
                {item.label}
              </p>
              <p className="ml-4 text-[10px] text-[#64748b]">{item.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
