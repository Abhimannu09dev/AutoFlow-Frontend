"use client";

import { AlertTriangle } from "lucide-react";

import Modal from "./Modal";

interface ConfirmDialogProps {
  title: string;
  description: string;
  open: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export default function ConfirmDialog({
  title,
  description,
  open,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isPending = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      open={open}
      onClose={onCancel}
      maxWidthClassName="max-w-md"
      footer={(
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            disabled={isPending}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#ba1a1a] px-4 py-2 text-sm font-medium text-white"
            disabled={isPending}
          >
            {isPending ? "Please wait..." : confirmLabel}
          </button>
        </div>
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full bg-[#fee2e2] p-2 text-[#ba1a1a]">
          <AlertTriangle className="size-4" />
        </span>
        <p className="text-sm leading-6 text-[#45474c]">{description}</p>
      </div>
    </Modal>
  );
}
