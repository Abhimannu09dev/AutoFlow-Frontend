"use client";

import { Eye, EyeOff, LockKeyhole, Mail, Zap } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [remember, setRemember] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const router = useRouter();

	const footerLinks = ["Privacy Policy", "Terms of Service", "System Status"];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(null);

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const result = await response.json().catch(() => null);

			if (!response.ok) {
				const message = result?.message ?? result?.Message ?? "Login failed.";
				setErrorMessage(typeof message === "string" ? message : JSON.stringify(message));
				return;
			}

			if (remember) {
				localStorage.setItem("autoflow_auth", JSON.stringify(result?.data ?? result?.Data ?? null));
			}

			setErrorMessage(null);
			router.push("/staff");
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			setErrorMessage(message.includes("Failed to fetch")
				? "Network error: could not reach the login API proxy or backend."
				: message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#f3f5fb] px-4 py-8 text-slate-700">
			<div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[920px] flex-col items-center justify-center gap-4">

				<main className="flex w-full justify-center py-20">
					<section className="w-full max-w-[410px] rounded-2xl bg-white px-6 pb-8 pt-7 shadow-[0_18px_40px_rgba(85,93,128,0.12)] ring-1 ring-black/5 sm:px-7">
						<div className="flex flex-col items-center text-center">
							<div className="flex size-10 items-center justify-center rounded-xl bg-[#efeefe] text-[#4f46e5] shadow-[0_2px_6px_rgba(79,70,229,0.08)]">
								<Zap size={22} strokeWidth={2.4} aria-hidden="true" />
							</div>
							<h1 className="mt-4 text-[28px] font-semibold leading-none tracking-tight text-slate-800">AutoFlow</h1>
							<p className="mt-2 text-[13px] font-medium text-slate-500">Precision Management Portal</p>
						</div>

						<form className="mt-8 space-y-4" onSubmit={handleSubmit}>
							{errorMessage ? (
								<div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
									{errorMessage}
								</div>
							) : null}
							<div>
								<label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
									Email Address
								</label>
								<div className="relative">
									<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
										<Mail size={16} strokeWidth={2} aria-hidden="true" />
									</span>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="name@kinetic.atelier"
										className="w-full rounded-xl border border-[#edf0f6] bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-[#d9def0] focus:ring-2 focus:ring-[#dad8ff]"
									/>
								</div>
							</div>

							<div>
								<label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
									Password
								</label>
								<div className="relative">
									<span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
										<LockKeyhole size={16} strokeWidth={2} aria-hidden="true" />
									</span>
									<input
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••"
										className="w-full rounded-xl border border-[#edf0f6] bg-white py-3 pl-10 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-300 focus:border-[#d9def0] focus:ring-2 focus:ring-[#dad8ff]"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((s) => !s)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
										aria-label="Toggle password visibility"
									>
										{showPassword ? <EyeOff size={18} strokeWidth={2} aria-hidden="true" /> : <Eye size={18} strokeWidth={2} aria-hidden="true" />}
									</button>
								</div>
							</div>

							<div className="flex items-center justify-between pt-1 text-sm">
								<label className="inline-flex items-center gap-2 text-slate-700">
									<input
										type="checkbox"
										checked={remember}
										onChange={() => setRemember(!remember)}
										className="size-4 rounded border-slate-300 text-[#4f46e5] focus:ring-[#dad8ff]"
									/>
									Remember device
								</label>
								<Link href="#" className="font-semibold text-[#4338ca] hover:underline">
									Forgot Password?
								</Link>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#3f2fd8] to-[#5d56f0] px-4 py-3.5 text-base font-semibold text-white shadow-[0_8px_18px_rgba(63,47,216,0.28)] transition hover:brightness-105"
							>
								{isLoading ? "Logging in..." : "Login"}
							</button>

							<div className="pt-7 text-center">
								<p className="text-[13px] text-slate-500">Don't have an account yet?</p>
								<Link
									href="/auth/signup"
									className="mt-4 block rounded-xl border border-[#edf0f6] bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
								>
									Create an Account
								</Link>
							</div>
						</form>
					</section>
				</main>

				<footer className=" flex flex-col items-center gap-4 pb-2 text-center">
					<h2 className="text-[26px] font-semibold tracking-tight text-[#93a0b8]">Kinetic Atelier</h2>
					<nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#a2abc0]">
						{footerLinks.map((item) => (
							<span key={item}>{item}</span>
						))}
					</nav>
					<p className="text-[11px] uppercase tracking-[0.22em] text-[#a2abc0]">
						© 2026 Kinetic Atelier. Precision Palette Management.
					</p>
				</footer>
			</div>
		</div>
	);
}

