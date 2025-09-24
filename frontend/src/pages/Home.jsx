// frontend/src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import { getAllProducts, searchProducts } from "../services/products.js";

/**
 * Home keeps the “Find stays by date and city” block unchanged.
 * Below it, “Find your perfect stay” lists all products by default.
 * Filters are optional; user can refine using search or category.
 */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [searching, setSearching] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  async function loadAll() {
    setLoadingList(true);
    setListError("");
    try {
      const items = await getAllProducts({ page: 0, size: 100 });
      setProducts(items);
    } catch {
      setListError("Failed to load products.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSearch(params) {
    setSearching(true);
    setListError("");
    try {
      const page = await searchProducts(params);
      const list = Array.isArray(page?.content)
        ? page.content
        : Array.isArray(page)
          ? page
          : [];
      setProducts(list);
    } catch {
      setListError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function handleCategoryChange(val) {
    setCategoryFilter(val);
    if (!val) return loadAll();
    return handleSearch({ categoryId: val, page: 0, size: 100 });
  }

  function handleReset() {
    setCategoryFilter("");
    loadAll();
  }

  const SkeletonGrid = ({ count = 8 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Search block (unchanged) */}
      <section aria-labelledby="home-search">
        <h2 id="home-search" className="text-xl font-semibold mb-2">
          Find stays by date and city
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Use the search to filter by city and date range. You can also explore
          by category below.
        </p>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />
      </section>

      {/* Categories filter (optional) */}
      <section aria-labelledby="home-categories">
        <h2 id="home-categories" className="text-xl font-semibold mb-2">
          Categories
        </h2>
        <p className="text-sm text-slate-600 mb-3">
          Discover by type to find the best match.
        </p>
        <div className="max-w-lg">
          <CategoryFilter
            value={categoryFilter}
            onChange={handleCategoryChange}
          />
        </div>
      </section>

      {/* Main listing */}
      <section aria-labelledby="home-list">
        <div className="flex items-center justify-between mb-3">
          <h2 id="home-list" className="text-xl font-semibold">
            Find your perfect stay
          </h2>
          <button
            type="button"
            onClick={loadAll}
            className="btn-outline btn-sm focus-ring"
          >
            Refresh
          </button>
        </div>

        {(loadingList || searching) && <SkeletonGrid count={8} />}
        <LoadingOverlay show={searching} label="Searching products..." />

        {listError && !loadingList && !searching && (
          <div className="text-sm text-red-600 mb-3">{listError}</div>
        )}

        {!listError && !loadingList && !searching && products.length === 0 && (
          <EmptyState
            title="No properties found"
            description="Try changing dates, city or category."
            action={
              <button className="btn-outline focus-ring" onClick={handleReset}>
                Clear filters
              </button>
            }
          />
        )}

        {!loadingList && !searching && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} hideRatings />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
