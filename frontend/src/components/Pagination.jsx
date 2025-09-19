// frontend/src/components/Pagination.jsx
// Reusable pagination component (client-side). Keeps it simple.

import React from "react";

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  onFirst,
}) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <div className="mt-6 flex items-center gap-2">
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={onFirst}
        disabled={isFirstPage || typeof onFirst !== "function"}
        aria-label="First page"
        type="button"
      >
        First
      </button>
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={onPrev}
        disabled={isFirstPage}
        aria-label="Previous page"
        type="button"
      >
        Previous
      </button>
      <span className="text-sm">
        Page {page} / {totalPages}
      </span>
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={onNext}
        disabled={isLastPage}
        aria-label="Next page"
        type="button"
      >
        Next
      </button>
    </div>
  );
}
