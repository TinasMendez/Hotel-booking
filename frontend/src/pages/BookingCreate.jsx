import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { BookingAPI } from "/src/services/api.js"; // aligns with your existing API
import { getProduct } from "../services/products";

/**
 * BookingCreate:
 * - Loads product by :id (productId)
 * - Shows a minimal form with date range (pre-filled from query if present)
 * - POSTs a new booking via BookingAPI.create (added below if missing)
 * - Redirects to /booking/:bookingId (BookingConfirmation) with useful state
 */
export default function BookingCreate() {
  const { id: productIdParam } = useParams();
  const productId = Number(productIdParam);
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [from, setFrom] = useState(sp.get("from") || "");
  const [to, setTo] = useState(sp.get("to") || "");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const p = await getProduct(productId);
        if (!cancelled) setProduct(p);
      } catch (e) {
        if (!cancelled)
          setError("Invalid product identifier. Please return to the catalog.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (Number.isFinite(productId)) load();
    else {
      setError("Invalid product identifier. Please return to the catalog.");
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const canSubmit = useMemo(
    () => Boolean(product && from && to),
    [product, from, to],
  );

  async function create() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      // Ensure your BookingAPI.create returns the created booking with an id
      const booking = await BookingAPI.create({
        productId,
        startDate: from,
        endDate: to,
      });

      // Build navigation state for BookingConfirmation convenience (already supported in your file)
      const state = {
        booking,
        product,
        selection: { startDate: from, endDate: to },
        userSnapshot: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        },
      };

      navigate(`/booking/${booking.id}`, { replace: true, state });
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Unable to create booking. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (error && !product) {
    return (
      <div className="p-6 text-red-600">
        <p>{error}</p>
        <Link to="/" className="underline text-blue-600">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <main className="wrap">
      <header className="head">
        <h1>Confirm your booking</h1>
      </header>

      <section className="grid">
        <article className="card">
          <h2>Property</h2>
          <div className="prod">
            <img
              src={product?.imageUrl || product?.imageUrls?.[0]}
              alt={product?.name}
            />
            <div>
              <b>{product?.name}</b>
              <p className="muted">
                {product?.description?.slice(0, 120) || "—"}
              </p>
              <Link to={`/product/${product?.id}`} className="link">
                View property
              </Link>
            </div>
          </div>
        </article>

        <article className="card">
          <h2>Guest</h2>
          <ul className="list">
            <li>
              <span>Name</span>
              <b>{(user?.firstName || "") + " " + (user?.lastName || "")}</b>
            </li>
            <li>
              <span>Email</span>
              <b>{user?.email || "—"}</b>
            </li>
          </ul>
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
          <button disabled={!canSubmit || submitting} onClick={create}>
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
            .muted{ color:#6b7280; margin:.25rem 0 .25rem; }
            .link{ color:#2563eb; text-decoration:underline; font-size:.9rem; }
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
