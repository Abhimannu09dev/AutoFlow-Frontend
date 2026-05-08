import React from "react";
import { TrendingUp, ShoppingCart, Zap, Download } from "lucide-react";

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricCard({ icon: Icon, title, value, change, isPositive }: MetricCardProps) {
  return (
    <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-slate-500">{title}</p>
          <p className="mt-2 text-[28px] font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
          <Icon className="h-6 w-6 text-slate-400" />
        </div>
      </div>
      <p className={`mt-3 text-[12px] font-semibold ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
        {isPositive ? "↑" : "↓"} {change} from last month
      </p>
    </div>
  );
}

function RevenueBars() {
  const data = [
    { day: "MON", revenue: 280, expenses: 120 },
    { day: "TUE", revenue: 320, expenses: 140 },
    { day: "WED", revenue: 380, expenses: 160 },
    { day: "THU", revenue: 350, expenses: 150 },
    { day: "FRI", revenue: 320, expenses: 140 },
    { day: "SAT", revenue: 400, expenses: 170 },
    { day: "SUN", revenue: 420, expenses: 180 },
  ];

  const maxValue = 420;

  return (
    <div className="flex items-end justify-between gap-3">
      {data.map(({ day, revenue, expenses }) => (
        <div key={day} className="flex flex-col items-center gap-2">
          <div className="relative h-32 w-10 rounded-t-lg bg-slate-100">
            <div
              className="absolute bottom-0 left-0 w-full rounded-t-lg bg-gradient-to-b from-[#4d43e8] to-[#6d5ff5]"
              style={{ height: `${(revenue / maxValue) * 100}%` }}
            />
            <div
              className="absolute bottom-0 left-0 w-full rounded-t-lg bg-gradient-to-b from-[#137d7a] to-[#1a9d99]"
              style={{ height: `${(expenses / maxValue) * 100}%`, opacity: 0.6 }}
            />
          </div>
          <span className="text-[11px] font-semibold text-slate-600">{day}</span>
        </div>
      ))}
    </div>
  );
}

function SalesDistribution() {
  const segments = [
    { name: "Engine Components", percentage: 45, color: "#4d43e8" },
    { name: "Consumables (Oil/Filters)", percentage: 30, color: "#137d7a" },
    { name: "Brake Systems", percentage: 15, color: "#ef4b40" },
    { name: "Others", percentage: 10, color: "#d1d5db" },
  ];

  const cumulativePercentage = segments.map((_, i) => segments.slice(0, i + 1).reduce((sum, s) => sum + s.percentage, 0));

  const conicStops = segments
    .map((segment, i) => {
      const start = i === 0 ? 0 : cumulativePercentage[i - 1];
      const end = cumulativePercentage[i];
      return `${segment.color} ${start}%, ${segment.color} ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex items-center justify-between gap-8">
      <div
        className="h-40 w-40 rounded-full"
        style={{
          background: `conic-gradient(${conicStops})`,
        }}
      />
      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: segment.color }} />
              <p className="text-[14px] font-medium text-slate-700">{segment.name}</p>
            </div>
            <p className="text-[14px] font-bold text-slate-900">{segment.percentage}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PerformanceRow {
  date: string;
  dayOfWeek: string;
  transactions: number;
  revenue: string;
  costs: string;
  profit: string;
  status: "Target Met" | "Stable" | "Urgent" | "Target Met";
  statusColor: string;
}

function PerformanceTable() {
  const data: PerformanceRow[] = [
    {
      date: "Oct 24, 2023",
      dayOfWeek: "Thursday",
      transactions: 142,
      revenue: "$14,205.00",
      costs: "$8,120.00",
      profit: "+$6,085.00",
      status: "Target Met",
      statusColor: "bg-[#137d7a] text-white",
    },
    {
      date: "Oct 23, 2023",
      dayOfWeek: "Wednesday",
      transactions: 98,
      revenue: "$9,840.50",
      costs: "$7,400.00",
      profit: "+$2,440.50",
      status: "Stable",
      statusColor: "bg-blue-100 text-blue-700",
    },
    {
      date: "Oct 22, 2023",
      dayOfWeek: "Tuesday",
      transactions: 112,
      revenue: "$11,900.00",
      costs: "$12,100.00",
      profit: "-$200.00",
      status: "Urgent",
      statusColor: "bg-red-100 text-red-700",
    },
    {
      date: "Oct 21, 2023",
      dayOfWeek: "Monday",
      transactions: 156,
      revenue: "$18,440.00",
      costs: "$9,500.00",
      profit: "+$8,940.00",
      status: "Target Met",
      statusColor: "bg-[#137d7a] text-white",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Date / Period
            </th>
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Transactions
            </th>
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Gross Revenue
            </th>
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Op. Costs
            </th>
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Net Profit
            </th>
            <th className="px-6 py-4 text-left text-[12px] font-bold uppercase tracking-[0.05em] text-slate-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.date} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="px-6 py-4">
                <div>
                  <p className="text-[14px] font-semibold text-slate-900">{row.date}</p>
                  <p className="text-[12px] text-slate-500">{row.dayOfWeek}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-[14px] font-semibold text-slate-900">{row.transactions}</td>
              <td className="px-6 py-4 text-[14px] font-semibold text-slate-900">{row.revenue}</td>
              <td className="px-6 py-4 text-[14px] font-semibold text-slate-900">{row.costs}</td>
              <td className={`px-6 py-4 text-[14px] font-semibold ${row.profit.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                {row.profit}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-block rounded-full px-3 py-1 text-[12px] font-semibold ${row.statusColor}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FinancialReportsPage() {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc]">
      <div className="h-full w-full px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-[36px] font-bold tracking-tight text-slate-900">Financial Insights</h1>
            <p className="mt-1 text-[15px] text-slate-600">Monitoring revenue velocity and fiscal health across Atelier branches.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-white px-4 py-2 ring-1 ring-slate-200">
              <p className="text-[13px] font-semibold text-slate-700">Oct 01, 2023 - Oct 31, 2023</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-semibold text-[#4d43e8] ring-1 ring-slate-200 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          <MetricCard
            icon={TrendingUp}
            title="Total Revenue"
            value="$428,930.00"
            change="+12.8%"
            isPositive={true}
          />
          <MetricCard icon={ShoppingCart} title="Parts Sales" value="$184,200.50" change="+4.2%" isPositive={true} />
          <MetricCard icon={Zap} title="Service Revenue" value="$244,729.50" change="-1.8%" isPositive={false} />
        </div>

        {/* Charts Grid */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {/* Revenue Velocity */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-slate-900">Revenue Velocity</h2>
                <p className="mt-1 text-[13px] text-slate-600">Daily breakdown of total income streams</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#4d43e8]" />
                  <span className="text-[12px] font-medium text-slate-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#137d7a]" />
                  <span className="text-[12px] font-medium text-slate-600">Expenses</span>
                </div>
              </div>
            </div>
            <RevenueBars />
          </div>

          {/* Sales Distribution */}
          <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
            <h2 className="mb-6 text-[18px] font-bold text-slate-900">Sales Distribution</h2>
            <SalesDistribution />
            <button className="mt-6 text-[13px] font-bold text-[#4d43e8] hover:underline">View Full Inventory Mix →</button>
          </div>
        </div>

        {/* Performance Table */}
        <div className="rounded-[14px] bg-white p-6 shadow-[0_1px_6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-slate-900">Periodic Performance Summary</h2>
            <div className="flex items-center gap-4">
              <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900">Daily</button>
              <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900">Monthly</button>
              <button className="text-[13px] font-semibold text-slate-600 hover:text-slate-900">Yearly</button>
            </div>
          </div>
          <PerformanceTable />
          <div className="mt-6 text-center">
            <button className="text-[13px] font-bold text-[#4d43e8] hover:underline">Download Full Audit Log for October</button>
          </div>
        </div>
      </div>
    </div>
  );
}
