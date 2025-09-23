// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx";

/**
 * ProductCard displays image, name, rating and a CTA.
 * Accessibility: adds focus-ring to CTA; FavoriteButton handles its own focus style.
 *
 * Extra:
 * - onFavoriteChange?: (isFav:boolean) => void  (opcional; útil en /favorites para refrescar)
 */
export default function ProductCard({ product, onFavoriteChange }) {
  const id = product?.id;
  const imageSrc =
    product?.imageUrl ||
    (Array.isArray(product?.imageUrls) && product.imageUrls[0]) ||
    "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='400'>
          <rect width='100%' height='100%' fill='#f1f5f9'/>
          <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
            font-family='Inter,system-ui,Arial' font-size='20' fill='#475569'>
            No image
          </text>
        </svg>`
      );
  const average = Number(product?.ratingAverage ?? 0);
  const count = Number(product?.ratingCount ?? 0);

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={imageSrc}
          alt={product?.name || "Product image"}
          className="w-full aspect-[16/9] object-cover"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <FavoriteButton productId={id} onChange={onFavoriteChange} />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold text-slate-900 line-clamp-1">{product?.name}</h3>
          <div className="text-sm text-amber-600 shrink-0">
            {count > 0 ? `★ ${average.toFixed(1)} (${count})` : "No ratings"}
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{product?.description}</p>

        <div className="pt-2">
          <Link to={`/product/${id}`} className="btn-outline focus-ring">
            View details →
          </Link>
        </div>
      </div>
    </div>
  );
}
