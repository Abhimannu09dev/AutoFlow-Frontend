interface FilterTab {
  key: string;
  label: string;
}

interface FilterTabsProps {
  tabs: FilterTab[];
  activeKey: string;
  onChange: (key: string) => void;
}

export default function FilterTabs({ tabs, activeKey, onChange }: FilterTabsProps) {
  return (
    <div className="inline-flex rounded-lg border border-[#c5c6cd] bg-white p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            activeKey === tab.key ? "bg-[#0d9488] text-white" : "text-[#45474c]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
