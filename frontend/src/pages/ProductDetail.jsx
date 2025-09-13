// /frontend/src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { httpGet } from "../api/http";

async function fetchProductById(productId) {
  // 1) Intenta con /api/products/{id}
  try {
    const one = await httpGet(`/products/${productId}`)          // sin /api
      .catch(() => httpGet(`/api/products/${productId}`));       // con /api
    if (one && one.id) return one;
  } catch (_) {}

  // 2) Si no existe endpoint por id, baja la lista y busca
  try {
    const list = await httpGet(`/products`).catch(() => httpGet(`/api/products`));
    const items = Array.isArray(list) ? list : list?.content ?? [];
    return items.find(p => String(p.id) === String(productId)) || null;
  } catch (_) {
    return null;
  }
}

export default function ProductDetail() {
  const { productId } = useParams(); // debe coincidir con la ruta
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    (async () => {
      const p = await fetchProductById(productId);
      if (!mounted) return;
      if (!p) setErr("Product not found");
      setProduct(p);
      setLoading(false);
    })();

    return () => { mounted = false; };
  }, [productId]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">Error: {err}</div>;
  if (!product) return <div className="p-6">Product not found.</div>;

  const cover =
    product.imageUrl ||
    (Array.isArray(product.imageUrls) && product.imageUrls[0]) ||
    (Array.isArray(product.images) && (product.images[0]?.url || product.images[0])) ||
    "https://picsum.photos/seed/placeholder/800/480";

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        {product?.city?.name && <p className="text-gray-600">{product.city.name}</p>}
      </header>

      <img src={cover} alt={product.name} className="w-full max-w-4xl rounded-xl shadow" loading="lazy" />

      <p className="text-gray-800">{product.description}</p>

      <div className="flex gap-2">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white"
          onClick={() => navigate(`/booking/${productId}`)}
        >
          Book
        </button>
        <Link to="/" className="px-4 py-2 rounded border">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
