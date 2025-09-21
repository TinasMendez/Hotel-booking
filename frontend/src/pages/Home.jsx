import React, { useEffect, useState } from "react";
import Api from "../services/api";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

/**
 * Home keeps Search, Categories, Recommendations always visible.
 * Accessibility: adds focus-ring to actionable elements (refresh, retry).
 */
export default function Home() {
  const [randomItems, setRandomItems] = useState([]);
  const [loadingRandom, setLoadingRandom] = useState(true);
  const [randomError, setRandomError] = useState("");

  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [categoryFilter, setCategoryFilter] = useState(""); // <-- drives Categories block

  async function loadRandom() {
    setLoadingRandom(true);
    setRandomError("");
    try {
      const res = await Api.get("/products/random", { params: { limit: 10 } });
      const arr = Array.isArray(res.data) ? res.data : [];
      const uniq = Array.from(new Map(arr.map((p) => [p.id, p])).values());
      setRandomItems(uniq.slice(0, 10));
    } catch {
      setRandomError("Failed to load products.");
    } finally {
      setLoadingRandom(false);
    }
  }

  useEffect(() => {
    loadRandom();
  }, []);

  async function handleSearch(params) {
    setSearching(true);
    setSearchError("");
    try {
      const res = await Api.get("/products/search", {
        params: {
          categoryId: params.categoryId,
          cityId: params.cityId,
          q: params.q,
          startDate: params.startDate,
          endDate: params.endDate,
          page: params.page ?? 0,
          size: params.size ?? 10,
        },
      });
      const data = res.data;
      const list = Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data)
        ? data
        : [];
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
    setCategoryFilter(""); // keep UI in sync
  }

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
                setResults([]);
              } else {
                // Quick category-only search to show relevant results
                handleSearch({ categoryId: val, page: 0, size: 10 });
              }
            }}
          />
        </div>
      </section>

      {/* Search results */}
      {searching && <div className="text-sm text-slate-600">Searching…</div>}
      {!!searchError && <div className="text-sm text-red-600">{searchError}</div>}
      {results.length > 0 && (
        <section aria-labelledby="home-results">
          <h2 id="home-results" className="text-xl font-semibold mb-3">Search results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section aria-labelledby="home-recommendations">
        <div className="flex items-center justify-between mb-3">
          <h2 id="home-recommendations" className="text-xl font-semibold">Recommendations</h2>
          <button
            type="button"
            onClick={loadRandom}
            className="text-sm px-3 py-2 rounded-lg border hover:bg-slate-50 focus-ring"
            title="Refresh random recommendations"
          >
            Refresh
          </button>
        </div>

        {loadingRandom && <div className="text-sm text-slate-600">Loading…</div>}
        {randomError && (
          <div className="text-sm text-red-600">
            {randomError}{" "}
            <button className="underline focus-ring rounded" onClick={loadRandom}>
              Retry
            </button>
          </div>
        )}
        {!loadingRandom && !randomError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {randomItems.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
