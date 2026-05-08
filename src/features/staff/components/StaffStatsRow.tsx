import { ShoppingCart, Users, FileText, CreditCard } from "lucide-react";
import StatCard from "@/shared/components/ui/StatCard";

const statCards = [
  { label: "Today's Sales", value: "$4,250", icon: ShoppingCart, iconBg: "bg-[#ede9fe]", iconColor: "text-[#7c3aed]", badge: "+12% vs yesterday", badgeColor: "bg-[#e8f5e9] text-[#2e7d32]" },
  { label: "Total Customers", value: "1,240", icon: Users, iconBg: "bg-[#e0f2fe]", iconColor: "text-[#0284c7]", badge: null },
  { label: "Pending Invoices", value: "12", icon: FileText, iconBg: "bg-[#fff3e0]", iconColor: "text-[#e65100]", badge: "Action Required", badgeColor: "bg-[#fff3e0] text-[#e65100]" },
  { label: "Credit Customers", value: "45", icon: CreditCard, iconBg: "bg-[#f0fdf4]", iconColor: "text-[#16a34a]", badge: null },
];

export default function StaffStatsRow() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
