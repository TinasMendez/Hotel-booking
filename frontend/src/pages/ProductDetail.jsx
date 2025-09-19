import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { getProduct } from "../services/products";
import Api, { BookingAPI } from "../services/api.js";

import Gallery5 from "../components/Gallery5.jsx";
import ModalGallery from "../components/ModalGallery.jsx";
import FeaturesBlock from "../components/FeaturesBlock.jsx";
import PolicyBlock from "../components/PolicyBlock.jsx";
import ShareButtons from "../components/ShareButtons.jsx";
import AvailabilityCalendar from "../components/AvailabilityCalendar.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import RatingStars from "../components/RatingStars.jsx";

const FALLBACK_IMAGE = "https://via.placeholder.com/960x540?text=No+image";

function collectGallery(product) {
  if (!product) return [FALLBACK_IMAGE];
  const urls = [];
  if (product.imageUrl) urls.push(product.imageUrl);
  if (Array.isArray(product.imageUrls)) urls.push(...product.imageUrls);
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (typeof img === "string") urls.push(img);
      else if (img?.url) urls.push(img.url);
    });
  }
  const deduped = Array.from(new Set(urls.filter(Boolean)));
  return deduped.length ? deduped : [FALLBACK_IMAGE];
}

function mapPolicies(policies, formatMessage) {
  if (!Array.isArray(policies) || policies.length === 0) return null;

  const buckets = [
    {
      id: "rules",
      title: formatMessage({ id: "policies.sections.house.title" }),
      items: [],
    },
    {
      id: "health",
      title: formatMessage({ id: "policies.sections.health.title" }),
      items: [],
    },
    {
      id: "cancellation",
      title: formatMessage({ id: "policies.sections.cancellation.title" }),
      items: [],
    },
  ];

  policies.forEach((policy) => {
    const text = policy?.description || policy?.title;
    if (!text) return;
    const key = (policy?.title || "").toLowerCase();
    if (key.includes("health") || key.includes("safety") || key.includes("salud") || key.includes("seguridad")) {
      buckets[1].items.push(text);
    } else if (key.includes("cancel")) {
      buckets[2].items.push(text);
    } else {
      buckets[0].items.push(text);
    }
  });

  const filled = buckets.filter((section) => section.items.length > 0);
  return filled.length ? filled : null;
}

function expandBookings(bookings) {
  if (!Array.isArray(bookings)) return [];
  const dates = new Set();
  bookings.forEach((booking) => {
    if (!booking || booking.status === "CANCELLED") return;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      dates.add(cursor.toISOString().slice(0, 10));
    }
  });
  return Array.from(dates);
}

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const [product, setProduct] = useState(null);
  const [features, setFeatures] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [city, setCity] = useState(null);
  const [category, setCategory] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selection, setSelection] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    if (!Number.isFinite(productId)) {
      setError("Invalid product id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const prod = await getProduct(productId);
        if (cancelled) return;
        if (!prod) {
          setError("Product not found");
          setProduct(null);
          return;
        }
        setProduct(prod);

        const requests = [
          Api.get("/features").catch(() => ({ data: [] })),
          Api.get(`/policies/product/${productId}`).catch(() => ({ data: [] })),
          BookingAPI.listByProduct(productId).catch(() => []),
        ];

        if (prod.cityId) {
          requests.push(Api.get(`/cities/${prod.cityId}`).catch(() => ({ data: null })));
        } else {
          requests.push(Promise.resolve({ data: null }));
        }

        if (prod.categoryId) {
          requests.push(Api.get(`/categories/${prod.categoryId}`).catch(() => ({ data: null })));
        } else {
          requests.push(Promise.resolve({ data: null }));
        }

        const [featuresRes, policiesRes, bookingsRes, cityRes, categoryRes] = await Promise.all(requests);
        if (cancelled) return;

        const featuresData = Array.isArray(featuresRes?.data) ? featuresRes.data : [];
        const policiesData = Array.isArray(policiesRes?.data) ? policiesRes.data : [];
        const bookingsData = Array.isArray(bookingsRes) ? bookingsRes : [];

        setFeatures(featuresData);
        setPolicies(policiesData);
        setBookings(bookingsData);
        setCity(cityRes?.data || null);
        setCategory(categoryRes?.data || null);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const gallery = useMemo(() => collectGallery(product), [product]);

  const featureList = useMemo(() => {
    if (!product || !features.length) return [];
    const rawIds = product.featureIds;
    const idArray = Array.isArray(rawIds)
      ? rawIds
      : rawIds instanceof Set
        ? Array.from(rawIds)
        : [];
    if (!idArray.length) return [];
    const ids = new Set(idArray);
    return features.filter((f) => ids.has(f.id));
  }, [product, features]);

  const policySections = useMemo(() => mapPolicies(policies, formatMessage), [policies, formatMessage]);
  const blockedDates = useMemo(() => expandBookings(bookings), [bookings]);

  if (loading) {
    return <div className="p-6">Loading product…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 space-y-3">
        <p className="font-semibold">Error loading product:</p>
        <p>{error}</p>
        <button className="underline" onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  if (!product) {
    return <div className="p-6">Product not found.</div>;
  }

  const locationLabel = city?.name ? city.name : (product.cityName || (product.cityId ? `City #${product.cityId}` : ""));
  const categoryLabel = category?.name || product.categoryName || (product.categoryId ? `Category #${product.categoryId}` : "");

  return (
    <div className="space-y-10 pb-16">
      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-sm uppercase text-gray-500">{categoryLabel}</p>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          {locationLabel && <p className="text-gray-600">{locationLabel}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <RatingStars productId={productId} />
          <FavoriteButton productId={productId} />
          <ShareButtons title={product.name} />
        </div>
      </header>

      <div>
        <Gallery5 images={gallery} onViewMore={() => setGalleryOpen(true)} />
        <ModalGallery open={galleryOpen} images={gallery} onClose={() => setGalleryOpen(false)} />
      </div>

      <section className="grid md:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
        <aside className="border rounded-2xl p-4 space-y-3 bg-gray-50">
          <p className="text-sm text-gray-600">Starting at</p>
          <p className="text-3xl font-semibold">${product.price}</p>
          <button
            onClick={() => navigate(`/booking/${productId}`)}
            className="w-full rounded-2xl bg-blue-600 text-white py-2 font-medium hover:bg-blue-700"
          >
            Reserve now
          </button>
        </aside>
      </section>

      <FeaturesBlock features={featureList} />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Availability</h2>
        <AvailabilityCalendar
          blockedDates={blockedDates}
          startDate={selection.startDate}
          endDate={selection.endDate}
          onChange={(range) => setSelection(range || { startDate: "", endDate: "" })}
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            {selection.startDate && selection.endDate && (
              <span>
                Selected {selection.startDate} → {selection.endDate}
              </span>
            )}
          </div>
          <Link
            to={`/booking/${productId}`}
            className="underline text-blue-600 font-medium"
          >
            Go to booking form
          </Link>
        </div>
      </section>

      {policySections && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Policies</h2>
          <PolicyBlock sections={policySections} />
        </section>
      )}
    </div>
  );
}
