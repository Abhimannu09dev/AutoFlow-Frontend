"use client";

import type { LucideIcon } from "lucide-react";

export interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  delta: string;
  deltaClassName: string;
  progressClassName: string;
  progressValue: number;
}

export default function MetricCard({
  icon: Icon,
  title,
  value,
  delta,
  deltaClassName,
  progressClassName,
  progressValue,
}: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[rgba(199,196,216,0.14)] bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-[34px] items-center justify-center rounded-[10px] bg-[#eff4ff]">
            <Icon className="size-[18px] text-[#6366f1]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-[#464555]">{title}</p>
            <p className="mt-2 text-[32px] font-extrabold leading-none tracking-[-0.03em] text-[#0b1c30]">
              {value}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold leading-4 ${deltaClassName}`}
        >
          {delta}
        </span>
      </div>
      <div className="mt-5 h-1 rounded-full bg-[#eceef6]">
        <div
          className={`h-full rounded-full ${progressClassName}`}
          style={{ width: `${Math.min(100, Math.max(0, progressValue))}%` }}
        />
      </div>
    </article>
  );
}
