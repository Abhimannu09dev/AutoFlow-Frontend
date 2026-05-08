import { ShoppingCart, CalendarCheck, Car } from "lucide-react";
import StatCard from "@/shared/components/ui/StatCard";

const stats = [
  {
    label: "Total Purchases",
    value: "$2,450.00",
    icon: ShoppingCart,
    iconBg: "bg-[#e8f5e9]",
    iconColor: "text-[#16a34a]",
    badge: null,
  },
  {
    label: "Upcoming Appointments",
    value: "1",
    icon: CalendarCheck,
    iconBg: "bg-[#ede9fe]",
    iconColor: "text-[#7c3aed]",
    badge: "Next: Tomorrow",
    badgeColor: "bg-[#ede9fe] text-[#7c3aed]",
  },
  {
    label: "Registered Vehicles",
    value: "2",
    icon: Car,
    iconBg: "bg-[#e0f2fe]",
    iconColor: "text-[#0284c7]",
    badge: null,
  },
];

export default function StatsRow() {
  return (
    <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
