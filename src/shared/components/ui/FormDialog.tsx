"use client";

import type { ReactNode } from "react";

import Modal from "./Modal";

interface FormDialogProps {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  errorMessage?: string | null;
  maxWidthClassName?: string;
  headerIcon?: ReactNode;
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

export default function FormDialog({
  title,
  description,
  open,
  onClose,
  onSubmit,
  submitLabel = "Save",
  isSubmitting = false,
  submitDisabled = false,
  errorMessage = null,
  maxWidthClassName = "max-w-2xl",
  headerIcon,
  closeOnBackdrop = true,
  children,
}: FormDialogProps) {
  return (
    <Modal
      title={title}
      subtitle={description}
      open={open}
      onClose={onClose}
      maxWidthClassName={maxWidthClassName}
      headerIcon={headerIcon}
      closeOnBackdrop={closeOnBackdrop}
      footer={(
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#c5c6cd] px-4 py-2 text-sm font-medium text-[#45474c]"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-[#006a61] px-4 py-2 text-sm font-medium text-white"
            disabled={isSubmitting || submitDisabled}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </button>
        </div>
      )}
    >
      <div className="space-y-4">
        {errorMessage ? (
          <div className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
            {errorMessage}
          </div>
        ) : null}
        {children}
      </div>
    </Modal>
  );
}
