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
import EmptyState from "../components/EmptyState.jsx";

function toISO(d) {
  if (!d) return "";
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  return x.toISOString().slice(0, 10);
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

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);
  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onReserve = () => {
    const from = toISO(range.from);
    const to = toISO(range.to);
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    navigate(`/product/${productId}/book${suffix}`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (notFound) {
    return (
      <div className="p-6">
        <p className="text-red-600">Product not found.</p>
        <Link to="/" className="underline focus-ring rounded">
          Go back to Home
        </Link>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="underline focus-ring rounded">
          Go back to Home
        </Link>
      </div>
    );
  }

  const hasImages = Array.isArray(images) && images.length > 0;

  return (
    <div className="space-y-6">
      {/* HERO: separación del header + contenido en columna, con respiro entre título y back */}
      <div className="bg-slate-50 border-b mt-6 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="min-h-[30px] py-1 flex flex-col items-start justify-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              {product?.name}
            </h1>
            {/* Botón back más pequeño y separado del título */}
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-ring"
              title="Back to home"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
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

        {/* Gallery or graceful empty state */}
        {hasImages ? (
          <>
            <Gallery5 images={images} />
            <ModalGallery images={images} />
          </>
        ) : (
          <div className="card p-6">
            <EmptyState
              title="No images available"
              description="This listing does not include images yet."
              icon={
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-10 w-10"
                >
                  <path
                    fill="currentColor"
                    d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2zm0 12H3V7h18v10zM8.5 12a2.5 2.5 0 115 0a2.5 2.5 0 01-5 0zm7.5 4l-3.5-4.5L10 14l-2-2.5L5 16h11z"
                  />
                </svg>
              }
            />
          </div>
        )}

        {/* Description */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700">
            {product?.description || "No description available."}
          </p>
        </section>

        {/* Features */}
        <section aria-labelledby="features-title">
          <h2 id="features-title" className="text-lg font-semibold mb-2">
            Features
          </h2>
          <FeaturesBlock
            features={product?.features || []}
            renderTitle={false}
          />
        </section>

        {/* Reviews */}
        <section aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="sr-only">
            Reviews
          </h2>
          <ReviewsList productId={productId} />
        </section>

        {/* Availability */}
        <section className="space-y-3" aria-labelledby="availability-title">
          <div className="flex items-center justify-between">
            <h2 id="availability-title" className="text-lg font-semibold">
              Availability
            </h2>
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
              className="h-10 rounded-lg bg-emerald-600 px-4 text-white font-semibold hover:bg-emerald-700 focus-ring"
            >
              Reserve now
            </button>
            <ShareButtons product={product} variant="secondary" />
          </div>
        </section>

        <section aria-labelledby="policies-title">
          <h2 id="policies-title" className="sr-only">
            Policies
          </h2>
          <PolicyBlock policies={product?.policies || []} />
        </section>
      </section>
    </div>
  );
}
