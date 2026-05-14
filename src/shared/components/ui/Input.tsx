import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-xl border border-[#e2e8f0] bg-white px-4 py-3 text-[13px] text-[#0f172a] placeholder-[#94a3b8] focus:border-[#4338ca] focus:outline-none focus:ring-2 focus:ring-[#4338ca]/20 ${className}`}
        {...props}
      />
    </div>
  );
}
