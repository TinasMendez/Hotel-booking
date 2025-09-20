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
  const [selected, setSelected] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const isLogged = !!getToken();

  useEffect(() => {
    setAverage(Number(initialAverage) || 0);
  }, [initialAverage]);

  useEffect(() => {
    if (!productId) return;
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
      if (!productId) return average;
      const data = await Api.getProductRating(productId);
      const newAverage = Number(data?.rating ?? 0);
      setAverage(newAverage);
      return newAverage;
    } catch (error) {
      console.warn("Failed to refresh rating average", error);
      return average;
    }
  }

  function handleSelect(stars) {
    if (!isLogged) {
      toast?.info(formatMessage({ id: "rating.loginRequired", defaultMessage: "Inicia sesión para puntuar." }));
      return;
    }

    setSelected(stars);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!isLogged) {
      toast?.info(formatMessage({ id: "rating.loginRequired", defaultMessage: "Inicia sesión para puntuar." }));
      return;
    }

    if (!selected) {
      toast?.error(formatMessage({ id: "rating.selectScore", defaultMessage: "Selecciona una puntuación." }));
      return;
    }

    setBusy(true);
    try {
      await Api.rateProduct(productId, selected, comment.trim() || null);
      toast?.success(formatMessage({ id: "rating.success", defaultMessage: "¡Gracias por tu valoración!" }));
      const updatedAverage = await refreshAverage();
      onRated?.({ score: selected, comment, average: updatedAverage });
      setComment("");
      setSelected(0);
    } catch (error) {
      const normalized = normalizeApiError(error, formatMessage({ id: "errors.generic" }));
      const message = getApiErrorMessage(normalized, formatMessage, formatMessage({ id: "errors.generic" }));
      toast?.error(message || formatMessage({ id: "errors.generic" }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className={`space-y-3 ${className}`} onSubmit={handleSubmit}>
      <div
        className="flex items-center gap-1"
        aria-label={formatMessage({ id: "rating.averageLabel", defaultMessage: "Calificación promedio" })}
      >
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover || selected || average) >= n && (hover ? hover >= n : selected ? selected >= n : average >= n);
          return (
            <button
              key={n}
              className="text-2xl leading-none"
              disabled={busy}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleSelect(n)}
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
      <label className="block text-sm text-slate-700">
        <span className="mb-1 block font-medium">
          {formatMessage({ id: "rating.commentLabel", defaultMessage: "Tu reseña" })}
        </span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          disabled={busy || !isLogged}
          placeholder={formatMessage({ id: "rating.commentPlaceholder", defaultMessage: "Comparte tu experiencia..." })}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
          rows={3}
        />
      </label>
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={busy || !isLogged}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {busy
            ? formatMessage({ id: "rating.sending", defaultMessage: "Enviando..." })
            : formatMessage({ id: "rating.submit", defaultMessage: "Enviar reseña" })}
        </button>
      </div>
      {!isLogged && (
        <p className="text-xs text-slate-500">
          {formatMessage({ id: "rating.loginPrompt", defaultMessage: "Inicia sesión para dejar una reseña." })}
        </p>
      )}
    </form>
  );
}
