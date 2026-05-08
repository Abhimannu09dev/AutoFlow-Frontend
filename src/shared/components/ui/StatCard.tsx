import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badge?: string | null;
  badgeColor?: string;
}

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor, badge, badgeColor }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_4px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.04]">
      <div className="mb-3 flex items-start justify-between">
        <div className={`flex size-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
        </div>
        {badge && badgeColor && (
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] text-[#64748b]">{label}</p>
      <p className="mt-1 text-[24px] font-bold text-[#0f172a]">{value}</p>
    </div>
  );
}
