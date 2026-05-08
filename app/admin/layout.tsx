import React from "react";
import AdminNav from "../../component/auth/admin/sharded/nav";
import AdminHeader from "../../component/auth/admin/sharded/header";

export const metadata = {
  title: "Admin - AutoFlow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <AdminNav />
        <div className="flex-1">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
