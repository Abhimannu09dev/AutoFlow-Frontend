"use client";

import type { ReactNode } from "react";
function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function SectionCard({ title, subtitle, actions, children }: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#c5c6cd] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <header className="flex items-center justify-between border-b border-[#e3e4ea] px-5 py-4">
        <div>
          <h2 className="text-lg font-semibold text-[#091426]">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-[#45474c]">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatMiniCard({ label, value, accent = "text-[#006a61]", icon }: { label: string; value: string; accent?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#c5c6cd] bg-white px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-[#45474c]">{label}</p>
        {icon ? <span className="text-[#006a61]">{icon}</span> : null}
      </div>
      <p className={joinClasses("mt-2 text-3xl font-black leading-none", accent)}>{value}</p>
    </div>
  );
}

export function StatusPill({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const className =
    normalized.includes("complete") || normalized.includes("paid") || normalized.includes("fulfilled")
      ? "bg-[#dcfce7] text-[#166534]"
      : normalized.includes("cancel") || normalized.includes("reject")
      ? "bg-[#fee2e2] text-[#b91c1c]"
      : normalized.includes("progress") || normalized.includes("active")
      ? "bg-[#dbeafe] text-[#1d4ed8]"
      : "bg-[#fef3c7] text-[#92400e]";

  return <span className={joinClasses("inline-flex rounded-full px-3 py-1 text-xs font-semibold", className)}>{label}</span>;
}
