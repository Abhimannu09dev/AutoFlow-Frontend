import React from "react";
import {
  AlertTriangle,
  Box,
  CircleDollarSign,
  CircleCheck,
  Users,
  BadgeAlert,
  FileText,
  BadgeCheck,
  Wrench,
} from "lucide-react";

function MetricCard({
  icon: Icon,
  title,
  value,
  delta,
  deltaClass,
  barClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  delta: string;
  deltaClass: string;
  barClass: string;
}) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-5 shadow-[0_1px_6px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-100">
            <Icon className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <p className="text-[14px] text-slate-500">{title}</p>
            <p className="mt-1 text-[22px] font-bold tracking-tight text-slate-900">{value}</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${deltaClass}`}>{delta}</span>
      </div>

      <div className="mt-6 h-2 rounded-full bg-slate-100">
        <div className={`h-2 rounded-full ${barClass}`} />
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[28px] bg-white p-6 shadow-[0_1px_8px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/80 ${className}`}>
      {children}
    </div>
  );
}

function RevenueBars() {
  const bars = [64, 94, 52, 116, 78, 36, 28];
  return (
    <div className="flex h-[250px] items-end gap-2.5 px-2 pb-2 pt-8">
      {bars.map((height, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-0.5">
          <div className="w-full rounded-t-2xl bg-[#9b98f2]" style={{ height: `${Math.max(height - 32, 18)}px` }} />
          <div className="w-full rounded-t-2xl bg-[#4a33d8]" style={{ height: `${height}px`, marginTop: "-22px" }} />
          <span className="mt-2 text-[10px] font-medium tracking-[0.12em] text-slate-400">{["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][index]}</span>
        </div>
      ))}
    </div>
  );
}

function Donut() {
  return (
    <div className="relative flex h-[190px] w-[190px] items-center justify-center rounded-full bg-[conic-gradient(#4d43e8_0_54%,#18a7a3_54%_76%,#c2c1f7_76%_91%,#f1f2f8_91%_100%)]">
      <div className="absolute h-[132px] w-[132px] rounded-full bg-white shadow-inner" />
      <div className="relative z-10 text-center">
        <div className="text-[30px] font-bold tracking-tight text-slate-900">8.4k</div>
        <div className="text-[11px] font-semibold tracking-[0.14em] text-slate-400">SKUS</div>
      </div>
    </div>
  );
}

function AlertItem({
  icon: Icon,
  color,
  title,
  body,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  body: string;
  action: string;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_8px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-[12px] leading-5 text-slate-500">{body}</p>
          <button className="mt-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#ef4b40]">{action}</button>
        </div>
      </div>
    </div>
  );
}


function InventoryCard({
  image,
  imageClassName,
  category,
  title,
  price,
}: {
  image?: string;
  imageClassName?: string;
  category: string;
  title: string;
  price: string;
}) {
  return (
    <div className="w-[205px] shrink-0 rounded-[22px] bg-[#eef4ff] p-4 shadow-[0_1px_8px_rgba(15,23,42,0.06)] ring-1 ring-white/70">
      <div
        className={`relative h-[132px] overflow-hidden rounded-[16px] bg-slate-700 ${imageClassName ?? ""}`}
        style={image ? { backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
      />
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#4d43e8]">{category}</p>
      <h3 className="mt-1 text-[15px] font-bold leading-5 text-slate-900">{title}</h3>
      <p className="mt-1 text-[14px] font-semibold text-slate-600">{price}</p>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="w-full py-4">
      <section className="mb-6 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[30px] font-extrabold leading-none tracking-tight text-slate-900">Operational Insight</h1>
          <p className="mt-3 text-[14px] leading-tight text-slate-600">Real-time performance analytics for AutoFlow logistics.</p>
        </div>

        <div className="mt-4 rounded-2xl bg-[#edf4ff] p-1 shadow-sm ring-1 ring-[#e5eefc]">
          <div className="grid grid-cols-3 gap-1">
            <button className="rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-[#3e34d6] shadow-[0_6px_18px_rgba(60,70,130,0.12)]">
              Daily
            </button>
            <button className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:text-slate-900">
              Weekly
            </button>
            <button className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-slate-600 transition hover:text-slate-900">
              Monthly
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 grid grid-cols-4 gap-4">
          <MetricCard icon={Box} title="Total Sales" value="14,285" delta="+12.4%" deltaClass="bg-emerald-50 text-emerald-600" barClass="w-[76%] bg-[#4d43e8]" />
          <MetricCard icon={CircleDollarSign} title="Revenue" value="$482,900" delta="+8.2%" deltaClass="bg-emerald-50 text-emerald-600" barClass="w-[63%] bg-[#16a49d]" />
          <MetricCard icon={Users} title="Active Clients" value="1,240" delta="+5.1%" deltaClass="bg-indigo-50 text-[#4d43e8]" barClass="w-[57%] bg-[#b4b0ff]" />
          <MetricCard icon={AlertTriangle} title="Low Stock Items" value="24" delta="Critical" deltaClass="bg-red-50 text-red-500" barClass="w-[18%] bg-[#4d43e8]" />
        </div>

        <div className="col-span-8">
          <Card className="min-h-[430px] bg-[#eef4ff]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Revenue Trend</h2>
                <p className="text-[12px] text-slate-500">Performance across service centers</p>
              </div>
              <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#4d43e8]" />Service</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#137d7a]" />Parts</span>
              </div>
            </div>
            <RevenueBars />
          </Card>
        </div>

        <div className="col-span-4">
          <Card className="min-h-[430px]">
            <div className="flex items-center justify-between">
              <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Priority Alerts</h2>
              <span className="rounded-md bg-[#ffd9d2] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#ef4b40]">
                5 Actionable
              </span>
            </div>

            <div className="mt-5 space-y-4">
              <AlertItem
                icon={BadgeAlert}
                color="bg-[#fff2f1] text-[#ef4b40]"
                title="Critical Low Stock"
                body="Turbocharger Gasket (V8-90) is below safety levels. Only 3 remaining."
                action="Order Now"
              />
              <AlertItem
                icon={FileText}
                color="bg-[#f0f0ff] text-[#6366f1]"
                title="Credit Reminder"
                body="Invoice #4928 for 'Alpine Logistics' is overdue by 4 days ($12,400)."
                action="Send Alert"
              />
              <AlertItem
                icon={BadgeCheck}
                color="bg-[#eef9f9] text-[#137d7a]"
                title="Service Verified"
                body="Maintenance for Vehicle Plate [K-2023] completed by Senior Tech Marcus."
                action="View Log"
              />
            </div>

            <button className="mt-6 w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-700 shadow-sm">
              Clear All Notifications
            </button>
          </Card>
        </div>

        <div className="col-span-5">
          <Card className="min-h-[260px]">
            <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Inventory Composition</h2>
            <div className="mt-8 flex items-center gap-8">
              <Donut />
              <div className="space-y-4 text-sm text-slate-500">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full bg-[#4d43e8]" />Engine Components</div>
                  <p className="ml-4 text-[12px]">54% Distribution</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full bg-[#137d7a]" />Transmission Gear</div>
                  <p className="ml-4 text-[12px]">22% Distribution</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full bg-[#7f88d6]" />Brake Systems</div>
                  <p className="ml-4 text-[12px]">15% Distribution</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900"><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />Others</div>
                  <p className="ml-4 text-[12px]">9% Distribution</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-7">
          <Card className="min-h-[260px] bg-[#eef4ff]">
            <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Service Stream</h2>
            <div className="mt-6 space-y-6">
              {[
                { icon: Wrench, title: "Engine Overhaul: Mercedes Actros", subtitle: "Technician: Dave Ramsey", time: "12:30 PM", color: "bg-[#4d43e8] text-white border-[#4d43e8]" },
                { icon: CircleCheck, title: "Parts Restock: Hydraulic Seals", subtitle: "Vendor: TechFlow Hydraulics", time: "11:15 AM", color: "bg-[#137d7a] text-white border-[#137d7a]" },
                { icon: FileText, title: "Invoice Generated: #INV-00922", subtitle: "Customer: Euro-Trans Gmbh", time: "09:45 AM", color: "bg-[#7f88d6] text-white border-[#7f88d6]" },
              ].map(({ icon: Icon, title, subtitle, time, color }) => (
                <div key={title} className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-slate-900">{title}</p>
                      <p className="text-[12px] text-slate-500">{subtitle}</p>
                    </div>
                  </div>
                  <span className="pt-1 text-[11px] font-semibold text-slate-500">{time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 mt-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[22px] font-bold tracking-tight text-slate-900">Fast-Moving Inventory</h2>
            </div>
            <button className="text-[13px] font-bold text-[#4d43e8] hover:underline">Manage Catalog</button>
          </div>

          <div className="mt-4 flex gap-4 overflow-x-auto pb-1">
            <InventoryCard
              image="/Brakes.png"
              imageClassName="bg-slate-700"
              category="Brakes"
              title="Premium Ceramic Pads"
              price="$245.00"
            />
            <InventoryCard
              image="/Engine.png"
              imageClassName="bg-slate-700"
              category="Engine"
              title="Forged Piston Set"
              price="$890.00"
            />
            <InventoryCard
              image="/Filters.png"
              imageClassName="bg-slate-700"
              category="Filters"
              title="High-Flow Oil Filter"
              price="$45.50"
            />
            <InventoryCard
              image="/Gearbox.png"
              imageClassName="bg-slate-700"
              category="Gearbox"
              title="Syncro Hub 3rd Gen"
              price="$1,250.00"
            />
            <InventoryCard
              image="/Electrical.png"
              imageClassName="bg-slate-700"
              category="Electrical"
              title="High Output Alternator"
              price="$340.00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
