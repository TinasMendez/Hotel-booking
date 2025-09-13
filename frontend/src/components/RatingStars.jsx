// /frontend/src/components/RatingStars.jsx
import { useEffect, useState } from "react";
import Api, { getToken } from "../services/api";

/** Simple 5-star rating component that loads current rating and allows submitting. */
export default function RatingStars({ productId, className = "" }) {
  const [value, setValue] = useState(0);   // average or user rating depending on your backend
    const [hover, setHover] = useState(0);
    const [busy, setBusy] = useState(false);
    const isLogged = !!getToken();

    useEffect(() => {
        let mounted = true;
        (async () => {
        try {
            const data = await Api.getProductRating(productId);
            if (!mounted) return;
            setValue(Number(data?.rating ?? 0));
        } catch {
            // silent
        }
        })();
        return () => { mounted = false; };
    }, [productId]);

    async function rate(stars) {
        if (!isLogged) {
        alert("Please log in to rate.");
        return;
        }
        setBusy(true);
        try {
        await Api.rateProduct(productId, stars);
        setValue(stars);
        } catch (e) {
        alert(`Rating error: ${e.message}`);
        } finally {
        setBusy(false);
        }
    }

    return (
        <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover || value) >= n;
            return (
            <button
                key={n}
                className="text-2xl leading-none"
                disabled={busy}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => rate(n)}
                aria-label={`Rate ${n} ${n === 1 ? "star" : "stars"}`}
                title={`Rate ${n}`}
            >
                {filled ? "★" : "☆"}
            </button>
            );
        })}
        <span className="ml-2 text-sm text-gray-600">({value}/5)</span>
        </div>
    );
}
