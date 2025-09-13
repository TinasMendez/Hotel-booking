import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../services/products";
import { checkAvailability, createBooking } from "../services/bookings";
import { useAuth } from "../modules/auth/AuthContext";
import { useToast } from "../shared/ToastProvider";

/** Booking page to choose dates, check availability and create booking. */
export default function Booking() {
    const { productId } = useParams();
    const toast = useToast();
    const { isAuthenticated } = useAuth();

    const [product, setProduct] = useState(null);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState(null);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState(null);

    useEffect(() => {
        (async () => {
        try {
            const data = await getProduct(productId);
            setProduct(data);
        } catch (e) {
            setErr(e?.message || String(e));
        }
        })();
    }, [productId]);

    async function onCheck() {
        if (!start || !end) {
        toast?.info("Please select start and end dates");
        return;
        }
        setChecking(true);
        try {
        const res = await checkAvailability({
            productId: Number(productId),
            startDate: start,
            endDate: end,
        });
        setAvailable(!!res?.available);
        if (res?.available) {
            toast?.success("This product is available for the selected dates");
        } else {
            toast?.error(res?.message || "Not available");
        }
        } catch (e) {
        toast?.error("Error checking availability");
        } finally {
        setChecking(false);
        }
    }

    async function onBook() {
        if (!isAuthenticated) {
        toast?.info("Please login first");
        return;
        }
        if (!available) {
        toast?.info("Please check availability first");
        return;
        }
        setBusy(true);
        try {
        await createBooking({
            productId: Number(productId),
            startDate: start,
            endDate: end,
        });
        toast?.success("Booking created successfully");
        } catch (e) {
        toast?.error("Could not create booking");
        } finally {
        setBusy(false);
        }
    }

    if (err) return <p className="text-red-600">Error: {err}</p>;
    if (!product) return <p>Loading product...</p>;

    const img =
        product.imageUrl ||
        product.imageURL || // sometimes projects use this casing
        product.image ||    // fallback
        "https://images.unsplash.com/photo-1505692794403-34d4982f88aa?q=80&w=1200&auto=format&fit=crop"; // safe placeholder

    return (
        <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <img
            src={img}
            alt={product.name}
            className="w-full h-72 object-cover rounded-lg border"
            />
            <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="text-gray-600">
                {product.category?.name ? `Category: ${product.category.name}` : "Category"}
            </p>
            {product.city?.name && (
                <p className="text-gray-600">City: {product.city.name}</p>
            )}
            {product.description && (
                <p className="mt-2">{product.description}</p>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                <label className="block text-sm font-medium">Start date</label>
                <input
                    type="date"
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                />
                </div>
                <div>
                <label className="block text-sm font-medium">End date</label>
                <input
                    type="date"
                    className="mt-1 w-full border rounded px-3 py-2"
                    value={end}
                    onChange={(e) => setEnd(e.target.value)}
                />
                </div>
                <div className="flex items-end gap-2">
                <button
                    onClick={onCheck}
                    disabled={checking}
                    className="h-10 px-4 rounded bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
                >
                    {checking ? "Checking..." : "Check availability"}
                </button>
                <button
                    onClick={onBook}
                    disabled={!available || busy}
                    className="h-10 px-4 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                    {busy ? "Booking..." : "Book"}
                </button>
                </div>
            </div>

            {available === true && (
                <p className="text-green-700 mt-2">Available ✔</p>
            )}
            {available === false && (
                <p className="text-red-700 mt-2">Not available ✖</p>
            )}
            </div>
        </div>
        </div>
    );
    }