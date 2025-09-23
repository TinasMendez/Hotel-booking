// frontend/src/components/SkeletonCard.jsx
import React from "react";

/**
 * SkeletonCard: visual placeholder for ProductCard while data is loading.
 * Uses Tailwind's animate-pulse for a lightweight shimmer.
 */
export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="animate-pulse">
        {/* Image placeholder */}
        <div className="w-full aspect-[16/9] bg-slate-200" />

        {/* Text placeholders */}
        <div className="p-4 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-full" />
          <div className="h-3 bg-slate-200 rounded w-5/6" />
          <div className="pt-2">
            <div className="h-9 bg-slate-200 rounded-lg w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
