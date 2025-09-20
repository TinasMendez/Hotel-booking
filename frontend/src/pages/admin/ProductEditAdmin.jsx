// frontend/src/pages/admin/ProductEditAdmin.jsx
// Minimal editor to allow changing the category (and basic fields). Focus is on HU #12.

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../services/api.js";

/** Validates only what is necessary to prevent obvious errors. */
function isValid(form) {
    return (
        String(form.name || "").trim().length >= 3 &&
        String(form.description || "").trim().length >= 10 &&
        String(form.cityId || "").length > 0 &&
        String(form.categoryId || "").length > 0
    );
    }

    export default function ProductEditAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [features, setFeatures] = useState([]);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        address: "",
        cityId: "",
        categoryId: "",
        featureIds: [],
        imageUrls: [],
        imageUrl: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const canSave = useMemo(() => isValid(form) && !saving, [form, saving]);

    function updateField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        let cancelled = false;

        async function loadMeta() {
        const [cats, citiesRes, feats] = await Promise.all([
            Api.get("/categories"),
            Api.get("/cities"),
            Api.get("/features"),
        ]);
        if (!cancelled) {
            setCategories(Array.isArray(cats?.data) ? cats.data : []);
            setCities(Array.isArray(citiesRes?.data) ? citiesRes.data : []);
            setFeatures(Array.isArray(feats?.data) ? feats.data : []);
        }
        }

        async function loadProduct() {
        const { data } = await Api.get(`/products/${id}`);
        if (cancelled) return;
        const f = {
            name: data?.name || "",
            description: data?.description || "",
            price: data?.price ?? "",
            address: data?.address || "",
            cityId: data?.city?.id || data?.cityId || "",
            categoryId: data?.category?.id || data?.categoryId || "",
            featureIds: Array.isArray(data?.features) ? data.features.map((f) => f.id) : data?.featureIds || [],
            imageUrls: Array.isArray(data?.imageUrls) ? data.imageUrls : data?.images || [],
            imageUrl: data?.imageUrl || "",
        };
        setForm(f);
        }

        async function boot() {
        setLoading(true);
        setError("");
        try {
            await Promise.all([loadMeta(), loadProduct()]);
        } catch (err) {
            setError("Failed to load product.");
        } finally {
            if (!cancelled) setLoading(false);
        }
        }

        boot();
        return () => {
        cancelled = true;
        };
    }, [id]);

    async function onSubmit(e) {
        e.preventDefault();
        if (!canSave) return;
        setSaving(true);
        setError("");
        try {
        // The DTO expects these fields; keep unchanged values for a safe update.
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: form.price,
            imageUrl: form.imageUrl || "",
            address: form.address,
            cityId: Number(form.cityId),
            categoryId: Number(form.categoryId),
            featureIds: form.featureIds.map(Number),
            imageUrls: form.imageUrls,
        };
        await Api.put(`/products/${id}`, payload);
        navigate("/admin/products", { replace: true });
        } catch (err) {
        // If name already exists, backend should return 409 (ResourceConflictException).
        setError(err?.response?.data?.message || "Failed to save product.");
        } finally {
        setSaving(false);
        }
    }

    return (
        <div className="p-4 space-y-4">
        <h1 className="text-xl font-semibold">Edit product</h1>

        {loading && <div className="text-sm text-slate-600">Loading…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && (
            <form onSubmit={onSubmit} className="space-y-4 max-w-3xl">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    placeholder="Product name"
                    minLength={3}
                    required
                />
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                    value={form.categoryId}
                    onChange={(e) => updateField("categoryId", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    required
                >
                    <option value="">Select a category…</option>
                    {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                    value={form.cityId}
                    onChange={(e) => updateField("cityId", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    required
                >
                    <option value="">Select a city…</option>
                    {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                    ))}
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                rows={5}
                placeholder="Describe the product"
                minLength={10}
                required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Features</label>
                <div className="flex flex-wrap gap-2">
                {features.map((f) => {
                    const active = form.featureIds.includes(f.id);
                    return (
                    <button
                        key={f.id}
                        type="button"
                        className={`px-3 py-2 rounded-lg border text-left text-sm ${
                        active ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                        setForm((prev) => {
                            const set = new Set(prev.featureIds);
                            active ? set.delete(f.id) : set.add(f.id);
                            return { ...prev, featureIds: Array.from(set) };
                        });
                        }}
                    >
                        <span className="flex items-start gap-2">
                            {f.icon && <span className="text-base leading-none">{f.icon}</span>}
                            <span className="flex-1">
                                <span className="block font-medium">{f.name}</span>
                                {f.description && (
                                    <span className={`block text-xs ${active ? "text-emerald-50" : "text-slate-500"}`}>
                                        {f.description}
                                    </span>
                                )}
                            </span>
                        </span>
                    </button>
                    );
                })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                type="submit"
                disabled={!canSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                Save changes
                </button>
                <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-4 py-2 rounded-lg border hover:bg-slate-50"
                >
                Cancel
                </button>
            </div>
            </form>
        )}
        </div>
    );
    }
