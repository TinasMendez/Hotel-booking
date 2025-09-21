import React from "react";

/**
 * Generic pagination component with page size 10 by default.
 * Keeps logic isolated to avoid coupling with parent state shape.
 * Accessibility: buttons are focus-visible with .focus-ring and disabled state styling.
 */
export default function Pagination({
  total = 0,
  page = 1,
  pageSize = 10,
  onChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function goTo(p) {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== page && typeof onChange === "function") onChange(next);
  }

  if (total <= pageSize) return null;

  const btn =
    "px-3 py-1 rounded border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus-ring";

  return (
    <nav aria-label="Products pagination" className="flex items-center justify-center gap-2 py-4">
      <button className={btn} onClick={() => goTo(1)} disabled={page === 1} aria-label="First page">
        {"<<"}
      </button>
      <button className={btn} onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page">
        {"<"}
      </button>
      <span className="text-sm tabular-nums">
        {page} / {totalPages}
      </span>
      <button className={btn} onClick={() => goTo(page + 1)} disabled={page === totalPages} aria-label="Next page">
        {">"}
      </button>
      <button className={btn} onClick={() => goTo(totalPages)} disabled={page === totalPages} aria-label="Last page">
        {">>"}
      </button>
    </nav>
  );
}
