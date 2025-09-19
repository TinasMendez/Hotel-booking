// /frontend/src/components/RatingStars.jsx
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Api, { getToken } from "../services/api";
import { useToast } from "../shared/ToastProvider.jsx";
import { getApiErrorMessage, normalizeApiError } from "../utils/apiError.js";

/**
 * Interactive 5-star rating component.
 * - Loads product average on mount.
 * - Requires authentication to submit.
 * - Calls onRated callback after a successful submission.
 */
export default function RatingStars({ productId, className = "", initialAverage = 0, onRated }) {
  const { formatMessage } = useIntl();
  const toast = useToast();
  const [average, setAverage] = useState(Number(initialAverage) || 0);
  const [hover, setHover] = useState(0);
  const [busy, setBusy] = useState(false);
  const isLogged = !!getToken();

  useEffect(() => {
    setAverage(Number(initialAverage) || 0);
  }, [initialAverage]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await Api.getProductRating(productId);
        if (!mounted) return;
        setAverage(Number(data?.rating ?? 0));
      } catch (error) {
        // Ignore initial load errors to avoid noisy UI
        console.warn("Failed to load rating average", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [productId]);

  async function refreshAverage() {
    try {
      const data = await Api.getProductRating(productId);
      setAverage(Number(data?.rating ?? 0));
    } catch (error) {
      console.warn("Failed to refresh rating average", error);
    }
  }

  async function rate(stars) {
    if (!isLogged) {
      toast?.info(formatMessage({ id: "rating.loginRequired", defaultMessage: "Inicia sesión para puntuar." }));
      return;
    }

    setBusy(true);
    try {
      await Api.rateProduct(productId, stars);
      toast?.success(formatMessage({ id: "rating.success", defaultMessage: "¡Gracias por tu valoración!" }));
      await refreshAverage();
      onRated?.(stars);
    } catch (error) {
      const normalized = normalizeApiError(error, formatMessage({ id: "errors.generic" }));
      const message = getApiErrorMessage(normalized, formatMessage, formatMessage({ id: "errors.generic" }));
      toast?.error(message || formatMessage({ id: "errors.generic" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={formatMessage({ id: "rating.averageLabel", defaultMessage: "Calificación promedio" })}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = (hover || average) >= n;
        return (
          <button
            key={n}
            className="text-2xl leading-none"
            disabled={busy}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(n)}
            aria-label={formatMessage({ id: "rating.rateStar", defaultMessage: "Puntuar" }) + ` ${n}`}
            title={formatMessage({ id: "rating.rateStar", defaultMessage: "Puntuar" }) + ` ${n}`}
            type="button"
          >
            {filled ? "★" : "☆"}
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">({average.toFixed(1)}/5)</span>
    </div>
  );
}
