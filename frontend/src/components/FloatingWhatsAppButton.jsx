import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useToast } from "../shared/ToastProvider.jsx";

const rawNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || "").trim();
const normalizedNumber = rawNumber.replace(/[^0-9+]/g, "");

export default function FloatingWhatsAppButton() {
  const location = useLocation();
  const toast = useToast();

  const waLink = useMemo(() => {
    if (!normalizedNumber) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const currentPath = origin ? `${origin}${location.pathname}${location.search}` : location.pathname;
    const messageTemplate = import.meta.env.VITE_WHATSAPP_MESSAGE || "Hi! I would like to know more about this property:";
    const text = `${messageTemplate} ${currentPath}`.trim();
    return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(text)}`;
  }, [location.pathname, location.search]);

  function handleClick() {
    if (!normalizedNumber) {
      toast?.error("WhatsApp contact is not available at the moment.");
      return;
    }
    if (!waLink) {
      toast?.error("We could not build the WhatsApp link.");
      return;
    }
    try {
      const win = window.open(waLink, "_blank", "noopener,noreferrer");
      if (win) {
        toast?.success("Opening WhatsApp…");
        win.opener = null;
      } else {
        throw new Error("popup-blocked");
      }
    } catch (error) {
      console.error("WhatsApp open failed", error);
      toast?.error("Please allow pop-ups to contact us on WhatsApp.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-emerald-500 text-white shadow-xl px-4 py-3 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-400"
      aria-label="Contact us on WhatsApp"
      title="Contact us on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-5 h-5 fill-current"
        aria-hidden="true"
      >
        <path d="M16.04 3C9.4 3 4 8.3 4 14.83c0 3 1.24 5.76 3.3 7.83L6 29l6.5-1.7c1.17.32 2.4.5 3.67.5 6.64 0 12.04-5.3 12.04-11.83C28.22 8.3 22.68 3 16.04 3zm0 2.67c5.12 0 9.28 4.07 9.28 9.16 0 5.05-4.16 9.15-9.3 9.15-1.16 0-2.3-.2-3.35-.58l-.73-.26-3.84 1.02 1.03-3.74-.48-.76c-1.4-1.72-2.17-3.9-2.17-6.1 0-5.08 4.16-9.16 9.26-9.16zm-4.2 3.84c-.23 0-.6.08-.93.38-.32.3-1.22 1.2-1.22 2.9 0 1.7 1.25 3.34 1.43 3.57.18.24 2.42 3.73 5.86 5.08 2.9 1.15 3.5.92 4.13.86.63-.06 2.03-.83 2.32-1.65.29-.82.29-1.52.21-1.65-.08-.14-.32-.23-.67-.4-.35-.16-2.05-1.01-2.37-1.12-.32-.12-.55-.17-.78.17-.23.34-.88 1.11-1.08 1.35-.2.24-.4.27-.74.1-.35-.16-1.46-.54-2.78-1.72-1.02-.9-1.7-1.99-1.9-2.33-.2-.34-.02-.52.15-.69.15-.15.35-.39.52-.58.17-.2.23-.3.35-.5.12-.21.06-.39-.03-.55-.08-.16-.78-1.88-1.08-2.57-.28-.68-.57-.7-.8-.71z" />
      </svg>
      <span className="font-medium text-sm">WhatsApp</span>
    </button>
  );
}
