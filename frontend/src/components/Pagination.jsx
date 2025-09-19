// frontend/src/components/Pagination.jsx
// Reusable pagination component (client-side). Keeps it simple.

import React from "react";

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={onPrev}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span className="text-sm">
        Page {page} / {totalPages}
      </span>
      <button
        className="px-3 py-1 rounded border disabled:opacity-50"
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}
