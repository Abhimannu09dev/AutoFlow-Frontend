"use client";

import CustomerReportsPage from "@/features/reports/components/CustomerReportsPage";
import AdminLayout from "@/shared/components/layout/AdminLayout";

export default function AdminCustomerReportsPage() {
  return (
    <AdminLayout>
      <CustomerReportsPage role="admin" />
    </AdminLayout>
  );
}
