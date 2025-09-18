// src/pages/Booking.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookingAPI } from "/src/services/api.js";
import { getProduct } from "../services/products";
import { useAuth } from "../modules/auth/AuthContext.jsx";

const FALLBACK_IMAGE = "https://via.placeholder.com/960x540?text=No+image";

function toIsoDate(str) {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
  } catch {
    return `$${value}`;
  }
}

function computeNights(start, end) {
  if (!start || !end) return 0;
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  const diff = Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  return diff < 0 ? 0 : diff + 1; // inclusive nights to match backend blocking
}

export default function Booking() {
  const { productId: productIdParam } = useParams();
  const productId = Number(productIdParam);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availability, setAvailability] = useState(null);
  const [checking, setChecking] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setProductError("Invalid product identifier.");
      setLoadingProduct(false);
      return;
    }

    let cancelled = false;
    async function loadProduct() {
      setLoadingProduct(true);
      setProductError("");
      try {
        const data = await getProduct(productId);
        if (!cancelled) setProduct(data);
      } catch (error) {
        if (!cancelled) setProductError(error?.message || "Failed to load product.");
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    }

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const coverImage = useMemo(() => {
    if (!product) return FALLBACK_IMAGE;
    if (product.imageUrl) return product.imageUrl;
    if (Array.isArray(product.imageUrls) && product.imageUrls.length) return product.imageUrls[0];
    return FALLBACK_IMAGE;
  }, [product]);

  const selectionValid = startDate && endDate;
  const nights = useMemo(() => computeNights(startDate, endDate), [startDate, endDate]);
  const nightlyRate = product?.price ?? null;

  async function handleCheckAvailability() {
    if (!Number.isFinite(productId)) return;
    const isoStart = toIsoDate(startDate);
    const isoEnd = toIsoDate(endDate);
    if (!isoStart || !isoEnd) {
      setBookingError("Please pick both start and end dates.");
      return;
    }
    try {
      setChecking(true);
      setBookingError("");
      const res = await BookingAPI.checkAvailability({
        productId,
        startDate: isoStart,
        endDate: isoEnd,
      });
      setAvailability(Boolean(res?.available));
    } catch (error) {
      setAvailability(null);
      setBookingError(error?.message || "Could not verify availability.");
    } finally {
      setChecking(false);
    }
  }

  async function handleConfirmBooking() {
    if (!Number.isFinite(productId)) return;
    const isoStart = toIsoDate(startDate);
    const isoEnd = toIsoDate(endDate);
    if (!isoStart || !isoEnd) {
      setBookingError("Please pick both start and end dates.");
      return;
    }
    try {
      setProcessing(true);
      setBookingError("");
     const booking = await BookingAPI.createBooking({
        productId,
        startDate: isoStart,
        endDate: isoEnd,
      });
      const bookingId = booking?.id;
      if (!bookingId) {
        setBookingError("Booking was created but the confirmation could not be loaded. Please check My bookings.");
        navigate("/bookings");
        return;
      }
      navigate(`/booking/confirmation/${bookingId}`, {
        replace: true,
        state: {
          booking,
          product,
          selection: { startDate: isoStart, endDate: isoEnd },
          userSnapshot: user ? {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          } : null,
        },
      });
    } catch (error) {
      setBookingError(error?.message || "Failed to create booking.");
    } finally {
      setProcessing(false);
    }
  }

  if (!Number.isFinite(productId)) {
    return (
      <div className="p-6 text-red-600">
        <p>Invalid product identifier. Please return to the catalog.</p>
        <Link to="/" className="underline text-blue-600">Back to home</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center gap-3 text-sm">
          <Link to={`/product/${productId}`} className="text-blue-600 underline">
            ← Back to product
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Booking</span>
        </div>

        {loadingProduct && <p className="text-gray-600">Loading product details…</p>}
        {productError && (
          <div className="p-4 rounded bg-red-100 text-red-700">
            {productError}
          </div>
        )}

        {!loadingProduct && !productError && product && (
          <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
            <section className="space-y-6">
              <div className="bg-white rounded-2xl shadow overflow-hidden">
                <img src={coverImage} alt={product.name} className="w-full h-64 object-cover" />
                <div className="p-6 space-y-3">
                  <h1 className="text-2xl font-semibold">{product.name}</h1>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-900 font-medium">Rate: {formatCurrency(nightlyRate)}</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 space-y-4">
                <h2 className="text-xl font-semibold">Select your stay</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-600">Check-in</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-gray-600">Check-out</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="rounded-xl border border-gray-200 px-3 py-2"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCheckAvailability}
                    disabled={checking}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white disabled:opacity-60"
                  >
                    {checking ? "Checking…" : "Check availability"}
                  </button>
                  {availability === true && (
                    <span className="text-sm text-emerald-600">Dates available ✔</span>
                  )}
                  {availability === false && (
                    <span className="text-sm text-red-600">Selected dates are not available</span>
                  )}
                </div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Reservation summary</h2>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Guest</p>
                <p className="font-medium text-gray-900">
                  {user?.firstName || user?.lastName ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim() : user?.email}
                </p>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Stay</p>
                <p className="text-gray-700">{formatDate(startDate)} → {formatDate(endDate)}</p>
                <p className="text-gray-500">{nights > 0 ? `${nights} night${nights === 1 ? "" : "s"}` : "Select your dates"}</p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-500">Product</p>
                <p className="text-gray-700">ID {product.id}</p>
              </div>

              {bookingError && (
                <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
                  {bookingError}
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={processing || !selectionValid}
                className="w-full px-4 py-2 rounded-xl bg-emerald-600 text-white disabled:opacity-60"
              >
                {processing ? "Processing…" : "Confirm booking"}
              </button>

              <p className="text-xs text-gray-500">
                We will block the selected dates and send a confirmation email once the booking is completed.
              </p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
