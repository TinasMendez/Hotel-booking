// /frontend/src/pages/Booking.jsx
// Booking page: loads the product by :productId and shows a minimal booking shell.
// Later you can wire dates, policies, rating, etc.

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { httpGet, httpPost } from "../api/http";

export default function Booking() {
  const { productId } = useParams(); // MUST match route
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const item = await httpGet(`/products/${productId}`).catch(() =>
          httpGet(`/api/products/${productId}`)
        );
        if (!alive) return;
        setProduct(item?.data ?? item);
      } catch (e) {
        if (!alive) return;
        setErr(e?.response?.data?.message || e?.message || "Product not found");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [productId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  async function handleCreateBooking(e) {
    e.preventDefault();
    try {
      // TODO: use real payload (dates, user, etc.)
      // This is a placeholder so you can verify 201/200 from backend right away.
      await httpPost("/bookings", {
        productId: Number(productId),
        startDate: "2025-09-16",
        endDate: "2025-09-17",
      }).catch(() =>
        httpPost("/api/bookings", {
          productId: Number(productId),
          startDate: "2025-09-16",
          endDate: "2025-09-17",
        })
      );
      alert("Booking created (mock payload) ✅");
    } catch (e) {
      alert(
        `Booking failed ❌: ${e?.response?.data?.message || e?.message || "Unknown error"}`
      );
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Booking: {product.name}</h1>
      <p className="text-gray-700">{product.description}</p>

      <form className="space-y-3" onSubmit={handleCreateBooking}>
        {/* Replace with your real form controls */}
        <button className="px-4 py-2 rounded bg-blue-600 text-white">
          Confirm booking (mock)
        </button>
      </form>

      <Link to={`/product/${productId}`} className="inline-block mt-2 underline">
        Back to product
      </Link>
    </div>
  );
}
