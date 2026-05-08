import { UserRoundPlus, UserSearch, ShoppingCart, SendHorizonal, LucideIcon } from "lucide-react";
import SectionCard from "@/shared/components/ui/SectionCard";

const actions: { label: string; icon: LucideIcon }[] = [
  { label: "Register Customer", icon: UserRoundPlus },
  { label: "Search Customer", icon: UserSearch },
  { label: "New Sale", icon: ShoppingCart },
  { label: "Send Invoice", icon: SendHorizonal },
];

export default function QuickActions() {
  return (
    <SectionCard>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex flex-col items-center gap-2 rounded-xl bg-[#f5f6fb] px-3 py-4 text-center transition hover:bg-[#eceef8]"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eceef8] text-[#4338ca]">
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            </div>
            <span className="text-[11px] font-semibold leading-tight text-[#374151]">{label}</span>
          </button>
        ))}
      </div>
    </SectionCard>
  );
}
