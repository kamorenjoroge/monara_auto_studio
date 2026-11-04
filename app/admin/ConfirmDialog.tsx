'use client';

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

// A REUSABLE "Are you sure?" pop-up. Use it before delete, reject, reset...
// It can also hold extra content (for example a text box for a reason) through `children`.
interface ConfirmDialogProps {
  open: boolean; // show it or hide it
  title: string;
  message: string;
  confirmLabel?: string; // text of the red button, e.g. "Delete"
  confirmDisabled?: boolean; // grey out the red button (e.g. until a reason is typed)
  children?: React.ReactNode; // extra content between the message and the buttons
  onConfirm: () => void; // runs when the user says yes
  onCancel: () => void; // runs when the user says no (or presses Esc)
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmDisabled = false,
  children,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  // Pressing the Escape key closes the pop-up
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Dark cover: clicking it also cancels */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-base font-bold uppercase tracking-wide text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-destructive-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;