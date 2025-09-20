// frontend/src/pages/ProductDetail.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Api from "../services/api.js";
import { getProduct } from "../services/products.js";
import Gallery5 from "../components/Gallery5.jsx";
import ModalGallery from "../components/ModalGallery.jsx";
import FeaturesBlock from "../components/FeaturesBlock.jsx";
import PolicyBlock from "../components/PolicyBlock.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import RatingStars from "../components/RatingStars.jsx";
import ReviewsList from "../components/ReviewsList.jsx";

/** Flattens bookings into ISO date strings to mark busy days in the calendar. */
function buildBusyDates(bookings = []) {
  const busy = new Set();
  for (const b of bookings) {
    const start = new Date(b.startDate || b.checkIn);
    const end = new Date(b.endDate || b.checkOut);
    if (Number.isNaN(+start) || Number.isNaN(+end)) continue;
    const d = new Date(start);
    while (d <= end) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      busy.add(`${y}-${m}-${day}`);
      d.setDate(d.getDate() + 1);
    }
  }
  return Array.from(busy);
}

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selection, setSelection] = useState({ startDate: "", endDate: "" });
  const [reviewsVersion, setReviewsVersion] = useState(0);
  const [ratingStats, setRatingStats] = useState({ average: 0, count: 0 });

  const busyDates = useMemo(() => buildBusyDates(bookings), [bookings]);

  const refreshProduct = useCallback(async () => {
    try {
      const data = await getProduct(productId);
      if (data) setProduct((prev) => ({ ...prev, ...data }));
    } catch {
      /* Silent: keep UX minimal */
    }
  }, [productId]);

  useEffect(() => {
    if (!product) return;
    setRatingStats({
      average: Number(product.ratingAverage || 0),
      count: Number(product.ratingCount || 0),
    });
  }, [product?.ratingAverage, product?.ratingCount]);

  const handleReviewStats = useCallback((stats) => {
    if (!stats) return;
    setRatingStats({
      average: Number(stats.average || 0),
      count: Number(stats.count || 0),
    });
  }, []);

  const handleRated = useCallback((result) => {
    if (result?.average != null) {
      setRatingStats((prev) => ({ ...prev, average: Number(result.average) }));
    }
    setReviewsVersion((version) => version + 1);
  }, []);

  async function fetchBookingsForProduct() {
    setAvailabilityError("");
    try {
      const { data } = await Api.get(`/bookings/product/${productId}`);
      const list = Array.isArray(data) ? data : [];
      setBookings(list);
    } catch {
      setAvailabilityError("Failed to load availability. Please try again.");
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      setLoading(true);
      await refreshProduct();
      await fetchBookingsForProduct();
      if (!cancelled) setLoading(false);
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, [refreshProduct]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-sm text-red-600">Product not found.</p>
        <Link to="/" className="inline-block mt-3 text-sm underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  const imageList =
    Array.isArray(product.imageUrls) && product.imageUrls.length > 0
      ? product.imageUrls
      : product.imageUrl
      ? [product.imageUrl]
      : [];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Title left, back arrow right */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">{product.name}</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
          aria-label="Go back"
          title="Go back"
        >
          <span>Back</span>
          <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>
      </div>

      {/* Rating + favorite */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <RatingStars
            productId={product.id}
            initialAverage={ratingStats.average}
            onRated={handleRated}
          />
          <span className="text-sm text-slate-600">
            {ratingStats.count} {ratingStats.count === 1 ? "reseña" : "reseñas"}
          </span>
        </div>
        <FavoriteButton productId={product.id} />
      </div>

      {/* Gallery */}
      <Gallery5 images={imageList} onViewMore={() => setGalleryOpen(true)} />
      {galleryOpen && (
        <ModalGallery images={imageList} onClose={() => setGalleryOpen(false)} />
      )}

      {/* Description */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Description</h2>
        <p className="text-slate-700">{product.description}</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Reseñas</h2>
        <ReviewsList
          productId={product.id}
          refreshToken={reviewsVersion}
          onStatsChange={handleReviewStats}
        />
      </section>

      {/* Features */}
      {Array.isArray(product?.features) && product.features.length > 0 && (
        <FeaturesBlock features={product.features} />
      )}

      {/* Availability (busy dates highlighted) with retry on error */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Availability</h2>
        {availabilityError ? (
          <div className="text-sm text-red-600">
            {availabilityError}{" "}
            <button className="underline" onClick={fetchBookingsForProduct}>
              Retry
            </button>
          </div>
        ) : (
          <AvailabilityCalendar
            disabledDates={busyDates}
            onChange={(range) => setSelection(range)}
          />
        )}
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          to={`/booking/${product.id}`}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Reserve now
        </Link>
        <ShareButtons product={product} />
      </div>

      {/* Policies */}
      <PolicyBlock />
    </div>
  );
}
