interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-[#fecaca] bg-[#fff5f5] p-6 text-center">
      <p className="text-sm font-semibold text-[#ba1a1a]">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-[#ba1a1a] px-4 py-2 text-sm font-medium text-[#ba1a1a]"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
