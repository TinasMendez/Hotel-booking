// src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { getBlockedDates } from "../services/bookings";

export default function ProductDetail() {
  const { id } = useParams(); // product id from route
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [blockedDates, setBlockedDates] = useState([]);
    const [range, setRange] = useState({ startDate: "", endDate: "" });

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

    return (
        <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-semibold">
            {product.name || product.title || `#${id}`}
            </h1>
            {product.city?.name && (
            <p className="text-gray-600">City: {product.city.name}</p>
            )}
        </div>

        {product.imageUrl && (
            <img
            src={product.imageUrl}
            alt={product.name || "Product"}
            className="w-full max-w-xl rounded"
            />
        )}

        {Array.isArray(product.features) && product.features.length > 0 && (
            <div>
            <h2 className="text-lg font-semibold mb-2">Features</h2>
            <ul className="list-disc pl-6">
                {product.features.map((f, i) => (
                <li key={i}>
                    {f.name || f.title}
                    {f.description ? ` — ${f.description}` : ""}
                </li>
                ))}
            </ul>
            </div>
        )}

        <div className="space-y-3">
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
        </div>
        </div>
    );
    }

