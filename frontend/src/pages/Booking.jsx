import React, { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { fetchProductById, createBooking } from "../services/booking";
import api from "../services/api";

/**
 * Booking page: shows product summary, user info and date range.
 * Submits booking and navigates to a lightweight confirmation inline.
 * Expects auth token present; otherwise router should redirect to login.
 */
export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialFrom = sp.get("from") || "";
  const initialTo = sp.get("to") || "";

  const [product, setProduct] = useState(null);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Example: decode user from token if your app exposes an /auth/me endpoint
  const [me, setMe] = useState(null);

  useEffect(() => {
    let mounted = true;

    // Product
    fetchProductById(id)
      .then((p) => mounted && setProduct(p))
      .catch(() => mounted && setError("Invalid product identifier."));

    // User
    api
      .get("/api/v1/auth/me")
      .then(({ data }) => {
        if (mounted) setMe(data || null);
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const canSubmit = useMemo(
    () => Boolean(product && from && to),
    [product, from, to],
  );

  async function submit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      await createBooking({
        productId: Number(id),
        startDate: from,
        endDate: to,
      });
      navigate(`/booking/${id}/success?from=${from}&to=${to}`, {
        replace: true,
      });
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          "Unable to create booking. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !product) {
    return (
      <main className="wrap">
        <p className="error">
          {error} <Link to="/">Back to home</Link>
        </p>
        <style>{`.wrap{ padding:2rem; } .error{ color:#b91c1c; }`}</style>
      </main>
    );
  }

  if (!product)
    return (
      <main className="wrap">
        <p>Loading…</p>
        <style>{`.wrap{ padding:2rem; }`}</style>
      </main>
    );

  return (
    <main className="wrap">
      <header className="head">
        <h1>Confirm your booking</h1>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Product</h2>
          <div className="prod">
            <img
              src={product.images?.[0] || product.imageUrl}
              alt={product.name}
            />
            <div>
              <b>{product.name}</b>
              <p className="muted">
                {product.description?.slice(0, 120) || "—"}
              </p>
            </div>
          </div>
        </article>

        <article className="card">
          <h2>Your details</h2>
          {me ? (
            <ul className="list">
              <li>
                <span>Name</span>
                <b>
                  {me.firstName} {me.lastName}
                </b>
              </li>
              <li>
                <span>Email</span>
                <b>{me.email}</b>
              </li>
            </ul>
          ) : (
            <p className="muted">Signed in user data not available.</p>
          )}
        </article>

        <article className="card">
          <h2>Dates</h2>
          <div className="dates">
            <label>
              From
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </label>
            <label>
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </label>
          </div>
          <button disabled={!canSubmit || submitting} onClick={submit}>
            {submitting ? "Creating booking…" : "Confirm booking"}
          </button>
          {error && <p className="error">{error}</p>}
          <p className="note">
            You will receive a confirmation email after a successful booking.
          </p>
        </article>
      </section>

      <style>{`
        .wrap{ padding:2rem 1.25rem; max-width: 1000px; margin: 0 auto; }
        .head h1{ margin:0 0 .75rem; }
        .grid{ display:grid; gap:1rem; grid-template-columns: 1fr; }
        .card{ background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:1rem; }
        .prod{ display:flex; gap:.75rem; align-items:flex-start; }
        .prod img{ width:120px; height:90px; object-fit:cover; border-radius:8px; }
        .muted{ color:#6b7280; margin:.25rem 0 0; }
        .list{ list-style:none; padding:0; margin:0; display:grid; gap:.5rem; }
        .list li{ display:flex; justify-content:space-between; }
        .list li span{ color:#6b7280; }
        .dates{ display:grid; gap:.5rem; grid-template-columns: 1fr 1fr; margin-bottom:.75rem; }
        button{ border:1px solid #d1d5db; background:#0ea5e9; color:#fff; padding:.6rem .9rem; border-radius:8px; cursor:pointer; }
        button:disabled{ opacity:.6; cursor:not-allowed; }
        .note{ color:#6b7280; font-size:.9rem; margin:.5rem 0 0; }
        .error{ color:#b91c1c; margin:.5rem 0 0; }
        @media (max-width: 640px){ .dates{ grid-template-columns:1fr; } }
      `}</style>
    </main>
  );
}
