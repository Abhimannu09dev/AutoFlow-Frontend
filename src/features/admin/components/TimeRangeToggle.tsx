"use client";

export type TimeRange = "daily" | "weekly" | "monthly";

const ranges: Array<{ label: string; value: TimeRange }> = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

interface TimeRangeToggleProps {
  selectedRange: TimeRange;
  onChange: (range: TimeRange) => void;
  disabled?: boolean;
}

export default function TimeRangeToggle({
  selectedRange,
  onChange,
  disabled = false,
}: TimeRangeToggleProps) {
  return (
    <div className="inline-flex items-start rounded-lg bg-[#eff4ff] p-1">
      {ranges.map((range) => {
        const active = range.value === selectedRange;

        return (
          <button
            key={range.value}
            type="button"
            onClick={() => onChange(range.value)}
            disabled={disabled}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-white text-[#3525cd] shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
                : "text-[#464555] hover:text-[#0b1c30]"
            } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
            aria-pressed={active}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
