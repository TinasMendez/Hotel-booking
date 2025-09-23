// src/pages/Bookings.jsx
// Lists the authenticated user's bookings and allows cancelling a booking.
// Shows the real product name (enriches if backend didn't include it).

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookingAPI } from "../services/api.js";
import Api from "../services/api.js"; // fallback for product fetch
import { getProduct } from "../services/products.js"; // primary product helper
import { useToast } from "../shared/ToastProvider.jsx";

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toISOString().slice(0, 10);
  } catch {
    return String(d);
  }
}

function StatusBadge({ status }) {
  const base = "inline-block px-2 py-1 rounded text-xs font-semibold";
  const map = {
    CONFIRMED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    PENDING: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`${base} ${map[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

/** Fetch missing product names (and cache during the session). */
async function enrichProductNames(rows) {
  // Build set of productIds that are missing names
  const missingIds = Array.from(
    new Set(
      rows
        .filter((b) => !b.productName && (b.productId || b.product?.id))
        .map((b) => Number(b.productId || b.product?.id))
        .filter((n) => Number.isFinite(n) && n > 0)
    )
  );

  if (missingIds.length === 0) return rows;

  // Local in-memory cache to avoid duplicate fetches within this call
  const cache = new Map();

  // Fetch each missing product
  await Promise.all(
    missingIds.map(async (id) => {
      try {
        // Prefer the typed helper if available
        const p = (await getProduct(id)) || null;
        if (p?.name) cache.set(id, p.name);
        else throw new Error("no name");
      } catch {
        // Fallback to raw GET
        try {
          const res = await Api.get(`/products/${id}`);
          const name =
            res?.data?.name ||
            res?.data?.title ||
            res?.data?.productName ||
            null;
          if (name) cache.set(id, name);
        } catch {
          // keep missing — we'll render a readable fallback below
        }
      }
    })
  );

  // Return new array with names patched when found
  return rows.map((b) => {
    const id = Number(b.productId || b.product?.id);
    const nameFromCache = cache.get(id);
    if (nameFromCache) {
      return { ...b, productName: nameFromCache };
    }
    return b;
  });
}

export default function Bookings() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await BookingAPI.listMine();
      const base = Array.isArray(data) ? data : [];
      const withNames = await enrichProductNames(base);
      setRows(withNames);
    } catch (e) {
      setError(
        e?.response?.data?.message || e?.message || "Error loading bookings"
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onCancel(id) {
    setCancelingId(id);
    try {
      await BookingAPI.cancelBooking(id);
      setRows((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b))
      );
      toast?.success?.("Booking cancelled");
    } catch (e) {
      const msg = e?.response?.data?.message || "Cancel failed";
      toast?.error?.(msg);
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) {
    return <div className="p-6">Loading your bookings...</div>;
  }

  if (!rows.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="rounded-2xl border border-dashed p-10 text-center">
          <h2 className="text-lg font-semibold">No bookings yet</h2>
          <p className="mt-1 text-slate-600">
            Find a property and make your first booking.
          </p>
          <div className="mt-3">
            <Link to="/" className="btn-primary focus-ring">
              Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="space-y-3">
        {rows.map((b) => {
          const from = formatDate(b.startDate);
          const to = formatDate(b.endDate);

          // Prefer enriched/received productName; fallback to a readable label
          const productLabel =
            b.productName ||
            b.product?.name ||
            (b.productId ? `Product #${b.productId}` : "Product");

          // Shortcut to rebook with last range
          const bookAgainHref = `/product/${b.productId}/book${
            from || to
              ? `?${new URLSearchParams({ from, to }).toString()}`
              : ""
          }`;

          return (
            <div
              key={b.id}
              className="rounded-xl border p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-slate-900">
                  {productLabel} — <StatusBadge status={b.status} />
                </div>
                <div className="text-sm text-slate-700">{from} → {to}</div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={bookAgainHref}
                  className="rounded border px-3 py-1 hover:bg-slate-50 focus-ring"
                >
                  Book again
                </Link>
                <button
                  className="rounded bg-red-600 text-white px-3 py-1 hover:bg-red-700 disabled:opacity-60 focus-ring"
                  disabled={b.status === "CANCELLED" || cancelingId === b.id}
                  onClick={() => onCancel(b.id)}
                >
                  {cancelingId === b.id ? "Cancelling..." : "Cancel"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
