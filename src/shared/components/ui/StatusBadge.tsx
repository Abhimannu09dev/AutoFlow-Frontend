interface StatusBadgeProps {
  status: "completed" | "pending" | "cancelled" | "processing";
  className?: string;
}

const statusConfig = {
  completed: {
    label: "Completed",
    className: "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
  },
  pending: {
    label: "Pending",
    className: "bg-[#fef3c7] text-[#d97706] border-[#fde68a]"
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-[#fee2e2] text-[#dc2626] border-[#fecaca]"
  },
  processing: {
    label: "Processing",
    className: "bg-[#dbeafe] text-[#2563eb] border-[#bfdbfe]"
  }
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold border
      ${config.className} ${className}
    `}>
      {config.label}
    </span>
  );
}