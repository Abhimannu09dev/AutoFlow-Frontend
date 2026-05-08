import { Award } from "lucide-react";
import SectionCard from "@/shared/components/ui/SectionCard";

export default function MembershipCard() {
  return (
    <SectionCard>
      <h3 className="mb-4 text-[14px] font-bold text-[#0f172a]">Membership Tier</h3>
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#dcfce7] text-[#16a34a]">
          <Award size={18} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#1e293b]">Platinum Member</p>
          <p className="text-[11px] text-[#94a3b8]">Since October 2022</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#64748b]">Service credits</span>
          <span className="font-bold text-[#1e293b]">12 remaining</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f3f8]">
          <div className="h-full w-[50%] rounded-full bg-[#16a34a]" />
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[#64748b]">
          Next reward: 15% discount on performance brake kits after 2 more service bookings.
        </p>
      </div>
    </SectionCard>
  );
}
