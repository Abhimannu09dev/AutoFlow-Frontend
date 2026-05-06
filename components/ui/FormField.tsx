"use client";

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export default function FormField({ label, type = "text", value, onChange, placeholder, className = "" }: FormFieldProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        suppressHydrationWarning
        className="h-11 w-full rounded-xl border border-[#e8eaf2] bg-[#f8f9fc] px-4 text-[13px] text-[#1e293b] outline-none transition focus:border-[#a5b4fc] focus:ring-2 focus:ring-[#e0e7ff]"
      />
    </div>
  );
}
