export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5fb]">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-2 border-[#4338ca] border-t-transparent animate-spin" />
        <p className="text-[13px] text-[#64748b] font-medium">Loading…</p>
      </div>
    </div>
  );
}
