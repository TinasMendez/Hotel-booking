// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import EmptyState from "../components/EmptyState.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/**
 * Home:
 *  - Keeps the search block as-is.
 *  - Below, shows "Find your perfect stay" and lists ALL products.
 *  - If user searches or selects a category, we show the filtered results instead.
 *  - Clearing filters restores the full list.
 */
export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [allError, setAllError] = useState("");

  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("");

  async function loadAll() {
    setLoadingAll(true);
    setAllError("");
    try {
      // Supports both array and page-shaped responses
      const { data } = await Api.get("/products", { params: { size: 100 } });
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setAllProducts(list);
    } catch (e) {
      setAllError("Failed to load products.");
    } finally {
      setLoadingAll(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSearch(params) {
    setHasSearched(true);
    setSearching(true);
    setSearchError("");
    try {
      const { data } = await Api.get("/products/search", {
        params: {
          categoryId: params.categoryId,
          cityId: params.cityId,
          q: params.q,
          startDate: params.startDate,
          endDate: params.endDate,
          page: params.page ?? 0,
          size: params.size ?? 20,
        },
      });
      const list = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      setResults(list);
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  function handleReset() {
    setResults([]);
    setSearchError("");
    setSearching(false);
    setHasSearched(false);
    setCategoryFilter("");
  }

  // Which list should we show below the hero?
  const showingFiltered = hasSearched || categoryFilter !== "";
  const visible = showingFiltered ? results : allProducts;
  const topTitle = showingFiltered ? "Search results" : "Find your perfect stay";

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Search */}
      <section aria-labelledby="home-search">
        <h2 id="home-search" className="text-xl font-semibold mb-2">
          Find stays by date and city
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Use the search to filter by city and date range. You can also explore by category below.
        </p>
        <SearchBar onSearch={handleSearch} onReset={handleReset} />
      </section>

      {/* Categories */}
      <section aria-labelledby="home-categories">
        <h2 id="home-categories" className="text-xl font-semibold mb-2">Categories</h2>
        <p className="text-sm text-slate-600 mb-3">Discover by type to find the best match.</p>
        <div className="max-w-lg">
          <CategoryFilter
            value={categoryFilter}
            onChange={(val) => {
              setCategoryFilter(val);
              if (val === "") {
                handleReset();
              } else {
                handleSearch({ categoryId: val, page: 0, size: 20 });
              }
            }}
          />
        </div>
      </section>

      {/* Results / All products */}
      <section aria-labelledby="home-listing">
        <div className="flex items-center justify-between mb-3">
          <h2 id="home-listing" className="text-xl font-semibold">{topTitle}</h2>
          {!showingFiltered && (
            <button
              type="button"
              onClick={loadAll}
              className="btn-outline btn-sm focus-ring"
              title="Refresh"
            >
              Refresh
            </button>
          )}
        </div>

        {/* Loading states */}
        {(!showingFiltered && loadingAll) || (showingFiltered && searching) ? (
          <SkeletonGrid count={8} />
        ) : null}

        {/* Overlay spinner for the search flow only (non-blocking) */}
        <LoadingOverlay show={searching} label="Searching products..." />

        {/* Errors */}
        {!showingFiltered && allError && (
          <div className="text-sm text-red-600">{allError}</div>
        )}
        {showingFiltered && searchError && (
          <div className="text-sm text-red-600 mb-3">{searchError}</div>
        )}

        {/* Empty states */}
        {showingFiltered && !searching && visible.length === 0 && (
          <EmptyState
            title="No results"
            description="Try changing dates, city or category."
            action={
              <button className="btn-outline focus-ring" onClick={handleReset}>
                Clear filters
              </button>
            }
          />
        )}

        {/* Grid */}
        {!((!showingFiltered && loadingAll) || (showingFiltered && searching)) && visible.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
