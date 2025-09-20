import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useIntl } from "react-intl";

function buildFacebookUrl(url, quote) {
  const base = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  if (!quote) return base;
  return `${base}&quote=${encodeURIComponent(quote)}`;
}

function buildTwitterUrl(url, text) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export default function ShareModal({ open, onClose, shareUrl, title, onCopy }) {
  const { formatMessage } = useIntl();
  const dialogRef = useRef(null);
  const focusableRef = useRef([]);
  const [message, setMessage] = useState(title || "");

  useEffect(() => {
    if (!open) return;
    setMessage(title || "");
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
    const selectors = "a[href], button, [tabindex]:not([tabindex='-1'])";
    const focusables = Array.from(dialogRef.current.querySelectorAll(selectors)).filter(
      (node) => !node.hasAttribute("disabled"),
    );
    focusableRef.current = focusables;
    focusables[0]?.focus();
  }, [open]);

  const trimmedMessage = message.trim();
  const twitterUrl = useMemo(
    () => buildTwitterUrl(shareUrl, trimmedMessage || title || ""),
    [shareUrl, trimmedMessage, title],
  );
  const facebookUrl = useMemo(
    () => buildFacebookUrl(shareUrl, trimmedMessage || title || ""),
    [shareUrl, trimmedMessage, title],
  );

  const handleCopyLink = useCallback(() => {
    onCopy?.(shareUrl);
  }, [onCopy, shareUrl]);

  const handleInstagramShare = useCallback(async () => {
    const instagramText = [trimmedMessage, shareUrl].filter(Boolean).join("\n");
    if (onCopy) {
      await onCopy(instagramText || shareUrl);
    }
    if (typeof window !== "undefined") {
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    }
  }, [onCopy, shareUrl, trimmedMessage]);

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

        <label className="flex flex-col gap-2 text-sm text-slate-700">
          <span className="font-medium">{formatMessage({ id: "modal.share.messageLabel" })}</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder={formatMessage({ id: "modal.share.messagePlaceholder" })}
          />
        </label>

        <div className="grid grid-cols-1 gap-3">
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <span>{formatMessage({ id: "modal.share.facebook" })}</span>
            <span className="text-sm text-slate-500">
              {formatMessage({ id: "modal.share.facebookHint" })}
            </span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <span>{formatMessage({ id: "modal.share.twitter" })}</span>
            <span className="text-sm text-slate-500">
              {formatMessage({ id: "modal.share.twitterHint" })}
            </span>
          </a>

          <div className="space-y-2 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600 bg-slate-50">
            <p>{formatMessage({ id: "modal.share.instagram" })}</p>
            <button
              type="button"
              onClick={handleInstagramShare}
              className="w-full rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-pink-600 hover:via-red-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-200"
            >
              {formatMessage({ id: "modal.share.instagramButton" })}
            </button>
            <p className="text-xs text-slate-500">{formatMessage({ id: "modal.share.instagramInstructions" })}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 bg-slate-100 truncate">
            {shareUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
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
