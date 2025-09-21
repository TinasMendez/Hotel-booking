import React from "react";
import { useFavorites } from "../hooks/useFavorites";

/**
 * Heart button to be used in product cards/details.
 * Works with favorites endpoints and keeps optimistic UI.
 * Meets Sprint 3 HU#24 (toggle favorite for authenticated users).
 */
export default function FavoriteButton({ productId }) {
  const { isFav, toggle, loading } = useFavorites(true);
  const active = isFav(productId);

  return (
    <button
      aria-pressed={active}
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        toggle(productId);
      }}
      className={`heart ${active ? "on" : "off"}`}
      title={active ? "Remove from favorites" : "Add to favorites"}
    >
      ♥
      <style>
        {`
        .heart{
          border:0; background:transparent; font-size:1.25rem; line-height:1;
          cursor:pointer; transition: transform .15s ease;
        }
        .heart.on{ color:#e63946; }
        .heart.off{ color:#889; }
        .heart:active{ transform: scale(.95); }
      `}
      </style>
    </button>
  );
}
