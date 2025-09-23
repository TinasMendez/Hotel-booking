// frontend/src/pages/Favorites.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import ProductCard from "../components/ProductCard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { Api } from "../services/api.js";
import { getProduct } from "../services/products.js";
import useFavorites from "../hooks/useFavorites.js";

// Local placeholder (data URL) to avoid DNS errors when there is no image
const FALLBACK_IMG =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>
      <rect width='100%' height='100%' fill='#f1f5f9'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Inter,system-ui,Arial' font-size='20' fill='#475569'>
        No image
      </text>
    </svg>`,
  );

function normalizeProduct(p) {
  if (!p) return p;
  // Ensure we always have at least one usable image url
  const img =
    p?.imageUrl ||
    (Array.isArray(p?.imageUrls) && p.imageUrls[0]) ||
    (Array.isArray(p?.images) &&
      (typeof p.images[0] === "string" ? p.images[0] : p.images[0]?.url)) ||
    FALLBACK_IMG;
  return { ...p, imageUrl: img };
}

export default function Favorites() {
  const { list: favoriteIds, reload: reloadFavorites } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]); // array de productos completos
  const [error, setError] = useState("");

  const uniqueIds = useMemo(
    () =>
      Array.from(
        new Set(
          (favoriteIds || []).filter((id) => Number.isFinite(Number(id))),
        ),
      ),
    [favoriteIds],
  );

  const fetchAll = useCallback(async () => {
    if (!uniqueIds.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Fan-out en paralelo a /api/products/:id
      const results = await Promise.allSettled(
        uniqueIds.map((id) => getProduct(Number(id))),
      );
      const ok = results
        .map((r) =>
          r.status === "fulfilled" ? normalizeProduct(r.value) : null,
        )
        .filter(Boolean);
      setItems(ok);
    } catch (e) {
      setError(e?.message || "Failed to load favorites.");
    } finally {
      setLoading(false);
    }
  }, [uniqueIds]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Cuando el usuario agrega/quita desde el corazón, recargamos la lista
  const handleChanged = async () => {
    await reloadFavorites();
    fetchAll();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
        <div className="card p-8">
          <EmptyState
            title="No favorites yet"
            description="Save properties you like to find them easily later."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Favorites</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="relative">
            {/* ProductCard ya incluye el FavoriteButton.
                Le pasamos onChange para que cuando quiten el corazón se refresque la lista. */}
            <ProductCard
              product={p}
              onFavoriteChange={handleChanged /* <-- ver nota abajo */}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
