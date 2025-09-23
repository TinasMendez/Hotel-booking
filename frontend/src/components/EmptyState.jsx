// src/components/EmptyState.jsx
import React from "react";

/**
 * Generic empty-state component for lists/grids with optional actions.
 * - Use to show an informative message when data is empty.
 */
export default function EmptyState({
  title = "Nothing here yet",
  description = "Try adjusting your filters or come back later.",
  action,
  icon = null,
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-slate-300 bg-white p-8">
      {icon ? (
        <div className="mb-3 text-emerald-600" aria-hidden="true">
          {icon}
        </div>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-10 w-10 mb-3 text-emerald-600"
        >
          <path
            fill="currentColor"
            d="M3 6a3 3 0 013-3h9l6 6v9a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm12-1.5V9h4.5L15 4.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2z"
          />
        </svg>
      )}
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-prose text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
