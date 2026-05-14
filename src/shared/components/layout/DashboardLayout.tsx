"use client";

import { useEffect, useState } from "react";
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
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f5fb] text-[#1f2937]">
      <div className="flex min-h-screen">
        <Sidebar 
          brand={brand}
          subtitle={subtitle}
          navItems={navItems}
          user={user}
          isOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />
        {isMobileNavOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close sidebar overlay"
          />
        ) : null}
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <Header
            user={user}
            showSearch={showSearch}
            onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
          />
          <main className="flex-1 overflow-y-auto px-6 py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
