// frontend/src/components/ShareButtons.jsx
import React, { useMemo, useState } from "react";
import ShareModal from "./ShareModal";

/**
 * Small wrapper that opens a modal with deep-links for FB/Twitter/IG.
 * Now uses the unified button system (.btn-outline .btn-sm + .focus-ring).
 */
export default function ShareButtons({
  product,
  variant = "outline",
  size = "sm",
  label = "Share",
}) {
  const [open, setOpen] = useState(false);

  const share = useMemo(
    () => ({
      title: product?.name || "Product",
      description: product?.description || "Check this product",
      url: typeof window !== "undefined" ? window.location.href : "",
      imageUrl: Array.isArray(product?.images)
        ? product.images[0]
        : product?.imageUrl,
    }),
    [product],
  );

  const cls =
    `${variant === "primary" ? "btn-primary" : "btn-outline"} ` +
    `${size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "btn-md"} focus-ring`;

  return (
    <>
      <button className={cls} onClick={() => setOpen(true)}>
        {/* Simple icon + label keeps semantics accessible */}
        <span className="text-base leading-none">🔗</span>
        {label}
      </button>
      <ShareModal open={open} onClose={() => setOpen(false)} data={share} />
    </>
  );
}
