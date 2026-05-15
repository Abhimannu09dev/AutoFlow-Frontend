"use client";

import { useMemo, useState } from "react";

import FormDialog from "@/shared/components/ui/FormDialog";

import { formatCurrency, recordCreditPayment } from "../shared/credit-api";
import type { CreditDetail, CreditLedgerRow, CreditPaymentMethod } from "../shared/credit.types";

type CreditPaymentModalProps = {
  open: boolean;
  row: CreditLedgerRow | null;
  detail: CreditDetail | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

const PAYMENT_METHOD_OPTIONS: Array<{ value: CreditPaymentMethod; label: string }> = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Card" },
  { value: "Credit", label: "Other (Credit)" },
];

function getTodayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CreditPaymentModal({ open, row, detail, onClose, onSuccess }: CreditPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(getTodayDateInputValue());
  const [paymentMethod, setPaymentMethod] = useState<CreditPaymentMethod>("Cash");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerName = detail?.customerName ?? row?.customerName ?? "-";
  const saleId = detail?.saleId ?? row?.saleId ?? "";
  const invoiceNumber = detail?.invoiceNumber ?? row?.invoiceNumber ?? "-";
  const remainingAmount = useMemo(
    () => detail?.remainingAmount ?? row?.remainingAmount ?? 0,
    [detail?.remainingAmount, row?.remainingAmount]
  );

  const handleSubmit = async () => {
    if (!saleId) {
      setErrorMessage("Sale identifier is missing.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("Payment amount must be greater than zero.");
      return;
    }

    if (remainingAmount > 0 && parsedAmount > remainingAmount) {
      setErrorMessage("Payment amount cannot exceed remaining amount.");
      return;
    }

    if (!paymentDate) {
      setErrorMessage("Payment date is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const isoDate = new Date(`${paymentDate}T00:00:00`).toISOString();
    const result = await recordCreditPayment(saleId, {
      amount: parsedAmount,
      paymentDate: isoDate,
      paymentMethod,
      note: note.trim() || undefined,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message || "Failed to record payment.");
      return;
    }

    onClose();
    onSuccess(result.message || "Credit payment recorded successfully.");
  };

  return (
    <FormDialog
      title="Record Credit Payment"
      description="Add a payment against this credit sale and update outstanding balance."
      open={open}
      onClose={onClose}
      onSubmit={() => {
        void handleSubmit();
      }}
      submitLabel="Record Payment"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      maxWidthClassName="max-w-2xl"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f172a]">Customer:</span> {customerName}</p>
        <p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f172a]">Sale ID:</span> {saleId}</p>
        <p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f172a]">Invoice #:</span> {invoiceNumber || "-"}</p>
        <p className="text-sm text-[#334155]"><span className="font-semibold text-[#0f172a]">Remaining:</span> {formatCurrency(remainingAmount)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm text-[#334155]">
          Payment Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a]"
            placeholder="0.00"
          />
        </label>

        <label className="space-y-1 text-sm text-[#334155]">
          Payment Date
          <input
            type="date"
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
            className="h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a]"
          />
        </label>

        <label className="space-y-1 text-sm text-[#334155] md:col-span-2">
          Payment Method
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value as CreditPaymentMethod)}
            className="h-10 w-full rounded-md border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a]"
          >
            {PAYMENT_METHOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm text-[#334155] md:col-span-2">
          Notes
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="w-full rounded-md border border-[#cbd5e1] bg-white px-3 py-2 text-sm text-[#0f172a]"
            placeholder="Optional payment note"
          />
        </label>
      </div>
    </FormDialog>
  );
}
