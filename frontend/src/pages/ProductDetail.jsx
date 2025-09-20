// frontend/src/pages/ProductDetail.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import Api from "../services/api.js";
import { getProduct } from "../services/products.js";
import Gallery5 from "../components/Gallery5.jsx";
import ModalGallery from "../components/ModalGallery.jsx";
import FeaturesBlock from "../components/FeaturesBlock.jsx";
import PolicyBlock from "../components/PolicyBlock.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import RatingStars, { RatingStarsInput } from "../components/RatingStars.jsx";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { useToast } from "../shared/ToastProvider.jsx";
import { getApiErrorMessage, normalizeApiError } from "../utils/apiError.js";

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
  const { formatMessage, formatDate } = useIntl();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [availabilityError, setAvailabilityError] = useState("");
  const [loading, setLoading] = useState(true);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selection, setSelection] = useState({ startDate: "", endDate: "" });
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [ratingScore, setRatingScore] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const busyDates = useMemo(() => buildBusyDates(bookings), [bookings]);

  const canRate = useMemo(() => {
    if (!isAuthenticated || !user?.id) return false;
    if (!Array.isArray(bookings) || bookings.length === 0) return false;
    const today = new Date();
    return bookings.some((booking) => {
      if (!booking || Number(booking.customerId) !== Number(user.id)) return false;
      if (booking.status === "CANCELLED") return false;
      const end = new Date(booking.endDate || booking.checkOut);
      return !Number.isNaN(+end) && end < today;
    });
  }, [bookings, isAuthenticated, user?.id]);

  const refreshProduct = useCallback(async () => {
    try {
      const data = await getProduct(productId);
      if (data) {
        setProduct((prev) => ({ ...prev, ...data }));
      }
      return data;
    } catch {
      /* Silent: keep UX minimal */
      return null;
    }
  }, [productId]);

  const dispatchRatingUpdate = useCallback((payload) => {
    if (!payload) return;
    const id = payload.productId;
    if (id === undefined || id === null) return;
    window.dispatchEvent(
      new CustomEvent("product-rating-updated", {
        detail: { ...payload, productId: Number(id) },
      })
    );
  }, []);

  async function fetchReviews() {
    if (!productId) return;
    setReviewsError("");
    setLoadingReviews(true);
    try {
      const data = await Api.listProductRatings(productId);
      const list = Array.isArray(data) ? data : [];
      setReviews(list);
    } catch (error) {
      console.warn("Failed to load ratings", error);
      setReviewsError(formatMessage({ id: "rating.list.error", defaultMessage: "Failed to load reviews." }));
    } finally {
      setLoadingReviews(false);
    }
  }

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
      await fetchReviews();
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

  async function handleSubmitReview(event) {
    event.preventDefault();
    if (!isAuthenticated) {
      toast?.info(formatMessage({ id: "rating.loginRequired", defaultMessage: "Log in to submit a review." }));
      return;
    }
    if (!canRate) {
      toast?.error(
        formatMessage({
          id: "errors.rating.notAllowed",
          defaultMessage: "You need a completed stay before leaving a review.",
        })
      );
      return;
    }
    if (!ratingScore || ratingScore < 1) {
      toast?.error(
        formatMessage({ id: "rating.form.scoreRequired", defaultMessage: "Select a rating before submitting." })
      );
      return;
    }
    if (!comment.trim()) {
      toast?.error(
        formatMessage({ id: "rating.form.commentRequired", defaultMessage: "Write a comment to share your experience." })
      );
      return;
    }

    setSubmitting(true);
    try {
      await Api.rateProduct(product.id, ratingScore, comment.trim());
      toast?.success(
        formatMessage({ id: "rating.success", defaultMessage: "Thanks for sharing your experience!" })
      );
      setComment("");
      setRatingScore(0);
      await fetchReviews();
      const updated = await refreshProduct();
      const nextAverage = Number(updated?.ratingAverage ?? product?.ratingAverage ?? 0);
      const nextCount = Number(updated?.ratingCount ?? product?.ratingCount ?? 0);
      const targetId = product?.id ?? Number(productId);
      dispatchRatingUpdate({ productId: targetId, ratingAverage: nextAverage, ratingCount: nextCount });
    } catch (error) {
      const normalized = normalizeApiError(error, formatMessage({ id: "errors.generic", defaultMessage: "Unexpected error." }));
      const message = getApiErrorMessage(
        normalized,
        formatMessage,
        formatMessage({ id: "errors.generic", defaultMessage: "Unexpected error." })
      );
      toast?.error(message);
    } finally {
      setSubmitting(false);
    }
  }

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
          <RatingStars value={Number(product?.ratingAverage || 0)} />
          <span className="text-sm text-slate-600">
            {Number(product?.ratingAverage || 0).toFixed(1)} / 5
          </span>
          <span className="text-sm text-slate-600">
            {Number(product?.ratingCount || 0)} ratings
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

      {/* Reviews */}
      <section aria-labelledby="product-reviews" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 id="product-reviews" className="text-xl font-semibold text-slate-900">
              {formatMessage({ id: "rating.section.title", defaultMessage: "Guest reviews" })}
            </h2>
            <p className="text-sm text-slate-600">
              {formatMessage({
                id: "rating.section.subtitle",
                defaultMessage: "Read experiences from other guests or leave yours.",
              })}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-3 rounded-xl border p-4 bg-slate-50">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-800">
              {formatMessage({ id: "rating.form.scoreLabel", defaultMessage: "Your rating" })}
            </label>
            <RatingStarsInput
              value={ratingScore}
              onChange={setRatingScore}
              disabled={submitting}
              className="justify-start"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="rating-comment" className="block text-sm font-medium text-slate-800">
              {formatMessage({ id: "rating.form.commentLabel", defaultMessage: "Comment" })}
            </label>
            <textarea
              id="rating-comment"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={formatMessage({
                id: "rating.form.commentPlaceholder",
                defaultMessage: "Tell us about your stay...",
              })}
              disabled={submitting}
            />
          </div>

          {!isAuthenticated && (
            <p className="text-sm text-amber-600">
              {formatMessage({
                id: "rating.loginRequired",
                defaultMessage: "Log in to submit a review.",
              })}
            </p>
          )}
          {isAuthenticated && !canRate && (
            <p className="text-sm text-amber-600">
              {formatMessage({
                id: "errors.rating.notAllowed",
                defaultMessage: "You need a completed stay before leaving a review.",
              })}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting
                ? formatMessage({ id: "rating.form.submitting", defaultMessage: "Sending…" })
                : formatMessage({ id: "rating.form.submit", defaultMessage: "Send review" })}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {loadingReviews && <p className="text-sm text-slate-600">{formatMessage({ id: "rating.list.loading", defaultMessage: "Loading reviews…" })}</p>}
          {reviewsError && <p className="text-sm text-red-600">{reviewsError}</p>}
          {!loadingReviews && !reviewsError && reviews.length === 0 && (
            <p className="text-sm text-slate-600">
              {formatMessage({ id: "rating.section.empty", defaultMessage: "No reviews yet. Be the first to share your stay." })}
            </p>
          )}
          {!loadingReviews && !reviewsError && reviews.length > 0 && (
            <ul className="space-y-3">
              {reviews.map((review) => {
                const authorLabel =
                  review.userId && review.userId === user?.id
                    ? formatMessage({ id: "rating.list.you", defaultMessage: "You" })
                    : formatMessage(
                        { id: "rating.list.guest", defaultMessage: "Guest #{id}" },
                        { id: review.userId ?? "" }
                      );
                const created = review.createdAt ? new Date(review.createdAt) : null;
                const formattedDate = created && !Number.isNaN(+created)
                  ? formatDate(created, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "";
                return (
                  <li key={review.id} className="rounded-xl border p-4 bg-white shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <RatingStars value={Number(review.score || 0)} sizeClass="text-lg" />
                        <span className="text-sm font-medium text-slate-800">{authorLabel}</span>
                      </div>
                      {formattedDate && <span className="text-xs text-slate-500">{formattedDate}</span>}
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-700 whitespace-pre-line">{review.comment}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
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
