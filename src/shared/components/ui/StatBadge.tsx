import { LucideIcon } from "lucide-react";

interface StatBadgeProps {
  icon: LucideIcon;
  label: string;
  color?: string;
}

export function StatBadge({ icon: Icon, label, color = "text-[#4338ca]" }: StatBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white px-6 py-4 shadow-[0_2px_12px_rgba(15,23,42,0.06)] border border-[#f1f5f9] hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] transition-shadow">
      <Icon size={18} className={color} strokeWidth={1.5} />
      <span className="text-[13px] font-medium text-[#64748b]">{label}</span>
    </div>
  );
}
