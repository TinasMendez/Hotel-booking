// frontend/src/pages/ProductDetail.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FavoriteButton from "../components/FavoriteButton.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import Gallery5 from "../components/Gallery5.jsx";
import ModalGallery from "../components/ModalGallery.jsx";
import FeaturesBlock from "../components/FeaturesBlock.jsx";
import PolicyBlock from "../components/PolicyBlock.jsx";
import ReviewsList from "../components/ReviewsList.jsx";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";
import { getProduct } from "../services/products.js";
import { BookingAPI } from "../services/api.js";

/* Helper: returns YYYY-MM-DD from Date/string/null */
function toISO(value) {
  if (!value) return "";
  if (typeof value === "string") {
    // If already in YYYY-MM-DD keep as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? "" : value.toISOString().slice(0, 10);
  }
  return "";
}

export default function ProductDetail() {
  const { id: idParam } = useParams();
  const productId = Number(idParam);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState({ from: null, to: null });

  const images = useMemo(() => {
    const raw = product?.images || [];
    return raw.map((it) => (typeof it === "string" ? { url: it } : it));
  }, [product]);

  const fetchProduct = useCallback(async () => {
    if (!Number.isFinite(productId) || productId <= 0) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const p = await getProduct(productId);
      if (!p?.id) {
        setNotFound(true);
        return;
      }
      setProduct(p);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) setNotFound(true);
      else setError(e?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const fetchBookings = useCallback(async () => {
    if (!Number.isFinite(productId) || productId <= 0) return;
    try {
      const data = await BookingAPI.listByProduct(productId);
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  }, [productId]);

  useEffect(() => { fetchProduct(); }, [fetchProduct]);
  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function onReserve() {
    const qs = new URLSearchParams();
    const fromISO = toISO(range.from);
    const toISOv = toISO(range.to);
    if (fromISO) qs.set("from", fromISO);
    if (toISOv) qs.set("to", toISOv);
    navigate(`/product/${productId}/book${qs.toString() ? `?${qs}` : ""}`);
  }

  if (loading) return <div className="p-6">Loading...</div>;

  if (notFound) {
    return (
      <div className="p-6">
        <p className="text-red-600">Product not found.</p>
        <Link to="/" className="underline">Go back to Home</Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="underline">Go back to Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{product?.name}</h1>
          <Link to="/" className="text-sm underline">← Back</Link>
        </div>
      </header>

      <section className="container mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {product?.category?.name} {product?.city ? `• ${product.city}` : ""}
          </div>
          <div className="flex items-center gap-3">
            <FavoriteButton productId={productId} />
            <ShareButtons product={product} />
          </div>
        </div>

        <Gallery5 images={images} />
        <ModalGallery images={images} />

        {/* Main content stacked */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">{product?.description || "No description available."}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Features</h2>
          {/* Avoid duplicate title inside the block */}
          <FeaturesBlock features={product?.features || []} renderTitle={false} />
        </section>

        <section>
          <ReviewsList productId={productId} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Availability</h2>
            <span className="text-sm text-gray-500">
              Existing bookings: {bookings.length}
            </span>
          </div>
          <AvailabilityCalendar
            bookings={bookings}
            value={range}
            onChange={setRange}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onReserve}
              className="h-10 rounded-lg bg-emerald-600 px-4 text-white font-semibold hover:bg-emerald-700"
            >
              Reserve now
            </button>
            <ShareButtons product={product} variant="secondary" />
          </div>
        </section>

        <section>
          <PolicyBlock policies={product?.policies || []} />
        </section>
      </section>
    </div>
  );
}

