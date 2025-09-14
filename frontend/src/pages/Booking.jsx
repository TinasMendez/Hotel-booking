import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookingAPI } from '../services/api'

// NOTE: This page assumes you already navigated here with a route like '/booking/:id' where :id is the product id.
// It provides two date inputs (YYYY-MM-DD), availability check, and final booking creation.
// Replace the mock product data with your real product loader if available in your app state.

export default function Booking() {
  const { id } = useParams() // productId from route
  const productId = useMemo(() => Number(id), [id])

  const [productName] = useState('Loft Minimalista') // Replace with real product data if you fetch it
  const [productDescription] = useState('LUMINOSO y cerca del metro') // Replace with real product data if you fetch it

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [availability, setAvailability] = useState(null)
  const [loading, setLoading] = useState(false)

  // Helper to validate date range
  function isRangeValid() {
    if (!startDate || !endDate) return false
    try {
      const s = new Date(startDate)
      const e = new Date(endDate)
      return !isNaN(s) && !isNaN(e) && s <= e
    } catch {
      return false
    }
  }

  async function handleCheckAvailability() {
    if (!isRangeValid()) {
      alert('Please select a valid date range (start <= end).')
      return
    }
    setLoading(true)
    setAvailability(null)
    try {
      const res = await BookingAPI.checkAvailability({ productId, startDate, endDate })
      // Expecting { available: boolean }
      setAvailability(Boolean(res?.available))
      if (res?.available) {
        alert('Great! The product is available for the selected dates.')
      } else {
        alert('Sorry, the product is NOT available for the selected dates.')
      }
    } catch (err) {
      alert(`Availability check failed ❌: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateBooking() {
    if (!isRangeValid()) {
      alert('Please select a valid date range (start <= end).')
      return
    }
    setLoading(true)
    try {
      // Backend expects: productId, customerId (if your backend sets from JWT, you may omit), startDate, endDate, status optional
      const payload = {
        productId: productId,
        startDate, // format 'YYYY-MM-DD'
        endDate    // format 'YYYY-MM-DD'
      }
      const created = await BookingAPI.createBooking(payload)
      // You can redirect to "My bookings" or show success message
      alert(`Booking created ✅ (id: ${created?.id ?? 'unknown'})`)
    } catch (err) {
      // 401 will appear here if there is no valid JWT stored in localStorage as 'token' or 'jwt'
      alert(`Booking failed ❌: POST /api/bookings failed: ${err.status ?? ''} ${err.message ?? err}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto py-4 px-4 flex items-center justify-between">
          <div className="font-semibold">Digital Booking</div>
          <nav className="flex gap-6">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/login" className="hover:underline">Login</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Booking: {productName}</h1>
        <p className="text-slate-600 mb-6">{productDescription}</p>

        <div className="grid gap-4 max-w-md">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">Start date</span>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-700">End date</span>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCheckAvailability}
              disabled={loading}
              className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 disabled:opacity-60"
            >
              {loading ? 'Checking...' : 'Check availability'}
            </button>

            <button
              onClick={handleCreateBooking}
              disabled={loading || availability === false}
              className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Processing...' : 'Confirm booking'}
            </button>
          </div>

          {availability !== null && (
            <div className={`text-sm ${availability ? 'text-green-700' : 'text-red-700'}`}>
              {availability ? 'Available ✔' : 'Not available ✖'}
            </div>
          )}

          <Link to={`/product/${productId}`} className="underline mt-4">
            Back to product
          </Link>
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto py-6 px-4 text-sm text-slate-500">
          © {new Date().getFullYear()} Digital Booking. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
