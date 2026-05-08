"use client";

import StaffSidebar from "./StaffSidebar";
import StaffHeader from "./StaffHeader";

interface StaffShellProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}

export default function StaffShell({ children, userName, userRole }: StaffShellProps) {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">
        <StaffSidebar />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <StaffHeader userName={userName} userRole={userRole} />
          <main className="flex-1 overflow-y-auto px-6 py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
