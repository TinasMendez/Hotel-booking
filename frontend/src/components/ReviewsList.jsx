import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

/**
 * Reviews list with dynamic average. Refetches after submission via onRefresh callback.
 * Expected endpoints:
 *  - GET /api/v1/ratings/product/{productId} -> [{ stars, comment, createdAt, user:{ name } }]
 */
export default function ReviewsList({ productId, refreshTrigger = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get(`/api/v1/ratings/product/${productId}`)
      .then(({ data }) => mounted && setItems(Array.isArray(data) ? data : []))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [productId, refreshTrigger]);

  const avg = useMemo(() => {
    if (!items.length) return 0;
    return Math.round((items.reduce((a, b) => a + Number(b.stars || 0), 0) / items.length) * 10) / 10;
  }, [items]);

  return (
    <section className="reviews">
      <header className="head">
        <h3>Reviews</h3>
        <span className="avg" aria-label={`Average ${avg} out of 5`}>
          ★ {avg} <small>({items.length})</small>
        </span>
      </header>

      {loading && <p>Loading reviews…</p>}
      {!loading && items.length === 0 && <p>No reviews yet.</p>}

      <ul className="list">
        {items.map((r, i) => (
          <li key={i} className="row">
            <div className="meta">
              <b>{r.user?.name || "User"}</b>
              <time dateTime={r.createdAt}>{formatDate(r.createdAt)}</time>
            </div>
            <div className="stars">{renderStars(r.stars)}</div>
            {r.comment && <p className="comment">{r.comment}</p>}
          </li>
        ))}
      </ul>

      <style>
        {`
        .head{ display:flex; align-items:center; justify-content:space-between; }
        .avg{ font-weight:600; }
        .list{ list-style:none; padding:0; margin:.5rem 0 0; display:grid; gap:.75rem; }
        .row{ border:1px solid #eee; border-radius:10px; padding:.75rem; background:#fff; }
        .meta{ display:flex; gap:.5rem; align-items:center; color:#6b7280; }
        .stars{ color:#f59e0b; }
        .comment{ margin:.25rem 0 0; }
      `}
      </style>
    </section>
  );
}

function renderStars(n = 0) {
  const full = Math.max(0, Math.min(5, Number(n)));
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString();
}
