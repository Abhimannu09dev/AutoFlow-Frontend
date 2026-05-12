import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  iconBg?: string;
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-[#4338ca]",
  iconBg = "bg-[#ede9fe]"
}: FeatureCardProps) {
  return (
    <div className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-[#f1f5f9] shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-shadow">
      <div className={`flex size-14 items-center justify-center rounded-xl ${iconBg} ${iconColor} shrink-0`}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-[16px] font-semibold text-[#0f172a] mb-2">{title}</h3>
        <p className="text-[14px] text-[#64748b] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}