// src/components/WhatsAppButton.jsx
import React from "react";
import { createPortal } from "react-dom";
import { showToast } from "./Toaster";

/**
 * Floating WhatsApp chat using wa.me deep-link rendered in a portal.
 * Position moved up (bottom-24) to avoid overlapping the footer.
 * Env:
 *  - VITE_WHATSAPP_NUMBER (e.g. 573001112233)
 *  - VITE_WHATSAPP_MESSAGE (optional)
 */
export default function WhatsAppButton() {
    if (typeof window === "undefined" || typeof document === "undefined") return null;

    const phone = (import.meta.env.VITE_WHATSAPP_NUMBER ?? "+573001112233").toString().trim();
    const message =
        (import.meta.env.VITE_WHATSAPP_MESSAGE ??
        "Hi! I would like to know more about this property.").toString();

    const digits = phone.replace(/[^\d+]/g, "");
    const href =
        digits.length > 0
        ? `https://wa.me/${encodeURIComponent(digits)}?text=${encodeURIComponent(message)}`
        : "#";

    function handleClick(e) {
        if (!digits) {
        e.preventDefault();
        showToast({
            type: "error",
            title: "Unable to open WhatsApp",
            description: "Invalid or missing phone number. Check VITE_WHATSAPP_NUMBER.",
        });
        return;
        }
        showToast({
        type: "success",
        title: "Opening WhatsApp…",
        description: "Chat window will open in a new tab.",
        });
    }

    const node = (
        <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        aria-label="Open WhatsApp chat"
        title="Open WhatsApp chat"
        className="fixed right-4 bottom-24 pointer-events-auto z-[9998] flex items-center gap-2 px-3 py-2 rounded-full bg-white border shadow-lg hover:bg-slate-50"
        >
        <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden>
            <path
            fill="currentColor"
            d="M19.1 17.3c-.3-.2-1.7-.8-1.9-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a6.5 6.5 0 0 1-3.1-2.7c-.2-.4 0-.5.1-.6l.3-.3c.1-.2.2-.3.3-.5s0-.3 0-.4-.6-1.6-.8-2.1c-.2-.5-.4-.5-.6-.5h-.5a1 1 0 0 0-.8.4 3.2 3.2 0 0 0-1 2.4A5.5 5.5 0 0 0 9 17a9.8 9.8 0 0 0 6 4.8 13.5 13.5 0 0 0 1.5.5 3.7 3.7 0 0 0 1.8.1 3 3 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.1-.3-.2-.4-.3Z"
            />
            <path
            fill="currentColor"
            d="M16 3a13 13 0 0 0-11.2 19.3L3 29l6.9-1.8A13 13 0 1 0 16 3Zm7.7 20.7A10.6 10.6 0 0 1 9.9 26l-.6-.2-4 .9.9-3.9-.2-.6a10.7 10.7 0 1 1 17.7 1.5Z"
            />
        </svg>
        <span className="text-sm">WhatsApp</span>
        </a>
    );

    return createPortal(node, document.body);
}
