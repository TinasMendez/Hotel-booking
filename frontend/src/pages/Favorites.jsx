// src/pages/Favorites.jsx
import React, { useEffect, useState } from "react";
import Api from "../services/api";
import FavoriteButton from "../components/FavoriteButton";
import { Link } from "react-router-dom";

/** Picks the best available image for a product or returns empty string. */
function pickImage(p) {
  return (
    p?.imageUrl ||
    p?.thumbnail ||
    p?.coverUrl ||
    p?.image ||
    (Array.isArray(p?.imageUrls) && p.imageUrls[0]) ||
    (Array.isArray(p?.images) && (p.images[0]?.url || p.images[0]?.imageUrl)) ||
    (Array.isArray(p?.photos) && (p.photos[0]?.url || p.photos[0]?.imageUrl)) ||
    p?.category?.image ||
    ""
  );
}

/** Always returns a valid image URL. */
function resolveImage(p) {
  const url = pickImage(p);
  return url || "https://via.placeholder.com/640x400?text=No+image";
}

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function enrichIfNeeded(list) {
    // Why: some favorites payloads lack images. Enrich those with /products/:id.
    const needs = list.filter((p) => !pickImage(p));
    if (needs.length === 0) return list;

    const augmented = await Promise.all(
      list.map(async (p) => {
        const id = p?.id ?? p?.productId;
        if (!id || pickImage(p)) return p;
        try {
          const res = await Api.get(`/products/${id}`);
          const product = res?.data || {};
          return { ...product, ...p }; // product provides images; keep name/description from either
        } catch {
          return p; // keep original on failure; resolveImage will handle placeholder
        }
      })
    );
    return augmented;
  }

  async function load() {
    setLoading(true);
    try {
      const list = await Api.getFavorites();
      const arr = Array.isArray(list) ? list : Array.isArray(list?.content) ? list.content : [];
      const withImages = await enrichIfNeeded(arr);
      setItems(withImages);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Favorites</h1>
        <span className="text-sm text-slate-600">{items.length} saved properties</span>
      </div>

      {items.length === 0 && <p className="text-slate-600">You have no favorites yet.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((p) => {
          const id = p?.id ?? p?.productId;
          const image = resolveImage(p);
          return (
            <div key={id} className="rounded-2xl border overflow-hidden shadow-sm relative bg-white">
              <img
                src={image}
                alt={p?.name || "Image"}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/640x400?text=No+image";
                }}
              />
              <div className="absolute top-3 right-3">
                <FavoriteButton
                  productId={id}
                  defaultActive={true}
                  onChange={(active) => {
                    if (!active) setItems((prev) => prev.filter((x) => (x?.id ?? x?.productId) !== id));
                  }}
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-slate-900 line-clamp-1">{p?.name}</h3>
                <p className="text-sm text-slate-600 line-clamp-2">{p?.description}</p>
                <div className="pt-2">
                  <Link
                    to={`/product/${id}`}
                    className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
                  >
                    View details →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
