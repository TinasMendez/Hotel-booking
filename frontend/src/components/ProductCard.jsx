// /frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const id = product?.id;
  const imageSrc = product?.imageUrl
    || (Array.isArray(product?.imageUrls) && product.imageUrls[0])
    || "https://via.placeholder.com/600x400?text=No+image";
  return (
    <div className="rounded-2xl border overflow-hidden shadow-sm">
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-56 object-cover"
        loading="lazy"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="flex gap-2 pt-2">
          {/* IMPORTANT: route must be /product/:id (singular) */}
          <Link to={`/product/${id}`} className="px-3 py-1 rounded-xl border">
            Details
          </Link>
          <Link
            to={`/booking/${id}`}
            className="px-3 py-1 rounded-xl bg-blue-600 text-white"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
