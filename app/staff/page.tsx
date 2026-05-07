import { Download, RefreshCw } from "lucide-react";
import StaffShell from "@/components/layout/StaffShell";
import PageHeader from "@/components/ui/PageHeader";
import StaffStatsRow from "@/components/staff/StaffStatsRow";
import SalesTable from "@/components/staff/SalesTable";
import TopParts from "@/components/staff/TopParts";
import QuickActions from "@/components/staff/QuickActions";
import ActivityFeed from "@/components/staff/ActivityFeed";

export default function StaffDashboard() {
  const actions = (
    <>
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded-lg border border-[#dde1ed] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f8f9fc]"
      >
        <Download size={14} aria-hidden="true" />
        Download Report
      </button>
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-[#3730a3] to-[#4f46e5] px-4 text-[13px] font-semibold text-white shadow-[0_4px_12px_rgba(67,56,202,0.3)] transition hover:brightness-105"
      >
        <RefreshCw size={14} aria-hidden="true" />
        System Sync
      </button>
    </>
  );

  return (
    <StaffShell userName="Alex Fischer" userRole="Senior Curator">
      <PageHeader
        title="Atelier Dashboard"
        subtitle={
          <>
            Operational pulse for{" "}
            <span className="font-semibold text-[#4338ca]">October 24, 2023</span>
          </>
        }
        actions={actions}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <StaffStatsRow />
          <SalesTable />
          <TopParts />
        </div>
        <div className="space-y-4">
          <QuickActions />
          <ActivityFeed />
        </div>
      </div>
    </StaffShell>
  );
}
