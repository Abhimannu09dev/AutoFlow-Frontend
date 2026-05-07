"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5fb]">
      <div className="rounded-2xl bg-white p-8 shadow text-center max-w-sm w-full">
        <h2 className="text-[18px] font-bold text-[#0f172a] mb-2">Something went wrong</h2>
        <p className="text-[13px] text-[#64748b] mb-5">{error.message}</p>
        <button
          onClick={reset}
          className="h-9 px-5 rounded-xl bg-[#4338ca] text-white text-[13px] font-semibold hover:brightness-105 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
