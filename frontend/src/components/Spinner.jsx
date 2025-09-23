// src/components/Spinner.jsx
import React from "react";

/**
 * Accessible loading spinner.
 * - Uses Tailwind utilities for size and animation.
 * - Announces loading state for screen readers.
 */
export default function Spinner({ label = "Loading...", size = "md" }) {
  // Map size prop to Tailwind sizing
  const sizeMap = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  const dim = sizeMap[size] ?? sizeMap.md;

  return (
    <div
      className="flex items-center gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <svg
        className={`${dim} animate-spin text-emerald-600`}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
