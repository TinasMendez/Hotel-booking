import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookingAPI } from '../services/api';
import { useAuth } from '../modules/auth/AuthContext';

/** Normalize various date strings to ISO yyyy-MM-dd for the backend */
function toIsoDate(str) {
  if (!str) return '';
  // Already ISO?
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // dd.MM.yyyy or dd/MM/yyyy or dd-MM-yyyy -> yyyy-MM-dd
  const m = str.match(/^(\d{2})[.\-/](\d{2})[.\-/](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // Fallback: try Date()
  const d = new Date(str);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);
  return '';
}

export default function Booking() {
  const { productId: productIdParam } = useParams();
  const productId = useMemo(() => Number(productIdParam), [productIdParam]);
  const { user } = useAuth();

  // UI labels (puedes luego reemplazar con datos reales del producto)
  const [productName] = useState('Loft Minimalista');
  const [productDescription] = useState('LUMINOSO y cerca del metro');

  // NOTE: algunos navegadores mostrarán dd.MM.yyyy aunque el value sea ISO
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);

  function isRangeValid(s, e) {
    if (!s || !e) return false;
    const sd = new Date(s);
    const ed = new Date(e);
    return !isNaN(sd) && !isNaN(ed) && sd <= ed;
  }

  async function handleCheckAvailability() {
    const isoStart = toIsoDate(startDate);
    const isoEnd = toIsoDate(endDate);

    if (!productId || Number.isNaN(productId)) {
      alert('Missing productId in route.');
      return;
    }
    if (!isRangeValid(isoStart, isoEnd)) {
      alert('Please select a valid date range (start <= end).');
      return;
    }

    setLoading(true);
    setAvailability(null);
    try {
      const res = await BookingAPI.checkAvailability({
        productId: Number(productId),
        startDate: isoStart,
        endDate: isoEnd,
      });
      const available = Boolean(res?.available);
      setAvailability(available);
      alert(
        available
          ? 'Great! The product is available for the selected dates.'
          : 'Sorry, the product is NOT available for the selected dates.'
      );
    } catch (err) {
      const msg = err?.payload?.message || err?.message || 'Unknown error';
      alert(`Availability check failed ❌: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBooking() {
    const isoStart = toIsoDate(startDate);
    const isoEnd = toIsoDate(endDate);

    if (!productId || Number.isNaN(productId)) {
      alert('Missing productId in route.');
      return;
    }
    if (!isRangeValid(isoStart, isoEnd)) {
      alert('Please select a valid date range (start <= end).');
      return;
    }

    const rawCustomerId = user?.customerId ?? user?.id;
    const customerId = rawCustomerId != null ? Number(rawCustomerId) : null;
    if (!customerId || Number.isNaN(customerId)) {
      alert('You must be logged in to book. Please login first.');
      return;
    }

    setLoading(true);
    try {
      // IMPORTANT: send plain JSON with normalized ISO dates and numeric ids
      const payload = {
        productId: Number(productId),
        customerId: Number(customerId),
        startDate: isoStart, // yyyy-MM-dd
        endDate: isoEnd,     // yyyy-MM-dd
      };

      // 👇 útil para verificar en DevTools > Network > Payload
      // console.log('Booking payload:', payload);

      const created = await BookingAPI.createBooking(payload);
      alert(`Booking created ✅ (id: ${created?.id ?? 'n/a'})`);
      // TODO: navigate('/my-bookings')
    } catch (err) {
      const msg =
        err?.payload?.message ||
        err?.message ||
        'Unknown error creating booking';
      alert(`Booking failed ❌: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Booking: {productName}</h1>
        <p className="text-slate-600 mb-6">{productDescription}</p>

        <div className="grid gap-4 max-w-md">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Start date</span>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={toIsoDate(startDate) || ''}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">End date</span>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={toIsoDate(endDate) || ''}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCheckAvailability}
              disabled={loading}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            >
              {loading ? 'Checking…' : 'Check availability'}
            </button>

            <button
              type="button"
              onClick={handleCreateBooking}
              disabled={loading}
              className="bg-emerald-600 text-white rounded-lg px-4 py-2 disabled:opacity-60"
            >
              {loading ? 'Processing…' : 'Confirm booking'}
            </button>
          </div>

          {availability !== null && (
            <div
              className={`text-sm mt-2 ${
                availability ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {availability ? 'Available ✔' : 'Not available ✖'}
            </div>
          )}

          <Link to={`/product/${productId}`} className="underline mt-4">
            Back to product
          </Link>
        </div>
      </div>
    </div>
  );
}
