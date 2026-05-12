import { InputHTMLAttributes } from "react";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <div className={`
          flex size-5 items-center justify-center rounded border-2 transition-colors
          ${props.checked 
            ? 'bg-[#4338ca] border-[#4338ca]' 
            : 'bg-white border-[#d1d5db] hover:border-[#4338ca]'
          }
        `}>
          {props.checked && (
            <Check size={12} className="text-white" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && (
        <span className="text-[13px] text-[#64748b] select-none">{label}</span>
      )}
    </label>
  );
}