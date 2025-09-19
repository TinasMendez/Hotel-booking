// frontend/src/pages/Home.jsx
// Home must show search, categories, and product recommendations (max 10 random, 2 columns × 5 rows).

import React, { useEffect, useState } from "react";
import Api from "../services/api.js";
import ProductCard from "../components/ProductCard.jsx";
import CategoryFilter from "../components/CategoryFilter.jsx";
import SearchBar from "../components/SearchBar.jsx";
import Pagination from "../components/Pagination.jsx";

const PAGE_SIZE = 10;

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional: server pagination for general list (fallback)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function loadRandom() {
    setLoading(true);
    setError("");
    try {
      // Ensures up to 10 unique random products with no duplicates.
      const { data } = await Api.get("/products/random", { params: { limit: 10 } });
      const unique = Array.isArray(data)
        ? Array.from(new Map(data.map((p) => [String(p.id), p])).values())
        : [];
      setItems(unique.slice(0, 10));
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      // Fallback: first page of the catalog when random endpoint is unavailable.
      try {
        const { data } = await Api.get("/products", { params: { page: 0, size: PAGE_SIZE } });
        const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
        setItems(list.slice(0, 10));
        setTotalPages(1);
        setPage(1);
      } catch (e2) {
        setError("Failed to load products.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRandom();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Search block */}
      <section aria-labelledby="home-search">
        <h2 id="home-search" className="text-xl font-semibold text-slate-900 mb-3">
          Find stays by date and city
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Use the search to filter by city and date range. You can also explore by category below.
        </p>
        <SearchBar />
      </section>

      {/* Categories block */}
      <section aria-labelledby="home-categories">
        <h2 id="home-categories" className="text-xl font-semibold text-slate-900 mb-3">
          Categories
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Discover by type to find the best match.
        </p>
        <CategoryFilter />
      </section>

      {/* Recommendations block: max 10, grid 2×5 (desktop), no duplicates */}
      <section aria-labelledby="home-recommendations">
        <div className="flex items-center justify-between mb-3">
          <h2 id="home-recommendations" className="text-xl font-semibold text-slate-900">
            Recommendations
          </h2>
          <button
            type="button"
            onClick={loadRandom}
            className="text-sm px-3 py-2 rounded-lg border hover:bg-slate-50"
            title="Refresh random recommendations"
          >
            Refresh
          </button>
        </div>

        {loading && <div className="text-sm text-slate-600">Loading…</div>}
        {error && (
          <div className="text-sm text-red-600">
            {error}
            <button className="ml-2 underline" onClick={loadRandom}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Keep Pagination for general list pages; hidden for random (1 page) */}
        <div className={`${totalPages <= 1 ? "hidden" : "block"} mt-6`}>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </section>
    </div>
  );
}
