// src/components/Toaster.jsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Global toast emitter. */
export function showToast({ title, description = "", type = "info", duration = 3000 } = {}) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
        new CustomEvent("toast:show", { detail: { title, description, type, duration } })
    );
    }

    /**
     * Toaster rendered in a portal.
     * Position moved to bottom-36 so it stays above the WhatsApp FAB (bottom-24).
     */
    export function Toaster() {
    const [toasts, setToasts] = useState([]);
    const counter = useRef(1);

    useEffect(() => {
        function onShow(e) {
        const id = counter.current++;
        const t = { id, ...e.detail };
        setToasts((prev) => [...prev, t]);
        const ms = Math.max(1200, Number(t.duration) || 3000);
        const timer = setTimeout(() => dismiss(id), ms);
        return () => clearTimeout(timer);
        }
        window.addEventListener("toast:show", onShow);
        return () => window.removeEventListener("toast:show", onShow);
    }, []);

    function dismiss(id) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed right-4 bottom-36 z-[9999] flex flex-col gap-2 w-[min(92vw,360px)] pointer-events-none">
        {toasts.map((t) => {
            const color =
            t.type === "success"
                ? "border-green-500"
                : t.type === "error"
                ? "border-red-500"
                : "border-slate-500";
            const bg =
            t.type === "success"
                ? "bg-green-50"
                : t.type === "error"
                ? "bg-red-50"
                : "bg-white";
            const text =
            t.type === "success"
                ? "text-green-700"
                : t.type === "error"
                ? "text-red-700"
                : "text-slate-700";
            return (
            <div
                key={t.id}
                className={`pointer-events-auto rounded-xl shadow border-l-4 ${color} ${bg} p-3`}
                role="status"
                aria-live="polite"
            >
                <div className="flex items-start gap-3">
                <div className={`text-sm font-medium ${text}`}>{t.title}</div>
                <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="ml-auto text-slate-400 hover:text-slate-600"
                    aria-label="Close notification"
                    title="Close"
                >
                    ×
                </button>
                </div>
                {t.description ? (
                <div className="mt-1 text-xs text-slate-600">{t.description}</div>
                ) : null}
            </div>
            );
        })}
        </div>,
        document.body
    );
}
