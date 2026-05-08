"use client";

import { Bell, Search, Settings } from "lucide-react";

export default function AdminHeader() {
	return (
		<header className="w-full border-b border-slate-200 bg-white/95 px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur sm:px-6">
			<div className="flex w-full items-center gap-3">
				<div className="flex flex-1 items-center">
					<div className="flex w-full max-w-[260px] items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-400 ring-1 ring-slate-200/70 transition focus-within:bg-white focus-within:ring-slate-300">
						<Search className="h-4 w-4 shrink-0" aria-hidden="true" />
						<input
							type="search"
							placeholder="Search invoices, parts or vendors..."
							className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
						/>
					</div>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<button
						type="button"
						className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
						aria-label="Notifications"
					>
						<Bell className="h-4.5 w-4.5" aria-hidden="true" />
					</button>
					<button
						type="button"
						className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
						aria-label="Settings"
					>
						<Settings className="h-4.5 w-4.5" aria-hidden="true" />
					</button>

					<div className="flex items-center gap-3 pl-1 sm:pl-2">
						<div className="text-right leading-tight">
							<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Admin Profile</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400 text-[11px] font-semibold text-white ring-2 ring-slate-100">
							A
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}