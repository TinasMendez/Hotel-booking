// frontend/src/pages/Home.jsx
// Home page: search + client-side pagination + safe image handling.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { httpGet } from "../api/http";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

/** Small helper to shuffle on first load for a nicer, varied grid. */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Robust cover resolver for different backend shapes. */
function getCover(product) {
  if (!product) return "https://via.placeholder.com/640x360?text=No+Image";

  // Single url
  if (product.imageUrl) return product.imageUrl;

  // Array of URLs
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }

  // Array of objects or strings
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    return typeof first === "string" ? first : first?.url;
  }

  return "https://via.placeholder.com/640x360?text=No+Image";
}

export default function Home() {
  // Search controls
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [cityId, setCityId] = useState("all");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(1);
  const firstLoadRef = useRef(true);

  // Load filter data (categories + cities)
  useEffect(() => {
    (async () => {
      try {
        const [cats, cits] = await Promise.all([
          httpGet("/categories").catch(() => []),
          httpGet("/cities").catch(() => []),
        ]);
        setCategories(Array.isArray(cats) ? cats : cats?.content ?? []);
        setCities(Array.isArray(cits) ? cits : cits?.content ?? []);
      } catch {
        // silent: filters are optional
      }
    })();
  }, []);

  const fetchProducts = async (opts = {}) => {
    setLoading(true);
    setErr("");
    try {
      // Only send params that actually have values
      const params = new URLSearchParams();
      if (opts.q) params.set("q", opts.q);
      if (opts.categoryId && opts.categoryId !== "all")
        params.set("categoryId", opts.categoryId);
      if (opts.cityId && opts.cityId !== "all")
        params.set("cityId", opts.cityId);
      if (opts.start) params.set("start", opts.start);
      if (opts.end) params.set("end", opts.end);

      const path = params.toString()
        ? `/products?${params.toString()}`
        : "/products";

      const data = await httpGet(path);
      let list = Array.isArray(data) ? data : data?.content ?? [];

      // Shuffle only on the very first load when there are no filters
      const noFilters =
        !opts.q &&
        (!opts.categoryId || opts.categoryId === "all") &&
        (!opts.cityId || opts.cityId === "all") &&
        !opts.start &&
        !opts.end;

      if (firstLoadRef.current && noFilters) {
        list = shuffle(list);
        firstLoadRef.current = false;
      }

      setItems(list);
      setPage(1);
    } catch (e) {
      setErr(e?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts({});
  }, []);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    return items.slice(startIndex, startIndex + PAGE_SIZE);
  }, [items, page]);

  const onSearch = (e) => {
    e.preventDefault();
    fetchProducts({ q, categoryId, cityId, start, end });
  };

  const onReset = () => {
    setQ("");
    setCategoryId("all");
    setCityId("all");
    setStart("");
    setEnd("");
    firstLoadRef.current = true;
    fetchProducts({});
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Products</h1>

      {/* Search bar */}
      <form onSubmit={onSearch} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input
          className="border rounded p-2 md:col-span-2"
          placeholder="Hotel, glamping, loft..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="border rounded p-2"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="all">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title || c.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded p-2"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
        >
          <option value="all">All</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* spacer to fill 5 columns on md+ */}
        <div className="hidden md:block" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:col-span-5">
          <input
            type="date"
            className="border rounded p-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            placeholder="dd.mm.yyyy"
          />
          <input
            type="date"
            className="border rounded p-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            placeholder="dd.mm.yyyy"
          />
          <button className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black">
            Search
          </button>
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 rounded border"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results */}
      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {!loading && !err && (
        <>
          <p className="text-sm text-gray-500 mb-3">{items.length} results</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pageItems.map((p) => {
              const cover = getCover(p);
              return (
                <div key={p.id} className="bg-white rounded shadow overflow-hidden">
                  <img
                    src={cover}
                    alt={p.name}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {p.description}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {/* Single, canonical link to details */}
                      <Link
                        to={`/product/${p.id}`}
                        className="px-3 py-1 rounded border"
                      >
                        Details
                      </Link>
                      {/* Optional: quick access to booking */}
                      <Link
                        to={`/booking/${p.id}`}
                        className="px-3 py-1 rounded bg-blue-600 text-white"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((x) => Math.max(1, x - 1))}
            onNext={() => setPage((x) => Math.min(totalPages, x + 1))}
          />
        </>
      )}
    </div>
  );
}
