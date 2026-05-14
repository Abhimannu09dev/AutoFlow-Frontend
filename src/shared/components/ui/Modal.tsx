"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  title: string;
  subtitle?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidthClassName?: string;
  headerIcon?: ReactNode;
  closeOnBackdrop?: boolean;
  bodyClassName?: string;
  footerClassName?: string;
}

export default function Modal({
  title,
  subtitle,
  open,
  onClose,
  children,
  footer,
  maxWidthClassName = "max-w-xl",
  headerIcon,
  closeOnBackdrop = true,
  bodyClassName = "",
  footerClassName = "",
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <div
        className={`w-full ${maxWidthClassName} rounded-xl border border-[#c5c6cd] bg-[#fbf8fa] shadow-[0_20px_35px_rgba(15,23,42,0.2)]`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-start justify-between border-b border-[#c5c6cd] bg-[#fbf8fa] px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {headerIcon ? (
              <span className="inline-flex size-10 items-center justify-center rounded-lg bg-[rgba(0,106,97,0.1)] text-[#006a61]">
                {headerIcon}
              </span>
            ) : null}
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-8 text-[#1b1b1d]">{title}</h2>
              {subtitle ? (
                <p className="mt-1 text-base leading-6 text-[#45474c]">{subtitle}</p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-[#45474c] transition hover:bg-[#f0edef]"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className={`px-6 py-6 ${bodyClassName}`.trim()}>{children}</div>
        {footer ? <div className={`border-t border-[#c5c6cd] bg-[#f5f3f4] px-6 py-4 ${footerClassName}`.trim()}>{footer}</div> : null}
      </div>
    </div>
  );
}
