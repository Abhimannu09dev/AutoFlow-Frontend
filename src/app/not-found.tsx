import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f5fb]">
      <div className="rounded-2xl bg-white p-8 shadow text-center max-w-sm w-full">
        <p className="text-[48px] font-bold text-[#4338ca] leading-none">404</p>
        <h2 className="mt-2 text-[18px] font-bold text-[#0f172a]">Page not found</h2>
        <p className="mt-1 text-[13px] text-[#64748b] mb-5">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/login"
          className="inline-flex h-9 items-center px-5 rounded-xl bg-[#4338ca] text-white text-[13px] font-semibold hover:brightness-105 transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
