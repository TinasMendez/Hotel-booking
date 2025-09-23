// frontend/src/components/ReviewsList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../modules/auth/AuthContext";
import { ReviewsAPI, BookingAPI, getToken } from "../services/api";
import ReviewFormModal from "./ReviewFormModal";

/**
 * Reviews section for a product details page.
 * - Enables button if user is considered authenticated (user OR token)
 * - After creating a review, we store its id in localStorage ("db_last_review_id")
 *   and when rendering the list we overwrite that item's author to the current user.
 */
export default function ReviewsList({ productId }) {
  const { isAuthenticated, user } = useAuth();
  const authed = (isAuthenticated ?? false) || !!user || !!getToken();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState("idle"); // idle|empty|ok|disabled|error
  const [hasBookingForProduct, setHasBookingForProduct] = useState(false);
  const [open, setOpen] = useState(false);

  const requireBooking =
    String(
      import.meta?.env?.VITE_REQUIRE_BOOKING_FOR_REVIEW || "false",
    ).toLowerCase() === "true";

  const userAlreadyReviewed = useMemo(() => {
    if (!user) return false;
    const email = String(user?.email || "").toLowerCase();
    return reviews.some(
      (r) => String(r?.userEmail || "").toLowerCase() === email,
    );
  }, [reviews, user]);

  const canWrite =
    authed &&
    !userAlreadyReviewed &&
    state !== "disabled" &&
    (!requireBooking || hasBookingForProduct);

  function disabledReason() {
    if (state === "disabled") return "Reviews feature is disabled.";
    if (!authed) return "You must be logged in.";
    if (userAlreadyReviewed) return "You already reviewed this product.";
    if (requireBooking && !hasBookingForProduct)
      return "A booking is required to review.";
    return "";
  }

  // Overwrite author locally when the review id == last created id
  function applyLocalAuthorFix(list) {
    let lastId = null;
    try {
      lastId = localStorage.getItem("db_last_review_id");
    } catch (_) {}
    if (!lastId || !user) return list;

    const idNum = Number(lastId);
    return list.map((r) =>
      Number(r?.id) === idNum
        ? {
            ...r,
            userName: user?.fullName || r.userName,
            userEmail: user?.email || r.userEmail,
          }
        : r,
    );
  }

  async function loadReviews() {
    setLoading(true);
    try {
      const list = await ReviewsAPI.listByProduct(productId);
      if (list && list.__disabled) {
        setReviews([]);
        setState("disabled");
      } else {
        const arr = Array.isArray(list) ? applyLocalAuthorFix(list) : [];
        setReviews(arr);
        setState(arr.length ? "ok" : "empty");
      }
    } catch {
      setReviews([]);
      setState("error");
    } finally {
      setLoading(false);
    }
  }

  async function checkBookingsForThisProduct() {
    try {
      if (!authed) {
        setHasBookingForProduct(false);
        return;
      }
      const mine = await BookingAPI.listMine();
      const match = Array.isArray(mine)
        ? mine.some((b) => Number(b?.productId) === Number(productId))
        : false;
      setHasBookingForProduct(match);
    } catch {
      setHasBookingForProduct(false);
    }
  }

  useEffect(() => {
    if (Number.isFinite(Number(productId))) {
      loadReviews();
      checkBookingsForThisProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, authed]);

  // Resolve display name/email for any review (use my name/email for my last created if needed)
  function resolveAuthor(review) {
    return review?.userName || review?.userEmail || "Anonymous";
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reviews</h2>

        <button
          type="button"
          onClick={() => setOpen(true)}
          disabled={!canWrite}
          title={!canWrite ? disabledReason() : "Write a review"}
          className={[
            "rounded-lg border px-3 py-2 text-sm font-medium",
            canWrite
              ? "text-slate-700 border-slate-300 hover:bg-slate-50"
              : "text-slate-400 border-slate-200 cursor-not-allowed",
          ].join(" ")}
        >
          Write a review
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading reviews…</p>
      ) : state === "ok" ? (
        <ul className="space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{resolveAuthor(r)}</div>
                <div className="text-sm" title={`${r.rating} / 5`}>
                  ⭐ {r.rating}
                </div>
              </div>
              {r.comment ? (
                <p className="mt-1 text-sm text-slate-700">{r.comment}</p>
              ) : null}
              {r.createdAt ? (
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : state === "empty" ? (
        <p className="text-sm text-slate-600">No reviews yet.</p>
      ) : state === "disabled" ? (
        <p className="text-sm text-slate-500">Reviews feature is disabled.</p>
      ) : (
        <p className="text-sm text-slate-500">Couldn’t load reviews.</p>
      )}

      <ReviewFormModal
        open={open}
        onClose={() => setOpen(false)}
        productId={Number(productId)}
        onCreated={(created) => {
          setOpen(false);
          // Optimistic: show immediately with my identity
          setReviews((prev) => [created, ...prev]);
          // Re-sync (but keep local author fix on next load)
          loadReviews();
        }}
      />

      {!canWrite &&
      requireBooking &&
      authed &&
      state !== "disabled" &&
      !userAlreadyReviewed ? (
        <p className="text-xs text-slate-500">
          You need at least one booking for this listing to write a review.
        </p>
      ) : null}
    </section>
  );
}
