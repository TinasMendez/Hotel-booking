import React, { useMemo } from "react";
import { shuffleArray, takeFirst } from "../utils/array";

/**
 * Layout: 2 columns x up to 5 rows (max 10 cards).
 * Accepts a larger products array; renders a randomized, non-repeating slice.
 */
export default function ProductGridRandom({ products = [], CardComponent }) {
  const slice = useMemo(() => takeFirst(shuffleArray(products), 10), [products]);

  return (
    <div className="grid-two">
      {slice.map((p) => (
        <CardComponent key={p.id} product={p} />
      ))}
      <style>
        {`
        .grid-two {
          display:grid;
          grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 1rem;
        }
        @media (max-width: 768px){
          .grid-two{ grid-template-columns: 1fr; }
        }
      `}
      </style>
    </div>
  );
}
