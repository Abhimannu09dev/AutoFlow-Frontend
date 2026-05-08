"use client";

import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

interface CustomerShellProps {
  children: React.ReactNode;
  userName: string;
  userRole: string;
}

export default function CustomerShell({ children, userName, userRole }: CustomerShellProps) {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">
        <CustomerSidebar userName={userName} userRole={userRole} />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <CustomerHeader userName={userName} userRole={userRole} />
          <main className="flex-1 overflow-y-auto px-6 py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
