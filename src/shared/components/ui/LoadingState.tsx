export default function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-[#c5c6cd] bg-white">
      <p className="text-sm font-medium text-[#45474c]">{message}</p>
    </div>
  );
}
