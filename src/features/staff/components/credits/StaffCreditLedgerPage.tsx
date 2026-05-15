"use client";

import CreditLedgerPage from "@/features/credits/components/CreditLedgerPage";
import StaffShell from "@/shared/components/layout/StaffShell";

export default function StaffCreditLedgerPage() {
  return (
    <StaffShell>
      <CreditLedgerPage role="staff" />
    </StaffShell>
  );
}

