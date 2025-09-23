// src/components/FavoriteButton.jsx
// Heart button to toggle favorite state for a product.
// Props:
//   - productId: number (required)
//   - onChange?: (isFavorite: boolean) => void  // notified after successful toggle

import React, { useEffect, useMemo, useState } from "react";
import useFavorites from "../hooks/useFavorites.js";

export default function FavoriteButton({ productId, onChange }) {
  const pid = Number(productId);
  const { isFavorite, toggle, reload } = useFavorites();
  const [pending, setPending] = useState(false);

  // Ensure initial state is synced with backend (no-op if already loaded)
  useEffect(() => {
    reload().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fav = useMemo(() => isFavorite(pid), [isFavorite, pid]);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!Number.isFinite(pid) || pending) return;

    setPending(true);
    try {
      const nowFav = await toggle(pid); // final state from backend
      onChange && onChange(nowFav); // let parent refresh if needed
    } catch (err) {
      alert("Could not update favorites. Try again.");
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  const title = fav ? "Remove from favorites" : "Add to favorites";

  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={handleClick}
      disabled={pending}
      className={[
        "inline-flex items-center justify-center rounded-full",
        "h-9 w-9 border border-slate-300 bg-white/95 shadow-sm",
        "hover:bg-white focus:outline-none focus:ring-2 focus:ring-slate-400",
        "transition disabled:opacity-60",
      ].join(" ")}
    >
      {/* Symmetric heart (Lucide). Same path for both states to avoid any shape jump */}
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${fav ? "text-rose-600" : "text-slate-600"}`}
        aria-hidden="true"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
          fill={fav ? "currentColor" : "none"}
          stroke={fav ? "none" : "currentColor"}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
