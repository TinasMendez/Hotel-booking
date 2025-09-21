// src/pages/Bookings.jsx
// Lists the authenticated user's bookings and allows cancelling a booking.

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookingAPI } from "../services/api.js";
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
  return <span className={`${base} ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

function EmptyState() {
  return (
    <div className="p-8 text-center border rounded">
      <p className="text-gray-700">You have no bookings yet.</p>
      <p className="text-sm text-gray-500">Find a product and make your first booking!</p>
      <Link to="/" className="inline-block mt-3 px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 focus-ring">
        Browse
      </Link>
    </div>
  );
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
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Error loading bookings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function onCancel(id) {
    setCancelingId(id);
    try {
      await BookingAPI.cancelBooking(id);
      setRows((prev) => prev.map((b) => (b.id === id ? { ...b, status: "CANCELLED" } : b)));
      toast.success("Booking cancelled");
    } catch (e) {
      const msg = e?.response?.data?.message || "Cancel failed";
      toast.error(msg);
    } finally {
      setCancelingId(null);
    }
  }

  if (loading) {
    return <div className="p-6">Loading your bookings...</div>;
  }
  if (!rows.length) {
    return <div className="p-6"><EmptyState /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Bookings</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="space-y-3">
        {rows.map((b) => {
          const from = formatDate(b.startDate);
          const to = formatDate(b.endDate);
          // New flow: go to booking creation prefilled with last range
          const bookAgainHref = `/product/${b.productId}/book${from || to ? `?${new URLSearchParams({ from, to }).toString()}` : ""}`;
          return (
            <div key={b.id} className="rounded border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {b.productName || `Product #${b.productId}`} — <StatusBadge status={b.status} />
                </div>
                <div className="text-sm text-gray-700">
                  {from} → {to}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to={bookAgainHref} className="rounded border px-3 py-1 hover:bg-slate-50 focus-ring">
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

