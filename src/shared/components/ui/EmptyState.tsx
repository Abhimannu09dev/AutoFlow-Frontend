interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#c5c6cd] bg-white p-6 text-center">
      <h3 className="text-base font-semibold text-[#1b1b1d]">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-[#45474c]">{description}</p>
    </div>
  );
}
