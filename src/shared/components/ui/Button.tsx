import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4338ca] disabled:opacity-60";

  const variants = {
    primary: "bg-[#4338ca] text-white hover:brightness-105 shadow-[0_4px_12px_rgba(67,56,202,0.3)]",
    secondary: "border border-[#dde1ed] bg-white text-[#374151] hover:bg-[#f8f9fc]",
    ghost: "text-[#4338ca] hover:underline",
  };

  const sizes = {
    sm: "h-8 px-3 text-[12px]",
    md: "h-10 px-5 text-[13px]",
    lg: "h-12 px-6 text-[14px]",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
