import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";

/**
 * Minimal toast system without external deps.
 * - Call toast.success("...") / toast.error("...") / toast.info("...").
 * - Auto hides after 3 seconds.
 */
const ToastContext = createContext(null);

let idSeq = 1;

export function ToastProvider({ children }) {
    const [items, setItems] = useState([]);

    const remove = useCallback((id) => {
        setItems((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const push = useCallback((type, message) => {
        const id = idSeq++;
        setItems((prev) => [...prev, { id, type, message }]);
        // Auto-dismiss
        setTimeout(() => remove(id), 3000);
    }, [remove]);

    const api = useMemo(() => ({
        success: (m) => push("success", m),
        error: (m) => push("error", m),
        info: (m) => push("info", m),
    }), [push]);

    return (
        <ToastContext.Provider value={api}>
        {children}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
            {items.map(t => (
            <div
                key={t.id}
                className={`px-4 py-2 rounded-md shadow ${
                t.type === "success" ? "bg-green-600 text-white"
                    : t.type === "error" ? "bg-red-600 text-white"
                    : "bg-gray-800 text-white"
                }`}
                role="alert"
            >
                {t.message}
            </div>
            ))}
        </div>
        </ToastContext.Provider>
    );
    }

    export function useToast() {
    return useContext(ToastContext);
}
