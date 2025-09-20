import React, { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

function buildFacebookUrl(url, quote) {
  const params = new URLSearchParams({ u: url });
  if (quote) {
    params.set("quote", quote);
  }
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

function buildTwitterUrl(url, text) {
  const params = new URLSearchParams({ url });
  if (text) {
    params.set("text", text);
  }
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

export default function ShareModal({ open, onClose, shareUrl, title, onCopy }) {
  const { formatMessage } = useIntl();
  const dialogRef = useRef(null);
  const focusableRef = useRef([]);
  const [message, setMessage] = useState(title || "");

  useEffect(() => {
    if (open) {
      setMessage(title || "");
    }
  }, [open, title]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (!dialogRef.current) return;
    const selectors =
      "a[href], button, textarea, input, select, [tabindex]:not([tabindex='-1'])";
    const focusables = Array.from(dialogRef.current.querySelectorAll(selectors)).filter(
      (node) => !node.hasAttribute("disabled"),
    );
    focusableRef.current = focusables;
    focusables[0]?.focus();
  }, [open]);

  const shareMessage = useMemo(() => {
    const trimmed = message.trim();
    if (trimmed.length > 0) return trimmed;
    return title || "";
  }, [message, title]);

  const twitterUrl = useMemo(
    () => buildTwitterUrl(shareUrl, shareMessage),
    [shareUrl, shareMessage],
  );
  const facebookUrl = useMemo(
    () => buildFacebookUrl(shareUrl, shareMessage),
    [shareUrl, shareMessage],
  );

  const handleInstagramOpen = () => {
    if (typeof window !== "undefined") {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={formatMessage({ id: "modal.share.title" })}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6 space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-slate-900">{formatMessage({ id: "modal.share.title" })}</h2>
          <p className="text-sm text-slate-600">{formatMessage({ id: "modal.share.subtitle" })}</p>
        </div>

        <div className="space-y-2">
          <label className="flex flex-col gap-2 text-sm text-slate-700" htmlFor="share-message">
            <span className="font-medium">{formatMessage({ id: "modal.share.messageLabel" })}</span>
            <textarea
              id="share-message"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={formatMessage({ id: "modal.share.messagePlaceholder" })}
              aria-describedby="share-message-help"
            />
          </label>
          <p className="text-xs text-slate-500" id="share-message-help">
            {formatMessage({ id: "modal.share.messageHelp" })}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <span>{formatMessage({ id: "modal.share.facebook" })}</span>
            <span className="text-sm text-slate-500">Open share dialog</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <span>{formatMessage({ id: "modal.share.twitter" })}</span>
            <span className="text-sm text-slate-500">Tweet this listing</span>
          </a>

          <div className="space-y-3 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600 bg-slate-50">
            <p>{formatMessage({ id: "modal.share.instagram.instructions" })}</p>
            <button
              type="button"
              onClick={handleInstagramOpen}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {formatMessage({ id: "modal.share.instagram.open" })}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-slate-100 truncate">
            {shareUrl}
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {formatMessage({ id: "modal.share.copy" })}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            {formatMessage({ id: "modal.share.close" })}
          </button>
        </div>
      </div>
    </div>
  );
}
