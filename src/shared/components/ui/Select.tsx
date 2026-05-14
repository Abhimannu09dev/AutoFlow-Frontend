import { ChevronDown } from "lucide-react";
import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ 
  label, 
  options, 
  placeholder = "Select an option...", 
  className = "", 
  ...props 
}: SelectProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          size={16} 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" 
        />
      </div>
    </div>
  );
}
