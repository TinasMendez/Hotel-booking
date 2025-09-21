import React, { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Interactive star rating with eligibility gate (only users who completed a booking).
 * Expected endpoints:
 *  - GET  /api/v1/ratings/eligibility?productId=XX         -> { eligible: boolean }
 *  - POST /api/v1/ratings                                  -> { id, productId, stars, comment, createdAt, user }
 *      body: { productId, stars, comment }
 */
export default function RatingStars({ productId, onSubmitted }) {
  const [eligible, setEligible] = useState(false);
  const [hover, setHover] = useState(0);
  const [value, setValue] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const stars = [1, 2, 3, 4, 5];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/api/v1/ratings/eligibility", { params: { productId } })
      .then(({ data }) => mounted && setEligible(Boolean(data?.eligible)))
      .catch(() => mounted && setEligible(false))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [productId]);

  async function submit() {
    if (!eligible || !value) return;
    setSubmitting(true);
    try {
      await api.post("/api/v1/ratings", { productId, stars: value, comment });
      setValue(0);
      setComment("");
      if (typeof onSubmitted === "function") onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Checking rating eligibility…</p>;
  if (!eligible) return <p>You can rate this product after completing a booking.</p>;

  return (
    <div className="rate">
      <div className="stars" onMouseLeave={() => setHover(0)}>
        {stars.map((n) => (
          <button
            key={n}
            type="button"
            className={`star ${n <= (hover || value) ? "on" : "off"}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => setValue(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
      />
      <button disabled={!value || submitting} onClick={submit}>
        {submitting ? "Submitting…" : "Submit review"}
      </button>

      <style>
        {`
        .rate{ display:grid; gap:.5rem; max-width:520px; }
        .stars{ display:flex; gap:.25rem; }
        .star{ font-size:1.5rem; border:0; background:transparent; cursor:pointer; }
        .star.on{ color:#f59e0b; }
        .star.off{ color:#cbd5e1; }
        textarea{ width:100%; min-height:80px; }
      `}
      </style>
    </div>
  );
}
