// /frontend/src/components/FavoriteButton.jsx
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Api, { getToken } from "../services/api";
import { useToast } from "../shared/ToastProvider.jsx";
import { getApiErrorMessage, normalizeApiError } from "../utils/apiError.js";

/** Toggle button to add/remove a product from user's favorites. */
export default function FavoriteButton({ productId, className = "" }) {
    const toast = useToast();
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const [fav, setFav] = useState(false);
    const isLogged = !!getToken();

    useEffect(() => {
        let mounted = true;
        async function load() {
        if (!isLogged) return;
        try {
            const list = await Api.getFavorites();
            if (!mounted) return;
            setFav(list?.some((p) => String(p.id) === String(productId)));
        } catch {
            // ignore
        }
        }
        load();
        return () => {
        mounted = false;
        };
    }, [productId, isLogged]);

    async function toggle() {
        if (!isLogged) {
        toast?.info(formatMessage({ id: "favorites.loginRequired", defaultMessage: "Please log in to use favorites." }));
        return;
        }
        setLoading(true);
        try {
        if (fav) {
            await Api.removeFavorite(productId);
            setFav(false);
            toast?.info(formatMessage({ id: "favorites.removed", defaultMessage: "Removed from favorites." }));
        } else {
            await Api.addFavorite(productId);
            setFav(true);
            toast?.success(formatMessage({ id: "favorites.added", defaultMessage: "Added to favorites." }));
        }
        } catch (e) {
        const normalized = normalizeApiError(e, formatMessage({ id: "errors.generic" }));
        const message = getApiErrorMessage(normalized, formatMessage, e?.message);
        toast?.error(message || formatMessage({ id: "errors.generic" }));
        } finally {
        setLoading(false);
        }
    }

    return (
        <button
        onClick={toggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 border ${fav ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-600 border-rose-600"} ${className}`}
        aria-pressed={fav}
        title={fav ? "Remove from favorites" : "Add to favorites"}
        >
        <span className="text-lg">{fav ? "♥" : "♡"}</span>
        <span className="font-medium">{fav ? "In favorites" : "Add to favorites"}</span>
        </button>
    );
}
