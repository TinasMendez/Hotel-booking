import React from "react";
import { useFavorites } from "../hooks/useFavorites";

/**
 * Heart button to be used in product cards/details.
 * Works with favorites endpoints and keeps optimistic UI.
 * Accessibility: uses aria-pressed and focus-ring for keyboard users.
 */
export default function FavoriteButton({ productId }) {
  const { isFav, toggle, loading } = useFavorites(true);
  const active = isFav(productId);

  return (
    <button
      aria-pressed={active}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        toggle(productId);
      }}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-full focus-ring transition
        ${active ? "text-rose-600" : "text-slate-500 hover:text-slate-700"}
        bg-white/90 border border-slate-200 shadow-sm`}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Using text heart for simplicity and low bundle size */}
      <span className="text-lg leading-none select-none">♥</span>
    </button>
  );
}
