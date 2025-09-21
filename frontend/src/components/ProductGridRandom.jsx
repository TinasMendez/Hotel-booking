// src/components/ProductGridRandom.jsx
import React, { useMemo } from "react";
import { shuffleArray, takeFirst } from "../utils/array";

/**
 * Layout: 2 columns x up to 5 rows (max 10 cards).
 * Tailwind-only grid (no inline <style>), responsive down to 1 column on small screens.
 */
export default function ProductGridRandom({ products = [], CardComponent }) {
  const slice = useMemo(() => takeFirst(shuffleArray(products), 10), [products]);

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-4 sm:grid-cols-1">
      {slice.map((p) => (
        <CardComponent key={p.id} product={p} />
      ))}
    </div>
  );
}
