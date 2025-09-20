// src/components/FavoriteButton.jsx
import React, { useEffect, useState } from "react";
import Api from "../services/api";
import { useAuth } from "../modules/auth/AuthContext";

/**
 * Toggle favorite state for a product.
 * - defaultActive=true when rendering inside Favorites page.
 * - Uses project API: POST /favorites/:productId , DELETE /favorites/:productId
 */
export default function FavoriteButton({ productId, defaultActive = false, onChange = () => {} }) {
    const { isAuthenticated } = useAuth();
    const [active, setActive] = useState(!!defaultActive);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setActive(!!defaultActive);
    }, [defaultActive]);

    async function toggle() {
        if (!isAuthenticated) {
        window.alert("Please sign in to use favorites.");
        return;
        }
        if (busy) return;
        setBusy(true);
        try {
        if (active) {
            await Api.removeFavorite(productId);
            setActive(false);
            onChange(false);
        } else {
            await Api.addFavorite(productId);
            setActive(true);
            onChange(true);
        }
        } catch {
        window.alert("Failed to update favorites. Please try again.");
        } finally {
        setBusy(false);
        }
    }

    return (
        <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`px-3 py-1.5 rounded-full border text-sm ${
            active
            ? "bg-red-50 text-red-600 border-red-300"
            : "bg-white text-pink-600 border-pink-300"
        }`}
        title={active ? "Remove from favorites" : "Add to favorites"}
        >
        {active ? "Remove from favorites" : "Add to favorites"}
        </button>
    );
}
