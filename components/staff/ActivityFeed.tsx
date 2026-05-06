import SectionCard from "@/components/ui/SectionCard";

const recentActivity = [
  { title: "New Registration", desc: "David Chen joined as a Premium Member.", time: "2 mins ago", dot: "bg-[#4338ca]" },
  { title: "Profile Updated", desc: "Fleet Logistics updated billing address.", time: "1 hour ago", dot: "bg-[#16a34a]" },
  { title: "New Registration", desc: "Maria Garcia added to Customer List.", time: "3 hours ago", dot: "bg-[#4338ca]" },
];

export default function ActivityFeed() {
  return (
    <SectionCard>
      <h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">
        Recent Activity
      </h2>
      <div className="space-y-4">
        {recentActivity.map((item, i) => (
          <div key={i} className="flex gap-3">
            <span className={`mt-1.5 size-2 shrink-0 rounded-full ${item.dot}`} />
            <div>
              <p className="text-[13px] font-bold text-[#1e293b]">{item.title}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-[#64748b]">{item.desc}</p>
              <p className="mt-1 text-[11px] text-[#94a3b8]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-[#e8eaf2] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748b] transition hover:bg-[#f8f9fc]"
      >
        Load More History
        <span className="flex size-6 items-center justify-center rounded-full bg-[#4338ca] text-white text-base font-bold leading-none">
          +
        </span>
      </button>
    </SectionCard>
  );
}
