import Link from "next/link";

export const metadata = {
  title: "Forgot Password – AutoFlow",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[410px] rounded-2xl bg-white px-7 py-8 shadow-[0_18px_40px_rgba(85,93,128,0.12)] ring-1 ring-black/5">
      <h1 className="text-[22px] font-bold text-[#0f172a] mb-1">Reset your password</h1>
      <p className="text-[13px] text-[#64748b] mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#475569]">
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@autoflow.com"
            className="w-full rounded-xl border border-[#edf0f6] bg-white py-3 px-4 text-sm text-[#1e293b] outline-none placeholder:text-[#94a3b8] focus:border-[#d9def0] focus:ring-2 focus:ring-[#dad8ff]"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-[#3f2fd8] to-[#5d56f0] py-3 text-sm font-semibold text-white shadow-[0_8px_18px_rgba(63,47,216,0.28)] hover:brightness-105 transition"
        >
          Send Reset Link
        </button>
      </form>
      <p className="mt-5 text-center text-[13px] text-[#64748b]">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-[#4338ca] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
