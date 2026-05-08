"use client";

import { Sidebar, type NavItem } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  brand: string;
  subtitle: string;
  user: {
    name: string;
    role: string;
  };
  showSearch?: boolean;
}

export function DashboardLayout({ 
  children, 
  navItems, 
  brand, 
  subtitle, 
  user, 
  showSearch = true 
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">
        <Sidebar 
          brand={brand}
          subtitle={subtitle}
          navItems={navItems}
          user={user}
        />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <Header user={user} showSearch={showSearch} />
          <main className="flex-1 overflow-y-auto px-6 py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}