import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  confirmLoadingLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  loading = false,
  errorMessage = "",
  tone = "danger",
}) {
  const dialogRef = useRef(null);
  const focusableRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        if (!loading) {
          onCancel?.();
        }
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
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onCancel, loading]);

  useEffect(() => {
    if (!open) return;
    if (!dialogRef.current) return;
    const selectors = "button, [href], [tabindex]:not([tabindex='-1'])";
    const focusables = Array.from(dialogRef.current.querySelectorAll(selectors)).filter(
      (node) => !node.hasAttribute("disabled"),
    );
    focusableRef.current = focusables;
    focusables[0]?.focus();
  }, [open]);

  if (!open) return null;

  const confirmClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 focus-visible:outline-red-700"
      : "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onCancel?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-5"
      >
        <div className="space-y-2">
          <h2 id="confirm-dialog-title" className="text-xl font-semibold text-slate-900">
            {title}
          </h2>
          {description ? <p className="text-sm text-slate-600">{description}</p> : null}
          {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${confirmClasses}`}
          >
            {loading ? confirmLoadingLabel ?? confirmLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
