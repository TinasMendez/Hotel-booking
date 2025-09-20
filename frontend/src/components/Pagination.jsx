// frontend/src/components/Pagination.jsx
// Reusable pagination component (client-side). Keeps it simple.
import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext, onFirst }) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <div className="rounded-full border bg-white px-2 py-1 shadow-sm flex items-center gap-2">
        <button
          className="btn-muted"
          onClick={onFirst}
          disabled={isFirstPage || typeof onFirst !== "function"}
          aria-label="First page"
          type="button"
        >
          First
        </button>
        <button
          className="btn-muted disabled:opacity-50"
          onClick={onPrev}
          disabled={isFirstPage}
          aria-label="Previous page"
          type="button"
        >
          Previous
        </button>
        <span className="text-sm px-2" aria-live="polite">
          Page {page} / {totalPages}
        </span>
        <button
          className="btn-muted disabled:opacity-50"
          onClick={onNext}
          disabled={isLastPage}
          aria-label="Next page"
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
