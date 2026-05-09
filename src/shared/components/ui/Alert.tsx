import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

interface AlertProps {
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  className?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-[#059669]",
    textColor: "text-white",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-[#dc2626]",
    textColor: "text-white",
  },
  info: {
    icon: Info,
    bgColor: "bg-[#0284c7]",
    textColor: "text-white",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-[#d97706]",
    textColor: "text-white",
  },
};

export function Alert({ type, title, message, className = "" }: AlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl ${config.bgColor} ${config.textColor} p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex size-6 items-center justify-center rounded-full bg-white/20 mt-0.5">
          <Icon size={16} />
        </div>
        <div>
          <h3 className="text-[14px] font-semibold">{title}</h3>
          <p className="mt-1 text-[12px] opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
}