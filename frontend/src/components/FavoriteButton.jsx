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
      onChange && onChange(nowFav);     // let parent refresh if needed
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
      {/* Heart icon uses currentColor:
          - outline in slate when not favorite
          - filled red when favorite */}
      <svg
        viewBox="0 0 24 24"
        className={`h-5 w-5 ${fav ? "text-rose-500" : "text-slate-600"}`}
        aria-hidden="true"
        fill={fav ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 21s-6.716-4.291-9.192-7.02C.14 10.118 2.06 6 5.6 6c2.01 0 3.15 1.08 3.89 2.19.17.26.62.26.79 0C10.99 7.08 12.13 6 14.14 6c3.53 0 5.46 4.118 2.79 7.98C18.716 16.709 12 21 12 21z" />
      </svg>
    </button>
  );
}

