"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Pencil, Plus, Trash2, Users2 } from "lucide-react";

import AdminLayout from "@/shared/components/layout/AdminLayout";

type StaffStatus = "On Duty" | "Off Duty" | "On Break";

type StaffMember = {
  id: string;
  name: string;
  initials: string;
  joined: string;
  email: string;
  role: string;
  status: StaffStatus;
};

const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Julianne Devis",
    initials: "JD",
    joined: "Joined Oct 2023",
    email: "j.devis@kineticatelier.com",
    role: "Senior Mechanic",
    status: "On Duty",
  },
  {
    id: "2",
    name: "Marcus Kinsley",
    initials: "MK",
    joined: "Joined Jan 2024",
    email: "m.kinsley@kineticatelier.com",
    role: "Inventory Manager",
    status: "On Duty",
  },
  {
    id: "3",
    name: "Sarah Roswald",
    initials: "SR",
    joined: "Joined Mar 2024",
    email: "s.roswald@kineticatelier.com",
    role: "Service Advisor",
    status: "Off Duty",
  },
  {
    id: "4",
    name: "Hans Landa",
    initials: "HL",
    joined: "Joined Feb 2023",
    email: "h.landa@kineticatelier.com",
    role: "Workshop Chief",
    status: "On Break",
  },
];

const performanceBars = [
  { label: "Mon", technical: 42, admin: 24 },
  { label: "Tue", technical: 54, admin: 26 },
  { label: "Wed", technical: 48, admin: 18 },
  { label: "Thu", technical: 62, admin: 28 },
  { label: "Fri", technical: 58, admin: 22 },
  { label: "Sat", technical: 40, admin: 16 },
];

function StatusPill({ status }: { status: StaffStatus }) {
  const styles: Record<StaffStatus, string> = {
    "On Duty": "bg-white text-[#0f766e]",
    "Off Duty": "bg-white text-[#9ca3af]",
    "On Break": "bg-white text-[#dc2626]",
  };

  const dotStyles: Record<StaffStatus, string> = {
    "On Duty": "bg-[#0f766e]",
    "Off Duty": "bg-[#c4c4d4]",
    "On Break": "bg-[#dc2626]",
  };

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-0 py-1 text-xs font-semibold ${styles[status]}`}>
      <span className={`size-2 rounded-full ${dotStyles[status]}`} />
      {status}
    </span>
  );
}

export default function AdminStaffManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "technicians" | "managers">("all");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Staff Management</h1>
            <p className="mt-1 max-w-2xl text-[14px] leading-5 text-slate-600">
              Manage your technical crew, service advisors, and administrative personnel from a centralized directory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:pt-6">
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#4f46e5] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(79,70,229,0.24)] transition hover:bg-[#4338ca]">
              <Users2 className="h-4 w-4" />
              Add Staff Member
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-[34px] bg-white px-6 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 min-h-[180px]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#f1f0ff] text-[#4f46e5]">
                <Users2 className="h-4 w-4" />
              </div>
              <span className="rounded-full bg-[#ecfdf5] px-4 py-1.5 text-[11px] font-semibold text-[#0f766e]">+4 this month</span>
            </div>
            <p className="text-[13px] font-medium text-slate-500">Total Personnel</p>
            <div className="mt-1 flex items-end justify-between gap-4">
              <div>
                <p className="text-[32px] font-bold tracking-tight text-slate-900">42 Active</p>
              </div>
            </div>
          </div>

          <div className="rounded-[34px] bg-[#edf3ff] px-6 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 lg:col-span-2 min-h-[180px]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-[16px] font-bold text-slate-900">Weekly Performance Overviet</h2>
                <p className="mt-2 max-w-lg text-[13px] text-slate-600">Service efficiency is up by 12% compared to last week.</p>
              </div>
              <div className="mt-1 flex items-center gap-5 text-[12px] font-semibold text-slate-500">
                <span className="inline-flex items-center gap-2 text-[#3f37de]"><span className="size-2 rounded-full bg-[#3f37de]" />Technical</span>
                <span className="inline-flex items-center gap-2 text-[#0f766e]"><span className="size-2 rounded-full bg-[#0f766e]" />Administrative</span>
              </div>
            </div>

            <div className="mt-8 flex items-end justify-end gap-3 pr-2">
              {performanceBars.map((bar) => (
                <div key={bar.label} className="flex w-10 flex-col items-center gap-3">
                  <div className="flex items-end gap-2">
                    <div className="w-4 rounded-t-xl bg-[#b2aef3]" style={{ height: `${bar.admin}px` }} />
                    <div className="w-4 rounded-t-xl bg-[#3f37de]" style={{ height: `${bar.technical}px` }} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[28px] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)] ring-1 ring-slate-100">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 rounded-xl bg-[#f8fafc] p-1">
              {[
                { key: "all", label: "All Staff" },
                { key: "technicians", label: "Technicians" },
                { key: "managers", label: "Managers" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition ${activeTab === tab.key ? "bg-[#e2e8ff] text-[#4338ca] shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button className="inline-flex items-center gap-2 self-start rounded-xl px-4 py-2 text-[13px] font-semibold text-[#4f46e5] transition hover:bg-[#f8fafc] sm:self-auto">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  <th className="px-6 py-4">Name & Profile</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-bold text-[#4f46e5]">
                          {member.initials}
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold leading-4 text-slate-900">{member.name}</p>
                          <p className="text-[11px] text-slate-500">{member.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-700">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-[#eef2ff] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#4f46e5]">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill status={member.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button type="button" className="rounded-lg p-1 text-[#4f46e5] transition hover:bg-[#eef2ff]" aria-label={`Edit ${member.name}`}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-lg p-1 text-[#dc2626] transition hover:bg-[#fff1f2]" aria-label={`Delete ${member.name}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] text-slate-600">Showing 4 of 42 staff members</p>
            <div className="flex items-center gap-2">
              <button className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex size-8 items-center justify-center rounded-full bg-[#4f46e5] text-sm font-semibold text-white shadow-[0_8px_18px_rgba(79,70,229,0.24)]">1</button>
              <button className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50">2</button>
              <button className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50">3</button>
              <button className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
