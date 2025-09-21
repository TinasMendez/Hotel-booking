import React, { useMemo, useState } from "react";
import ShareModal from "./ShareModal";

/**
 * Small wrapper that opens a modal with deep-links for social networks.
 * - A11y: focus-ring on trigger button, clear aria labeling.
 * - Styling: Tailwind utilities (no inline <style>).
 */
export default function ShareButtons({ product, variant = "primary" }) {
  const [open, setOpen] = useState(false);

  const share = useMemo(
    () => ({
      title: product?.name || "Product",
      description: product?.description || "Check this product",
      url: typeof window !== "undefined" ? window.location.href : "",
      imageUrl: Array.isArray(product?.images) ? product.images[0] : product?.imageUrl,
    }),
    [product]
  );

  // Choose button style by variant
  const baseBtn = "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm focus-ring";
  const styles =
    variant === "secondary"
      ? `${baseBtn} border border-slate-300 bg-white hover:bg-slate-50`
      : `${baseBtn} bg-emerald-600 text-white hover:bg-emerald-700`;

  return (
    <>
      <button
        type="button"
        className={styles}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open share options"
        title="Share this listing"
      >
        {/* Simple share glyph */}
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="currentColor"
            d="M18 8a3 3 0 10-2.83-4H15a3 3 0 102.83 4H18zm-12 8a3 3 0 102.83 4H9a3 3 0 10-2.83-4H6zm.59-5.41l8.82-4.41a1 1 0 11.9 1.79l-8.82 4.41a1 1 0 01-.9-1.79zm0 5l8.82 4.41a1 1 0 00.9-1.79l-8.82-4.41a1 1 0 10-.9 1.79z"
          />
        </svg>
        Share
      </button>

      <ShareModal open={open} onClose={() => setOpen(false)} data={share} />
    </>
  );
}
