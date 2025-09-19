import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../services/api";
import { useToast } from "../../shared/ToastProvider.jsx";

const MAX_IMAGES = 5;

export default function ProductCreateAdmin() {
  const navigate = useNavigate();
  const toast = useToast();

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);

  const [loadingMeta, setLoadingMeta] = useState(true);
  const [metaError, setMetaError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    address: "",
    cityId: "",
    categoryId: "",
    featureIds: [],
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoadingMeta(true);
      setMetaError("");
      const resolveList = (payload) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload.content)) return payload.content;
        return [];
      };
      try {
        const [catRes, cityRes, featRes] = await Promise.all([
          Api.get("/categories"),
          Api.get("/cities"),
          Api.get("/features"),
        ]);
        if (!active) return;
        setCategories(resolveList(catRes?.data));
        setCities(resolveList(cityRes?.data));
        setFeatures(resolveList(featRes?.data));
      } catch (e) {
        if (!active) return;
        setMetaError(e?.message || "Failed to load metadata");
      } finally {
        if (active) setLoadingMeta(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const canUploadMore = imageUrls.length < MAX_IMAGES;

  const isValid = useMemo(() => {
    if (!form.name.trim()) return false;
    if (!form.description.trim()) return false;
    if (!form.price || Number(form.price) <= 0) return false;
    if (!form.cityId || !form.categoryId) return false;
    if (!form.address.trim()) return false;
    if (!form.featureIds.length) return false;
    if (!imageUrls.length) return false;
    return true;
  }, [form, imageUrls]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleFeature(id) {
    setForm((prev) => {
      const set = new Set(prev.featureIds);
      if (set.has(id)) {
        set.delete(id);
      } else {
        set.add(id);
      }
      return { ...prev, featureIds: Array.from(set) };
    });
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = MAX_IMAGES - imageUrls.length;
    const slice = files.slice(0, remaining);
    if (!slice.length) return;
    setUploading(true);
    setSubmitError("");
    try {
      for (const file of slice) {
        const res = await Api.uploadProductImage(file);
        const url = res?.url;
        if (url) {
          setImageUrls((prev) => [...prev, url]);
        }
      }
      toast?.success("Images uploaded");
    } catch (err) {
      const message = err?.message || "Upload failed";
      setSubmitError(message);
      toast?.error(message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url) {
    setImageUrls((prev) => prev.filter((item) => item !== url));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        address: form.address.trim(),
        cityId: Number(form.cityId),
        categoryId: Number(form.categoryId),
        featureIds: form.featureIds.map((id) => Number(id)),
        imageUrl: imageUrls[0],
        imageUrls,
      };
      await Api.post("/products", payload);
      toast?.success("Product created");
      navigate("/admin/products");
    } catch (err) {
      const status = err?.response?.status;
      let message;
      if (status === 409) {
        message = "Name already in use. Please choose a different product name.";
      } else {
        message = err?.response?.data?.message || err?.message || "Create failed";
      }
      setSubmitError(message);
      toast?.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Create product</h2>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 rounded border"
        >
          Back
        </button>
      </div>

      {loadingMeta && <p>Loading data...</p>}
      {metaError && <p className="text-red-600">{metaError}</p>}

      <form
        className="space-y-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-100"
        onSubmit={handleSubmit}
      >
        <section className="grid md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Name</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Price (USD)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              rows={4}
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Address</span>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">City</span>
            <select
              name="cityId"
              value={form.cityId}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Category</span>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="rounded border px-3 py-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Features</h3>
          <div className="grid md:grid-cols-3 gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            {features.map((feature) => {
              const selected = form.featureIds.includes(feature.id);
              return (
                <label key={feature.id} className="flex items-center gap-2 border rounded px-3 py-2 bg-white">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleFeature(feature.id)}
                  />
                  <span>{feature.name}</span>
                </label>
              );
            })}
            {!features.length && (
              <p className="text-sm text-gray-500">No features available</p>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold">Gallery ({imageUrls.length}/{MAX_IMAGES})</h3>
          <div className="flex flex-wrap gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-4">
            {imageUrls.map((url) => (
              <div key={url} className="relative w-32 h-32 border rounded overflow-hidden">
                <img src={url} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-2"
                >
                  ×
                </button>
              </div>
            ))}
            {canUploadMore && (
              <label className="w-32 h-32 border-dashed border-2 border-gray-300 flex flex-col items-center justify-center rounded cursor-pointer text-sm text-gray-500 bg-white">
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        </section>

        {submitError && <p className="text-red-600">{submitError}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Create product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
