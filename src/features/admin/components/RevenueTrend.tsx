"use client";

import { useState } from "react";

interface RevenueTrendProps {
  labels: string[];
  serviceBars: number[];
  partsBars: number[];
  isLoading?: boolean;
}

export default function RevenueTrend({
  labels,
  serviceBars,
  partsBars,
  isLoading = false,
}: RevenueTrendProps) {
  const maxHeight = 190;
  const maxValue = Math.max(...serviceBars, ...partsBars, 1);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="rounded-[24px] bg-[#dfe4f0] px-5 py-5 sm:px-7 sm:py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[clamp(1.375rem,2.1vw,1.875rem)] font-bold leading-none tracking-[-0.03em] text-[#0b1c30]">
            Revenue Trend
          </h2>
          <p className="mt-1 text-xs text-[#464555]">
            Performance cross service centers
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.08em] text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#4338ca]" />
            SERVICE
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#047857]" />
            PARTS
          </span>
        </div>
      </div>

      <div className="mt-6 flex h-[300px] items-end gap-2 overflow-x-auto">
        {labels.map((day, index) => (
          <div key={day} className="flex min-w-[52px] flex-1 flex-col items-center">
            <button
              type="button"
              className="relative flex h-[190px] w-full items-end justify-center rounded-sm outline-none"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex((current) => (current === index ? null : current))}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex((current) => (current === index ? null : current))}
              onClick={() => setActiveIndex((current) => (current === index ? null : index))}
              aria-label={`${day}: Service ${serviceBars[index]}, Parts ${partsBars[index]}, Total ${
                serviceBars[index] + partsBars[index]
              }`}
            >
              {activeIndex === index ? (
                <div className="absolute -top-[84px] left-1/2 z-10 w-[132px] -translate-x-1/2 rounded-lg border border-[#d1d9ec] bg-white px-3 py-2 text-left shadow-[0_8px_18px_rgba(15,23,42,0.12)]">
                  <p className="text-[10px] font-bold text-[#0b1c30]">{day}</p>
                  <p className="mt-1 text-[10px] text-[#475569]">Service: {serviceBars[index]}</p>
                  <p className="text-[10px] text-[#475569]">Parts: {partsBars[index]}</p>
                  <p className="text-[10px] font-semibold text-[#0b1c30]">
                    Total: {serviceBars[index] + partsBars[index]}
                  </p>
                </div>
              ) : null}
              <div
                className="w-full rounded-t-lg bg-[#a7a5ee]"
                style={{ height: `${Math.max((partsBars[index] / maxValue) * maxHeight, 16)}px` }}
              />
              <div
                className="absolute bottom-0 w-full rounded-t-lg bg-[#3929c8]"
                style={{ height: `${Math.max((serviceBars[index] / maxValue) * maxHeight, 16)}px` }}
              />
            </button>
            <span className="mt-2 text-[9px] font-bold tracking-[0.08em] text-[#64748b]">
              {day}
            </span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-3 text-[11px] font-medium text-[#64748b]">Loading trend data...</p>
      ) : null}
    </section>
  );
}
