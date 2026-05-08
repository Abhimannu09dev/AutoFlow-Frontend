"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface PriorityAlertItem {
  id: string;
  icon: LucideIcon;
  title: string;
  message: string;
  action: string;
  iconClassName: string;
  cardClassName: string;
  actionHref?: string;
}

interface PriorityAlertsProps {
  alerts: PriorityAlertItem[];
  onAction?: (alert: PriorityAlertItem) => void;
  onClearAll?: () => void;
  actionStateMessage?: string | null;
}

export default function PriorityAlerts({
  alerts,
  onAction,
  onClearAll,
  actionStateMessage,
}: PriorityAlertsProps) {
  return (
    <section className="rounded-[24px] border border-[rgba(199,196,216,0.14)] bg-[#f6f7fb] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[clamp(1.375rem,2.2vw,2.125rem)] font-bold leading-none tracking-[-0.03em] text-[#0b1c30]">
          Priority Alerts
        </h2>
        <span className="rounded bg-[#fee2e2] px-2 py-0.5 text-[9px] font-bold tracking-[0.07em] text-[#ef4444]">
          {alerts.length} ACTIONABLE
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {alerts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-4 py-3 text-xs text-[#64748b]">
            No priority alerts right now.
          </p>
        ) : null}
        {alerts.map((alert) => {
          const Icon = alert.icon;

          return (
            <article
              key={alert.id}
              className={`rounded-2xl border border-[rgba(199,196,216,0.2)] p-4 ${alert.cardClassName}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${alert.iconClassName}`}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-5 text-[#0b1c30]">
                    {alert.title}
                  </h3>
                  <p className="mt-1 text-xs leading-[18px] text-[#464555]">
                    {alert.message}
                  </p>
                  {alert.actionHref ? (
                    <Link
                      href={alert.actionHref}
                      className="mt-2 inline-block text-[9px] font-bold tracking-[0.08em] text-[#ef4444]"
                    >
                      {alert.action}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onAction?.(alert)}
                      className="mt-2 text-[9px] font-bold tracking-[0.08em] text-[#ef4444]"
                    >
                      {alert.action}
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onClearAll}
        disabled={alerts.length === 0}
        className="mt-4 w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-[11px] font-semibold text-[#334155] hover:bg-[#f8fafc]"
      >
        Clear All Notifications
      </button>
      {actionStateMessage ? (
        <p className="mt-2 text-[11px] text-[#64748b]">{actionStateMessage}</p>
      ) : null}
    </section>
  );
}
