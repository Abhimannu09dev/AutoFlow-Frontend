"use client";

import { useState } from "react";

import FormDialog from "@/shared/components/ui/FormDialog";

import { updateCreditStatus } from "../shared/credit-api";
import type { CreditDetail, CreditLedgerRow, CreditStatusUpdateValue } from "../shared/credit.types";

type CreditStatusModalProps = {
  open: boolean;
  row: CreditLedgerRow | null;
  detail: CreditDetail | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const STATUS_OPTIONS: Array<{ value: CreditStatusUpdateValue; label: string }> = [
  { value: "Outstanding", label: "Outstanding" },
  { value: "PartiallyPaid", label: "Partially Paid" },
  { value: "Paid", label: "Paid" },
  { value: "Overdue", label: "Overdue" },
];

export default function CreditStatusModal({ open, row, detail, onClose, onSuccess }: CreditStatusModalProps) {
  const saleId = detail?.saleId ?? row?.saleId ?? "";
  const currentStatus = detail?.backendStatus ?? row?.backendStatus ?? "Outstanding";

  const [status, setStatus] = useState<CreditStatusUpdateValue>(currentStatus);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!saleId) {
      setErrorMessage("Sale identifier is missing.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await updateCreditStatus(saleId, { status });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message || "Failed to update credit status.");
      return;
    }

    onClose();
    onSuccess(result.message || "Credit status updated successfully.");
  };

  return (
    <FormDialog
      title="Update Credit Status"
      description="Set the latest status for this credit sale."
      open={open}
      onClose={onClose}
      onSubmit={() => {
        void handleSubmit();
      }}
      submitLabel="Update Status"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      maxWidthClassName="max-w-xl"
    >
      <div className="space-y-3">
        <p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f172a]">Sale ID:</span> {saleId}</p>
        <label className="space-y-1 text-sm text-[#334155]">
          New Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as CreditStatusUpdateValue)}
            className="h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a]"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </FormDialog>
  );
}
