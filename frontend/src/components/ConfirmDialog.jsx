import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  busy = false,
  errorMessage = "",
  confirmButtonClass = "px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
  cancelButtonClass = "px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-60",
}) {
  const dialogRef = useRef(null);
  const focusableRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !busy) {
        onCancel?.();
        return;
      }
      if (event.key === "Tab") {
        const focusables = focusableRef.current;
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, busy, onCancel]);

  useEffect(() => {
    if (!open) return;
    if (!dialogRef.current) return;
    const selectors = "button, a[href], [tabindex]:not([tabindex='-1'])";
    const focusables = Array.from(dialogRef.current.querySelectorAll(selectors)).filter(
      (node) => !node.hasAttribute("disabled"),
    );
    focusableRef.current = focusables;
    focusables[0]?.focus();
  }, [open, busy]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) {
          onCancel?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-4"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && <p className="text-sm text-slate-600">{description}</p>}
          {children}
        </div>
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={cancelButtonClass}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmButtonClass}
            disabled={busy}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
