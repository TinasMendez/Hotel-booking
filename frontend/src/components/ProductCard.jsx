import { Link } from "react-router-dom";

/** Product card with image, category, small description and actions. */
export default function ProductCard({ product }) {
  // Normalize image field name gracefully
    const img =
        product.imageUrl ||
        product.imageURL ||
        product.image ||
        "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format&fit=crop";

    return (
        <article className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <img
            src={img}
            alt={product.name}
            className="w-full h-48 object-cover"
            loading="lazy"
        />
        <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600">
            {product.category?.name ? "Category" : ""} {product.category?.name}
            </p>
            {product.description && (
            <p className="text-sm text-gray-700 line-clamp-3">{product.description}</p>
            )}

            <div className="pt-2 flex items-center gap-2">
            {/* Details could be another page; for now it points to the booking page */}
            <Link
                to={`/booking/${product.id}`}
                className="px-3 py-2 rounded-md border hover:bg-gray-50 text-sm"
            >
                Details
            </Link>
            <Link
                to={`/booking/${product.id}`}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
            >
                Book
            </Link>
            </div>
        </div>
        </article>
    );
}
