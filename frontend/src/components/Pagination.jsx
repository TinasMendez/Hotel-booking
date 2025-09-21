import React from "react";

/**
 * Generic pagination component with page size 10 by default.
 * Keeps logic isolated to avoid coupling with parent state shape.
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

  return (
    <nav aria-label="Products pagination" className="pagination">
      <button onClick={() => goTo(1)} disabled={page === 1}>
        {"<<"}
      </button>
      <button onClick={() => goTo(page - 1)} disabled={page === 1}>
        {"<"}
      </button>
      <span>
        {page} / {totalPages}
      </span>
      <button onClick={() => goTo(page + 1)} disabled={page === totalPages}>
        {">"}
      </button>
      <button onClick={() => goTo(totalPages)} disabled={page === totalPages}>
        {">>"}
      </button>
      <style>
        {`
        .pagination { display:flex; gap:.5rem; align-items:center; justify-content:center; padding:1rem 0; }
        .pagination button { padding:.5rem .75rem; border:1px solid #ddd; background:#fff; cursor:pointer; }
        .pagination button[disabled]{ opacity:.5; cursor:not-allowed; }
      `}
      </style>
    </nav>
  );
}
