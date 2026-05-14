import FilterTabs from "@/shared/components/ui/FilterTabs";

import type { CustomerReportTabKey } from "../shared/report.types";

const tabs = [
  { key: "top-spenders", label: "Top Spenders" },
  { key: "regular-customers", label: "Regular Customers" },
  { key: "pending-credit", label: "Pending Credit" },
] as const;

interface ReportTabsProps {
  activeTab: CustomerReportTabKey;
  onChange: (tab: CustomerReportTabKey) => void;
}

export default function ReportTabs({ activeTab, onChange }: ReportTabsProps) {
  return (
    <FilterTabs
      tabs={tabs.map((tab) => ({ key: tab.key, label: tab.label }))}
      activeKey={activeTab}
      onChange={(value) => onChange(value as CustomerReportTabKey)}
    />
  );
}
