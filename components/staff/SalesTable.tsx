import SectionCard from "@/components/ui/SectionCard";
import Badge from "@/components/ui/Badge";

interface SaleRow {
  time: string;
  customer: string;
  amount: string;
  status: string;
  statusColor: string;
}

const recentSales: SaleRow[] = [
  { time: "10:45 AM", customer: "Jonathan Meyers", amount: "$1,240.00", status: "Completed", statusColor: "bg-[#e8f5e9] text-[#2e7d32]" },
  { time: "09:30 AM", customer: "Sarah Jenkins", amount: "$450.50", status: "In Progress", statusColor: "bg-[#e3f2fd] text-[#1565c0]" },
  { time: "08:15 AM", customer: "Atlas Logistics", amount: "$2,560.00", status: "Pending Payment", statusColor: "bg-[#fce4ec] text-[#c62828]" },
];

export default function SalesTable() {
  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#0f172a]">Recent Sales Activity</h2>
        <button type="button" className="text-[13px] font-semibold text-[#4338ca] hover:underline">
          View All
        </button>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-[#f1f3f8]">
            {["TIME", "CUSTOMER", "AMOUNT", "STATUS"].map((h) => (
              <th key={h} className="pb-2 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recentSales.map((row) => (
            <tr key={row.customer} className="border-b border-[#f8f9fc] last:border-0">
              <td className="py-3 text-[#64748b]">{row.time}</td>
              <td className="py-3 font-semibold text-[#1e293b]">{row.customer}</td>
              <td className="py-3 font-semibold text-[#1e293b]">{row.amount}</td>
              <td className="py-3">
                <Badge label={row.status} colorClass={row.statusColor} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}
