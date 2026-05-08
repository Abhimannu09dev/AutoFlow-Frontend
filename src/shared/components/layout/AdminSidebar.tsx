"use client";

import Link from "next/link";
import { Box, Users, Truck, ClipboardList, FileText, Bell } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AdminNavItem {
	key: string;
	label: string;
	href: string;
	icon: LucideIcon;
}

export default function AdminNav() {
	const items: AdminNavItem[] = [
		{ key: "dashboard", label: "Dashboard", href: "/staff", icon: Box },
		{ key: "staff", label: "Staff Management", href: "/staff", icon: Users },
		{ key: "vendor", label: "Vendor Management", href: "/staff/vendor", icon: Truck },
		{ key: "parts", label: "Vehicle Parts Management", href: "/staff/parts", icon: ClipboardList },
		{ key: "invoices", label: "Purchase Invoice Management", href: "/staff/invoices", icon: FileText },
		{ key: "reports", label: "Financial Reports", href: "/staff/reports", icon: FileText },
		{ key: "notifications", label: "Notifications", href: "/staff/notifications", icon: Bell },
	];

	return (
		<aside className="w-64 min-h-screen bg-white border-r border-gray-100 px-4 py-6">
			<div className="mb-6">
				<h3 className="text-sm font-semibold text-indigo-600">AutoFlow</h3>
				<p className="mt-1 text-xs text-gray-400">ADMIN CONSOLE</p>
			</div>


			<nav className="flex flex-col gap-2">
				{items.map((it) => {
					const Icon = it.icon;
					return (
						<Link
							key={it.key}
							href={it.href}
							className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
						>
							<Icon className="h-4 w-4 text-gray-400" />
							<span>{it.label}</span>
						</Link>
					);
				})}
			</nav>

			<div className="mt-6 border-t border-gray-100 pt-4">
				<button className="w-full rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-md">
					Net Service Order
				</button>
			</div>
		</aside>
	);
}
