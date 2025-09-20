// frontend/src/components/ReviewsList.jsx
import { useEffect, useMemo, useState } from "react";
import { RatingsAPI } from "../services/api";

function formatDate(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(+date)) return "";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.warn("Failed to format review date", error);
    return "";
  }
}

function ReviewItem({ review }) {
  const createdAt = formatDate(review?.createdAt);
  const score = Number(review?.score || 0);
  const safeComment = review?.comment?.trim();
  const userLabel = review?.userName || (review?.userId ? `Usuario #${review.userId}` : "Usuario");

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">{userLabel}</span>
        {createdAt && (
          <time dateTime={review?.createdAt} className="text-xs text-slate-500">
            {createdAt}
          </time>
        )}
      </header>
      <div className="mt-2 flex items-center gap-1 text-lg text-amber-500" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (index < score ? "★" : "☆"))}
      </div>
      <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
        {safeComment || "Sin comentarios."}
      </p>
    </article>
  );
}

export default function ReviewsList({ productId, refreshToken = 0, onStatsChange }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const count = reviews.length;
    const total = reviews.reduce((sum, item) => sum + Number(item?.score || 0), 0);
    const average = count > 0 ? total / count : 0;
    return { count, average };
  }, [reviews]);

  useEffect(() => {
    onStatsChange?.(stats);
  }, [stats, onStatsChange]);

  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    async function fetchReviews() {
      setLoading(true);
      setError("");
      try {
        const data = await RatingsAPI.listByProduct(productId);
        if (cancelled) return;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        if (cancelled) return;
        console.error("Failed to load product reviews", err);
        setError("No se pudieron cargar las reseñas. Inténtalo nuevamente.");
        setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReviews();

    return () => {
      cancelled = true;
    };
  }, [productId, refreshToken]);

  if (loading) {
    return <p className="text-sm text-slate-600">Cargando reseñas…</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-slate-600">Aún no hay reseñas para este producto.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {reviews.map((review) => (
        <ReviewItem key={review.id ?? `${review.userId}-${review.createdAt}`} review={review} />
      ))}
    </div>
  );
}

