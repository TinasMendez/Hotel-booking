// src/pages/BookingConfirmation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BookingAPI } from "/src/services/api.js";
import { getProduct } from "../services/products";
import { useAuth } from "../modules/auth/AuthContext.jsx";

const FALLBACK_IMAGE = "https://via.placeholder.com/960x540?text=No+image";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function BookingConfirmation() {
  const { bookingId: bookingIdParam } = useParams();
  const bookingId = Number(bookingIdParam);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [booking, setBooking] = useState(location.state?.booking ?? null);
  const [product, setProduct] = useState(location.state?.product ?? null);
  const [selection, setSelection] = useState(location.state?.selection ?? null);
  const [loading, setLoading] = useState(!(location.state?.booking && location.state?.product));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(bookingId)) return;
    if (booking && product && selection) return;

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        let bookingDto = booking;
        if (!bookingDto) {
          bookingDto = await BookingAPI.getById(bookingId);
          if (cancelled) return;
          setBooking(bookingDto);
        }

        if (!selection && bookingDto) {
          setSelection({ startDate: bookingDto.startDate, endDate: bookingDto.endDate });
        }

        if (!product && bookingDto) {
          const productDto = await getProduct(bookingDto.productId);
          if (cancelled) return;
          setProduct(productDto);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load booking information.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId, booking, product, selection]);

  const cover = useMemo(() => {
    if (!product) return FALLBACK_IMAGE;
    if (product.imageUrl) return product.imageUrl;
    if (Array.isArray(product.imageUrls) && product.imageUrls.length) return product.imageUrls[0];
    return FALLBACK_IMAGE;
  }, [product]);

  if (!Number.isFinite(bookingId)) {
    return (
      <div className="p-6 text-red-600">
        <p>Invalid booking identifier.</p>
        <Link to="/" className="underline text-blue-600">Back to home</Link>
      </div>
    );
  }

  const snapshot = location.state?.userSnapshot ?? null;
  const guestFirstName = user?.firstName ?? snapshot?.firstName ?? "";
  const guestLastName = user?.lastName ?? snapshot?.lastName ?? "";
  const guestEmail = user?.email ?? snapshot?.email ?? booking?.userEmail ?? "";
  const guestDisplayName = (guestFirstName || guestLastName)
    ? `${guestFirstName} ${guestLastName}`.trim()
    : guestEmail || "—";

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="text-blue-600 underline">Home</Link>
          <span className="text-gray-400">/</span>
          <Link to="/bookings" className="text-blue-600 underline">My bookings</Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Confirmation</span>
        </div>

        {loading && <p className="text-gray-600">Preparing your reservation details…</p>}

        {error && (
          <div className="p-4 rounded bg-red-100 text-red-700 space-y-3">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="underline text-red-700"
            >
              Go to My bookings
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <img src={cover} alt={product?.name || "Product"} className="w-full h-64 object-cover" />
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="text-2xl font-semibold text-gray-900">#{bookingId}</p>
                <p className="text-sm text-gray-600 mt-1">Status: {booking?.status ?? "CONFIRMED"}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">Stay details</h2>
                  <p className="text-gray-700">
                    {product?.name ?? "Product"}
                  </p>
                  <p className="text-gray-600">
                    {formatDate(selection?.startDate)} → {formatDate(selection?.endDate)}
                  </p>
                  <Link
                    to={`/product/${product?.id ?? booking?.productId ?? ""}`}
                    className="text-sm text-blue-600 underline"
                  >
                    View property
                  </Link>
                </div>
                <div className="space-y-3">
                  <h2 className="text-lg font-semibold text-gray-900">Guest</h2>
                  <p className="text-gray-700">{guestDisplayName}</p>
                  <p className="text-gray-600">{guestEmail || "—"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/bookings"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
                >
                  Go to My bookings
                </Link>
                <Link
                  to={`/product/${product?.id ?? booking?.productId ?? ""}`}
                  className="px-4 py-2 rounded-xl border border-gray-300"
                >
                  Back to property
                </Link>
              </div>

              <p className="text-xs text-gray-500">
                We have sent a confirmation email with all the reservation details. If you need to make changes,
                head over to “My bookings”.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
