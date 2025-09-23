// frontend/src/components/ReviewFormModal.jsx
import React, { useState } from "react";
import { ReviewsAPI } from "../services/api";
import { useAuth } from "../modules/auth/AuthContext";

/**
 * Simple modal to submit a new product review.
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - productId: number
 * - onCreated: (createdReview) => void
 */
export default function ReviewFormModal({
  open,
  onClose,
  productId,
  onCreated,
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Create on the server
      const created = await ReviewsAPI.create({
        productId,
        rating: Number(rating),
        comment: comment.trim() || null,
      });

      // Persist the last created review id locally so we can correct author display
      if (created && created.id != null) {
        try {
          localStorage.setItem("db_last_review_id", String(created.id));
        } catch (_) {}
      }

      // Build a client-side enhanced object with my identity (for instant UI correctness)
      const enhanced = {
        ...created,
        userName: created?.userName || user?.fullName || null,
        userEmail: created?.userEmail || user?.email || null,
      };

      onCreated?.(enhanced);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : "") ||
        err?.message ||
        "Failed to submit review";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center bg-black/30">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Write a review</h3>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 text-xl leading-none px-2"
            onClick={onClose}
            title="Close"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">
              Rating
            </span>
            <select
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} –{" "}
                  {n === 5
                    ? "Excellent"
                    : n === 4
                      ? "Good"
                      : n === 3
                        ? "Average"
                        : n === 2
                          ? "Poor"
                          : "Terrible"}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-medium text-slate-700">
              Comment (optional)
            </span>
            <textarea
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring min-h-[90px]"
              placeholder="Share details that might help other guests…"
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-slate-900 text-white px-3 py-2 text-sm disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
