import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor = "text-[#16a34a]",
  iconBg = "bg-[#dcfce7]",
  bgColor = "bg-[#f8f9fc]",
  textColor = "text-[#0f172a]",
  className = ""
}: MetricCardProps) {
  return (
    <div className={`rounded-2xl p-6 ${bgColor} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          {title}
        </p>
        {Icon && (
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={18} className={iconColor} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <p className={`text-[28px] font-bold ${textColor} mb-1`}>{value}</p>
      {subtitle && (
        <p className="text-[12px] text-[#64748b]">{subtitle}</p>
      )}
    </div>
  );
}
