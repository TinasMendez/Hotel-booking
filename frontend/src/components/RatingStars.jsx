// src/components/RatingStars.jsx
import React from "react";

/**
 * Visual star rating with optional count.
 * - Pure presentational. Accessible label announces "X out of Y".
 */
export default function RatingStars({
  value = 0,
  max = 5,
  count = null,
  size = "sm",
  className = "",
  showLabel = false,
}) {
  const v = Math.max(0, Math.min(Number(value) || 0, max));
  const pct = (v / max) * 100;

  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const dim = sizeMap[size] ?? sizeMap.sm;

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="img"
      aria-label={`${v.toFixed(1)} out of ${max}${count != null ? ` from ${count} reviews` : ""}`}
    >
      <div className="relative inline-flex">
        {/* Empty stars row */}
        <div className="flex">
          {Array.from({ length: max }).map((_, i) => (
            <Star key={`e-${i}`} className={`${dim} text-slate-300`} />
          ))}
        </div>
        {/* Filled stars overlay, clipped by width */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="flex">
            {Array.from({ length: max }).map((_, i) => (
              <Star key={`f-${i}`} className={`${dim} text-amber-500`} />
            ))}
          </div>
        </div>
      </div>

      {showLabel ? (
        <span className="text-sm text-slate-700 tabular-nums">
          {v.toFixed(1)}
          {count != null ? ` (${count})` : ""}
        </span>
      ) : count != null ? (
        <span className="text-xs text-slate-500 tabular-nums">({count})</span>
      ) : null}
    </div>
  );
}

function Star({ className = "" }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 15.27l-5.18 3.05 1.4-5.98L1 7.97l6.05-.52L10 1.5l2.95 5.95 6.05.52-5.22 4.37 1.4 5.98z"
      />
    </svg>
  );
}
