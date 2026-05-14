"use client";

import { UserPlus } from "lucide-react";
import { useState } from "react";

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  joinDate: string;
  email: string;
  role: "SENIOR MECHANIC" | "INVENTORY MANAGER" | "SERVICE ADVISOR" | "WORKSHOP CHIEF";
  status: "On Duty" | "Off Duty" | "On Break";
  statusColor: string;
}

const staffData: StaffMember[] = [
  {
    id: "1",
    name: "Julianne Devis",
    initials: "JD",
    joinDate: "Joined Oct 2023",
    email: "j.devis@kineticatelier.com",
    role: "SENIOR MECHANIC",
    status: "On Duty",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: "2",
    name: "Marcus Kinsley",
    initials: "MK",
    joinDate: "Joined Jan 2024",
    email: "m.kinsley@kineticatelier.com",
    role: "INVENTORY MANAGER",
    status: "On Duty",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    id: "3",
    name: "Sarah Roswald",
    initials: "SR",
    joinDate: "Joined Mar 2024",
    email: "s.roswald@kineticatelier.com",
    role: "SERVICE ADVISOR",
    status: "Off Duty",
    statusColor: "bg-gray-100 text-gray-700",
  },
  {
    id: "4",
    name: "Hans Landa",
    initials: "HL",
    joinDate: "Joined Feb 2023",
    email: "h.landa@kineticatelier.com",
    role: "WORKSHOP CHIEF",
    status: "On Break",
    statusColor: "bg-red-100 text-red-700",
  },
];

export default function StaffManagementPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "technicians" | "managers">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getTotalPages = () => Math.ceil(staffData.length / itemsPerPage);
  const getPaginatedData = () => {
    const start = (currentPage - 1) * itemsPerPage;
    return staffData.slice(start, start + itemsPerPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Staff Management</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your technical crew, service advisors, and administrative personnel from a centralized directory.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg hover:bg-indigo-700 transition">
          <UserPlus size={18} />
          Add Staff Member
        </button>
      </div>

      {/* Stats and Chart Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Total Personnel Card */}
        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Personnel</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">42</p>
              <p className="mt-2 text-xs font-semibold text-green-600">+4 this month</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>

        {/* Weekly Performance Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Weekly Performance Overview</h3>
            <span className="text-xs font-medium text-slate-600">Service efficiency is up by 12% compared to last week.</span>
          </div>
          
          <div className="flex items-end justify-around gap-2" style={{ height: "120px" }}>
            {[
              { label: "Mon", height: "40%", type: "Technical" },
              { label: "Tue", height: "55%", type: "Technical" },
              { label: "Wed", height: "45%", type: "Administrative" },
              { label: "Thu", height: "70%", type: "Technical" },
              { label: "Fri", height: "65%", type: "Technical" },
              { label: "Sat", height: "35%", type: "Administrative" },
              { label: "Sun", height: "25%", type: "Administrative" },
            ].map((day, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  <div
                    className="w-3 rounded-sm bg-blue-500"
                    style={{ height: `${parseInt(day.height)}px` }}
                  />
                  <div
                    className="w-3 rounded-sm bg-indigo-300"
                    style={{ height: `${parseInt(day.height) * 0.7}px` }}
                  />
                </div>
                <span className="text-xs text-slate-600">{day.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-600">Technical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-indigo-300" />
              <span className="text-xs text-slate-600">Administrative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table Section */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200">
        {/* Tabs and Filter */}
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {["All Staff", "Technicians", "Managers"].map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() =>
                    setSelectedTab(
                      idx === 0 ? "all" : idx === 1 ? "technicians" : "managers"
                    )
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    (idx === 0 && selectedTab === "all") ||
                    (idx === 1 && selectedTab === "technicians") ||
                    (idx === 2 && selectedTab === "managers")
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              ↓ Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Name & Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData().map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-sm">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{member.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 uppercase">
                      {member.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${member.statusColor}`}
                    >
                      {member.status === "On Break" ? "● On Break" : `● ${member.status}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="rounded p-1 text-slate-600 hover:bg-slate-200 transition">
                        ✏️
                      </button>
                      <button className="rounded p-1 text-slate-600 hover:bg-slate-200 transition">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} of{" "}
            {staffData.length} staff members
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
              className="rounded px-3 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
            >
              ←
            </button>
            {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded font-semibold transition ${
                    currentPage === page
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(getTotalPages(), p + 1))
              }
              disabled={currentPage === getTotalPages()}
              className="rounded px-3 py-1 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition md:w-auto">
        + New Service Order
      </button>
    </div>
  );
}
