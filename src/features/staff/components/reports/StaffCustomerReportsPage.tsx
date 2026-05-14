"use client";

import CustomerReportsPage from "@/features/reports/components/CustomerReportsPage";
import StaffShell from "@/shared/components/layout/StaffShell";

export default function StaffCustomerReportsPage() {
  return (
    <StaffShell>
      <CustomerReportsPage role="staff" />
    </StaffShell>
  );
}
