import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Navigates to booking creation page carrying the selected range.
 * It does NOT go to confirmation; that page expects a bookingId.
 */
export default function ReserveButton({ productId, from, to }) {
    const navigate = useNavigate();
    function go() {
        const qs = new URLSearchParams();
        if (from) qs.set("from", from);
        if (to) qs.set("to", to);
        navigate(`/product/${productId}/book${qs.toString() ? `?${qs}` : ""}`);
    }
    return (
        <button className="reserve" onClick={go}>
        Reserve now
        <style>{`
            .reserve{ border:0; background:#16a34a; color:#fff; padding:.6rem .9rem; border-radius:8px; cursor:pointer; }
        `}</style>
        </button>
    );
}
