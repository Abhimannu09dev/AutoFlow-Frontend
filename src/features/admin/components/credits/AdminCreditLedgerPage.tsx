"use client";

import CreditLedgerPage from "@/features/credits/components/CreditLedgerPage";
import AdminLayout from "@/shared/components/layout/AdminLayout";

export default function AdminCreditLedgerPage() {
  return (
    <AdminLayout>
      <CreditLedgerPage role="admin" />
    </AdminLayout>
  );
}

