// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx";

export default function ProductCard({ product }) {
  const id = product?.id;
  const imageSrc =
    product?.imageUrl ||
    (Array.isArray(product?.imageUrls) && product.imageUrls[0]) ||
    "https://via.placeholder.com/600x400?text=No+image";
  const average = Number(product?.ratingAverage ?? 0);
  const count = Number(product?.ratingCount ?? 0);

  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm relative bg-white">
      <img
        src={imageSrc}
        alt={product?.name || "Product image"}
        className="w-full h-48 object-cover"
        loading="lazy"
      />

      {/* Favorite should be visible on each card */}
      <div className="absolute top-3 right-3">
        <FavoriteButton productId={id} />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{product?.name}</h3>
          <div className="text-sm text-amber-600">
            {count > 0 ? `★ ${average.toFixed(1)} (${count})` : "No ratings"}
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{product?.description}</p>

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
}
