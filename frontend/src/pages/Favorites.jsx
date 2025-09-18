import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../services/api.js";
import { getProduct } from "../services/products.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Favorites() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const favorites = await Api.getFavorites();
        if (!Array.isArray(favorites) || favorites.length === 0) {
          if (!cancelled) setProducts([]);
          return;
        }
        const uniqueProductIds = Array.from(new Set(favorites.map((fav) => fav.productId)));
        const results = await Promise.all(
          uniqueProductIds.map(async (pid) => {
            try {
              return await getProduct(pid);
            } catch {
              return null;
            }
          })
        );
        if (!cancelled) {
          setProducts(results.filter(Boolean));
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load favorites");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="p-6">Loading your favorites…</div>;
  }

  if (error) {
    return (
      <div className="p-6 space-y-3 text-red-600">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
        <Link to="/" className="underline">Go back home</Link>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">My Favorites</h1>
        <div className="p-8 text-center border rounded-2xl bg-gray-50">
          <p className="text-gray-700">You have no favorites yet.</p>
          <p className="text-sm text-gray-500">Save products to find them faster later.</p>
          <Link to="/" className="inline-block mt-3 px-4 py-2 rounded bg-blue-600 text-white">Explore</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Favorites</h1>
        <p className="text-sm text-gray-500">{products.length} saved {products.length === 1 ? "property" : "properties"}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
