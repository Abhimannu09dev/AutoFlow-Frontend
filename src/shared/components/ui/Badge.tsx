interface BadgeProps {
  label: string;
  colorClass: string;
}

export default function Badge({ label, colorClass }: BadgeProps) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${colorClass}`}>
      {label}
    </span>
  );
}
