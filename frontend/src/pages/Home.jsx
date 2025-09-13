import { useCallback, useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/products";

/** Home page that lists products with filters and pagination. */
export default function Home() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Search state (q, categoryId, cityId, start, end)
  const [filters, setFilters] = useState({
    q: "",
    categoryId: "",
    cityId: "",
    start: "",
    end: "",
  });

  const params = useMemo(() => ({
    page,
    size,
    ...Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    ),
  }), [page, size, filters]);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getProducts(params);
      setItems(res.items ?? []);
      setTotal(res.total ?? 0);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { load(); }, [load]);

  function onSearch(newFilters) {
    // Reset to first page on each search
    setPage(0);
    setFilters(newFilters);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Available Products</h1>

      <SearchBar
        defaultValues={filters}
        onSearch={onSearch}
      />

      {loading && <p>Loading products...</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {!loading && !err && (
        <>
          <p className="text-sm text-gray-600">
            {total} {total === 1 ? "result" : "results"}
          </p>

          {items.length === 0 ? (
            <p>No products found. Try adjusting filters or dates.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Simple pagination controls */}
          <div className="flex items-center gap-2 pt-4">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((n) => Math.max(n - 1, 0))}
              disabled={page === 0}
            >
              Prev
            </button>
            <span className="text-sm">
              Page {page + 1} · Showing {items.length} / {total}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setPage((n) => n + 1)}
              disabled={(page + 1) * size >= total}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
