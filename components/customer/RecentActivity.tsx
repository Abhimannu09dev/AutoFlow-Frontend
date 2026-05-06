import { CheckCircle, ShoppingBag, Clock, ChevronRight, LucideIcon } from "lucide-react";
import SectionCard from "@/components/ui/SectionCard";

interface ActivityItem {
  title: string;
  date: string;
  desc: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const activities: ActivityItem[] = [
  {
    title: "Service Appointment Completed",
    date: "OCT 24, 2023",
    desc: "Annual maintenance check for your 2021 Silver Sedan. Everything in optimal condition.",
    icon: CheckCircle,
    iconBg: "bg-[#16a34a]",
    iconColor: "text-white",
  },
  {
    title: "Oil Filter Purchase",
    date: "OCT 20, 2023",
    desc: "High-performance synthetic oil filter (Model: HF-204) was successfully ordered.",
    icon: ShoppingBag,
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
  },
  {
    title: "Part Request Initiated",
    date: "OCT 16, 2023",
    desc: "Inquiry for brake pad replacements has been sent to our atelier team.",
    icon: Clock,
    iconBg: "bg-[#e0f2fe]",
    iconColor: "text-[#0284c7]",
  },
];

export default function RecentActivity() {
  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Activity</h2>
        <button type="button" className="flex items-center gap-1 text-[12px] font-semibold text-[#4338ca] hover:underline">
          View All History <ChevronRight size={13} aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((a) => {
          const Icon = a.icon;
          return (
            <div key={a.title} className="flex gap-3">
              <div className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg} ${a.iconColor}`}>
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold text-[#1e293b]">{a.title}</p>
                  <span className="shrink-0 text-[10px] text-[#94a3b8]">{a.date}</span>
                </div>
                <p className="mt-0.5 text-[12px] leading-snug text-[#64748b]">{a.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
