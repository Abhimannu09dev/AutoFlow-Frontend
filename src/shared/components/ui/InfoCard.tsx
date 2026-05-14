import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
  className?: string;
}

export function InfoCard({ 
  icon: Icon, 
  title, 
  description, 
  bgColor = "bg-[#4338ca]",
  iconColor = "text-white",
  textColor = "text-white",
  className = "" 
}: InfoCardProps) {
  return (
    <div className={`rounded-2xl p-6 ${bgColor} ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20">
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <h3 className={`text-[16px] font-bold ${textColor} mb-2`}>{title}</h3>
          <p className={`text-[13px] ${textColor} opacity-90 leading-relaxed`}>{description}</p>
        </div>
      </div>
    </div>
  );
}
