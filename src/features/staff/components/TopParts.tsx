import SectionCard from "@/shared/components/ui/SectionCard";

const topParts = [
  { name: "V8 Spark Plugs", sub: "High Demand", subColor: "text-[#4338ca]", icon: "⚙️" },
  { name: "Synth-Grade Oil", sub: "12 in stock", subColor: "text-[#475569]", icon: "🛢️" },
  { name: "Michelin 245/40", sub: "Restock Needed", subColor: "text-[#c62828]", icon: "🔧" },
];

export default function TopParts() {
  return (
    <SectionCard>
      <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
        Top Velocity Parts
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {topParts.map((part) => (
          <div key={part.name} className="flex flex-col items-center rounded-xl bg-[#f5f6fb] p-4 text-center">
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[#eceef8] text-xl">
              {part.icon}
            </div>
            <p className="text-[12px] font-semibold text-[#1e293b]">{part.name}</p>
            <p className={`mt-0.5 text-[11px] font-semibold ${part.subColor}`}>{part.sub}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
