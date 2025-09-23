// src/components/ShareModal.jsx
import React, { useEffect, useRef } from "react";

/**
 * Accessible share modal.
 * - Props: open (bool), onClose (fn), data: {title, description, url, imageUrl}
 * - Focus: traps Tab inside, ESC closes, overlay click closes.
 */
export default function ShareModal({ open = false, onClose, data }) {
  const dialogRef = useRef(null);
  const firstRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
      } else if (e.key === "Tab") {
        // Minimal focus trap
        const focusable = dialogRef.current?.querySelectorAll(
          'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // Put focus on close button
      firstRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const url = data?.url || (typeof window !== "undefined" ? window.location.href : "");
  const title = data?.title || "Check this listing";
  const text = data?.description || "Found this on Digital Booking";
  const encoded = encodeURIComponent;

  const links = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encoded(`${title} – ${url}`)}`,
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded(url)}`,
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?url=${encoded(url)}&text=${encoded(title)}`,
    },
    {
      name: "Email",
      href: `mailto:?subject=${encoded(title)}&body=${encoded(`${text}\n\n${url}`)}`,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      aria-hidden={!open}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <header className="flex items-center justify-between p-4 border-b">
          <h3 id="share-title" className="text-lg font-semibold">
            Share
          </h3>
          <button
            ref={firstRef}
            onClick={onClose}
            className="rounded p-2 hover:bg-slate-100 focus-ring"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        <div className="p-4 space-y-3">
          <p className="text-sm text-slate-700">
            Share this link with your friends:
          </p>
          <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm break-all">
            {url}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {links.map((l, idx) => (
              <a
                key={l.name}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border bg-white px-3 py-2 text-sm hover:bg-slate-50 focus-ring"
                ref={idx === links.length - 1 ? lastRef : undefined}
              >
                {l.name}
              </a>
            ))}
          </div>
        </div>

        <footer className="p-4 border-t text-right">
          <button onClick={onClose} className="btn-outline focus-ring">
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
