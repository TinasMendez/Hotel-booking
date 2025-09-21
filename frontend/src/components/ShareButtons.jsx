import React, { useMemo, useState } from "react";
import ShareModal from "./ShareModal";

/**
 * Small wrapper that opens a modal with deep-links for FB/Twitter/IG.
 * Keeps the button API stable but fulfills Sprint 3 US#27 requirements.
 */
export default function ShareButtons({ product }) {
  const [open, setOpen] = useState(false);

  const share = useMemo(
    () => ({
      title: product?.name || "Product",
      description: product?.description || "Check this product",
      url: window.location.href,
      imageUrl: Array.isArray(product?.images) ? product.images[0] : product?.imageUrl,
    }),
    [product]
  );

  return (
    <>
      <button className="share" onClick={() => setOpen(true)}>
        Share this listing
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} data={share} />
      <style>
        {`
        .share{
          border:1px solid #d1d5db; padding:.5rem .75rem; border-radius:8px; background:#fff; cursor:pointer;
        }
      `}
      </style>
    </>
  );
}
