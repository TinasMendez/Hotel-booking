import React, { useState } from "react";

/**
 * Floating WhatsApp button (bottom-right). Meets Sprint 4 HU#34.
 * Env required:
 *  - VITE_WHATSAPP_PHONE (E.164: +573001234567)
 *  - VITE_WHATSAPP_DEFAULT_MSG (optional)
 */
export default function FloatingWhatsAppButton() {
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);

  const phone = import.meta.env.VITE_WHATSAPP_PHONE || "";
  const defaultMsg =
    import.meta.env.VITE_WHATSAPP_DEFAULT_MSG ||
    "Hello! I have a question about a product.";

  async function openChat() {
    try {
      if (!/^\+?\d{8,15}$/.test(phone)) {
        throw new Error("Invalid WhatsApp phone number.");
      }
      const url = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(
        defaultMsg
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
      setOk(true);
      setErr("");
      setTimeout(() => setOk(false), 2500);
    } catch (e) {
      setErr(e.message || "Unable to open WhatsApp.");
      setOk(false);
      setTimeout(() => setErr(""), 3000);
    }
  }

  return (
    <>
      <button className="wa" onClick={openChat} aria-label="Open WhatsApp chat">
        🟢
      </button>
      {ok && <div className="toast ok">Message window opened.</div>}
      {err && <div className="toast err">{err}</div>}

      <style>
        {`
        .wa{
          position:fixed; right:16px; bottom:16px; width:56px; height:56px; border-radius:50%;
          border:0; background:#25D366; font-size:1.5rem; cursor:pointer; box-shadow:0 6px 18px rgba(0,0,0,.2);
          display:flex; align-items:center; justify-content:center; color:#fff; z-index:1000;
        }
        .toast{
          position:fixed; right:16px; bottom:84px; background:#111; color:#fff; padding:.5rem .75rem;
          border-radius:6px; box-shadow:0 6px 18px rgba(0,0,0,.2); z-index:1000;
        }
        .toast.ok{ background:#1f7a1f; }
        .toast.err{ background:#a11; }
      `}
      </style>
    </>
  );
}

