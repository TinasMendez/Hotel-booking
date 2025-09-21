    // src/components/WhatsAppButton.jsx
    import React from "react";
    import { createPortal } from "react-dom";
    import { showToast } from "./Toaster";

    /**
     * Floating WhatsApp chat using wa.me deep-link rendered in a portal.
     * - UI uses Tailwind classes (no <style> tag inline).
     * - Prevents overlap with Toaster by positioning at bottom-24.
     *
     * Env variables:
     *  - VITE_WHATSAPP_NUMBER (E.164 e.g. 573001112233 or +573001112233)
     *  - VITE_WHATSAPP_MESSAGE (optional)
     */
    export default function WhatsAppButton() {
    if (typeof window === "undefined" || typeof document === "undefined") return null;

    // Normalize phone and message from env
    const rawPhone = (import.meta.env.VITE_WHATSAPP_NUMBER ?? "+573001112233").toString().trim();
    const phone = rawPhone.startsWith("+") ? rawPhone.slice(1) : rawPhone;
    const msg =
        (import.meta.env.VITE_WHATSAPP_MESSAGE ??
        "Hi! I would like to know more about this property and the booking process.").toString();

    const url = new URL(`https://wa.me/${phone}`);
    if (msg) url.searchParams.set("text", msg);

    function openChat() {
        try {
        window.open(url.toString(), "_blank", "noopener,noreferrer");
        showToast({ title: "Opening WhatsApp…", type: "success", duration: 1500 });
        } catch (e) {
        showToast({ title: "Unable to open WhatsApp", description: e?.message || "", type: "error" });
        }
    }

    // Render in a portal to avoid stacking-context issues
    return createPortal(
        <button
        onClick={openChat}
        aria-label="Open WhatsApp chat"
        className="fixed right-4 bottom-24 z-[1000] inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition"
        >
        {/* Simple WhatsApp glyph */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7">
            <path
            fill="currentColor"
            d="M20.52 3.48A11.85 11.85 0 0012.04 0C5.7 0 .57 5.13.57 11.47c0 2.02.54 3.98 1.56 5.7L0 24l6.99-2.06a11.42 11.42 0 005.05 1.2h.01c6.34 0 11.47-5.13 11.47-11.47 0-3.06-1.19-5.93-3.5-8.19zM12.05 21.3h-.01a9.8 9.8 0 01-4.99-1.37l-.36-.21-4.15 1.22 1.23-4.05-.24-.38a9.8 9.8 0 01-1.56-5.04c0-5.41 4.4-9.81 9.81-9.81a9.74 9.74 0 016.95 2.88 9.74 9.74 0 012.86 6.94c0 5.41-4.4 9.81-9.81 9.81zm5.67-7.35c-.31-.15-1.82-.9-2.1-1.01-.28-.1-.48-.15-.68.16s-.78 1.01-.96 1.22-.35.23-.66.08c-.31-.15-1.32-.48-2.52-1.53-.93-.82-1.55-1.83-1.73-2.13-.18-.31-.02-.48.13-.63.13-.13.31-.35.46-.52.16-.18.21-.31.31-.52.1-.21.05-.39-.02-.54-.08-.16-.68-1.64-.93-2.25-.24-.57-.48-.49-.66-.5l-.57-.01c-.18 0-.52.08-.8.39-.28.31-1.06 1.04-1.06 2.53s1.09 2.94 1.25 3.14c.15.2 2.15 3.28 5.21 4.6.73.31 1.31.49 1.76.63.74.24 1.41.21 1.94.13.59-.09 1.82-.74 2.08-1.46.26-.72.26-1.34.18-1.46-.08-.13-.28-.2-.59-.35z"
            />
        </svg>
        </button>,
        document.body
    );
    }
