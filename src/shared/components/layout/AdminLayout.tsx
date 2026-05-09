"use client";

import React from "react";
import { useEffect, useState } from "react";

import AdminHeader from "./AdminHeader";
import AdminNav from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <div className="h-screen overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <div className="flex h-screen">
        <AdminNav
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

        <div className="flex h-screen min-w-0 flex-1 flex-col lg:pl-64">
          <AdminHeader onMenuToggle={() => setIsMobileNavOpen((open) => !open)} />
          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
            <div className="w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
