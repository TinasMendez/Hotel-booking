// src/pages/ProductDetail.jsx
// Product detail with: header, 1+4 gallery + modal, features with icons, policies,
// availability calendar (2 months) and CTA to booking.
// Keeps your existing services (api, getBlockedDates) and navigation.

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { getBlockedDates } from "../services/bookings";

// New UI blocks
import Gallery5 from "../components/Gallery5";
import ModalGallery from "../components/ModalGallery";
import FeaturesBlock from "../components/FeaturesBlock";
import PoliciesBlock from "../components/PoliciesBlock";

// Safely coalesce images from different shapes the backend might return
function coalesceImages(p) {
  const list =
    (Array.isArray(p?.images) && p.images.map((x) => x.url || x)) ||
    (Array.isArray(p?.imageUrls) && p.imageUrls) ||
    (p?.imageUrl ? [p.imageUrl] : []);
  return (list || []).filter(Boolean);
}

export default function ProductDetail() {
  const { id } = useParams(); // product id from route (/product/:id)
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [blockedDates, setBlockedDates] = useState([]);
  const [range, setRange] = useState({ startDate: "", endDate: "" });

  // Gallery modal
  const [openGallery, setOpenGallery] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        // Be resilient to different backend prefixes
        const candidates = [`/api/products/${id}`, `/products/${id}`];
        let found = null;
        for (const p of candidates) {
          try {
            const res = await api.get(p);
            found = res.data;
            break;
          } catch {
            /* try next */
          }
        }
        if (!found) throw new Error("Product not found");
        if (!active) return;
        setProduct(found);

        // Blocked dates are optional; fallback to []
        const dates = await getBlockedDates(id);
        if (active) setBlockedDates(dates);
      } catch (e) {
        if (!active) return;
        if (e?.response) {
          const { status, data } = e.response;
          const msg = typeof data === "string" ? data : data?.message || "error";
          setError(`HTTP ${status}: ${msg}`);
        } else if (e?.request) {
          setError("Network error (no response).");
        } else {
          setError(e?.message || "Unknown error");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const canContinue = Boolean(range.startDate && range.endDate);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!product) return <div>Not found.</div>;

  const images = coalesceImages(product);
  const title = product.name || product.title || `#${id}`;
  const cityName = product.city?.name || "";

  return (
    <div className="space-y-6">
      {/* Header block (Sprint 1 #5) */}
      <section className="w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <Link to="/" className="text-sm underline">
            ← Back
          </Link>
        </div>
        {cityName && <p className="text-gray-600">City: {cityName}</p>}
      </section>

      {/* Gallery 1+4 with "View more" button and fullscreen modal */}
      <section>
        <Gallery5 images={images} onViewMore={() => setOpenGallery(true)} />
        <ModalGallery open={openGallery} images={images} onClose={() => setOpenGallery(false)} />
      </section>

      {/* Description */}
      {product.description && (
        <section>
          <p className="text-gray-800">{product.description}</p>
        </section>
      )}

      {/* Features with icons (Sprint 2 #18) */}
      <FeaturesBlock features={product.features || []} />

      {/* Policies block (Sprint 3 #26) – 100% width, title underlined, columns */}
      <PoliciesBlock policies={product.policies} />

      {/* Availability (Sprint 3 #23) */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Availability</h2>
        <AvailabilityCalendar blockedDates={blockedDates} months={2} onChange={setRange} />
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!canContinue}
            onClick={() =>
              navigate(`/booking/${id}`, {
                state: { startDate: range.startDate, endDate: range.endDate },
              })
            }
            className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-60"
          >
            Continue to booking
          </button>
          <Link to="/" className="rounded border px-4 py-2">
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}