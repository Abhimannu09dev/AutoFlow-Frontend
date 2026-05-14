"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
}

export default function Modal({
  title,
  open,
  onClose,
  children,
  footer,
  maxWidthClassName = "max-w-xl",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={onClose} role="presentation">
      <div
        className={`w-full ${maxWidthClassName} rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] shadow-[0_20px_35px_rgba(15,23,42,0.2)]`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-[#c5c6cd] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#1b1b1d]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#45474c] transition hover:bg-[#f0edef]"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="border-t border-[#c5c6cd] px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
