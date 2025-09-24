// frontend/src/pages/admin/ProductEditAdmin.jsx
// Edit a product to match backend ProductRequestDTO.
// Address removed from UI and payload (optional in backend).
// Requires ADMIN auth for PUT /products/:id.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../services/api.js";

export default function ProductEditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Reference data
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);

  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [featureIds, setFeatureIds] = useState([]); // numbers

  // Gallery
  const [images, setImages] = useState([]); // [{url}]
  const [newImageUrl, setNewImageUrl] = useState("");
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load reference data & product
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [cats, cits, feats, prod] = await Promise.all([
          Api.get("/categories", { auth: false }),
          Api.get("/cities", { auth: false }),
          Api.get("/features", { auth: false }),
          Api.get(`/products/${id}`, { auth: false }),
        ]);
        const asArr = (d) =>
          Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
        setCategories(asArr(cats));
        setCities(asArr(cits));
        setFeatures(asArr(feats));

        // Prefill
        setName(prod.name || "");
        setPrice(prod.price ?? "");
        setDescription(prod.description || "");
        setCategoryId(prod.categoryId || "");
        setCityId(prod.cityId || "");
        const fids =
          Array.isArray(prod.featureIds) && prod.featureIds.length > 0
            ? Array.from(prod.featureIds)
            : (prod.features || []).map((f) => f.id);
        setFeatureIds(fids || []);

        const gallery = Array.isArray(prod.imageUrls) ? prod.imageUrls : [];
        const primary = prod.imageUrl && !gallery.includes(prod.imageUrl)
          ? [prod.imageUrl, ...gallery]
          : gallery.length > 0
            ? gallery
            : prod.imageUrl
              ? [prod.imageUrl]
              : [];
        setImages(primary.map((u) => ({ url: u })).slice(0, 5));
      } catch (e) {
        setError(e?.data?.message || e?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const featuresById = useMemo(() => {
    const m = new Map();
    features.forEach((f) => m.set(f.id ?? f.featureId, f));
    return m;
  }, [features]);

  // Helpers
  function toggleFeature(fid) {
    const n = Number(fid);
    setFeatureIds((prev) => {
      const s = new Set(prev.map(Number));
      if (s.has(n)) s.delete(n);
      else s.add(n);
      return Array.from(s);
    });
  }

  function addImageUrl() {
    const u = newImageUrl.trim();
    if (!u) return;
    setImages((prev) => {
      const merged = [...prev, { url: u }];
      return merged.slice(0, 5);
    });
    setNewImageUrl("");
  }

  async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    try {
      const readers = await Promise.all(
        files.map(
          (f) =>
            new Promise((resolve, reject) => {
              if (f.size > 15 * 1024 * 1024) {
                reject(new Error(`File "${f.name}" is larger than 15MB.`));
                return;
              }
              const fr = new FileReader();
              fr.onload = () => resolve({ name: f.name, url: fr.result });
              fr.onerror = reject;
              fr.readAsDataURL(f);
            }),
        ),
      );
      setImages((prev) => {
        const merged = [...prev, ...readers.map((r) => ({ url: r.url }))];
        return merged.slice(0, 5);
      });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(e.dataTransfer.files);
  }
  function onDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragLeave() {
    setIsDragging(false);
  }

  function removeImage(u) {
    setImages((prev) => prev.filter((i) => i.url !== u));
  }

  // Save
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const imageUrls = images.map((i) => i.url).filter(Boolean).slice(0, 5);
    const primary = imageUrls.length > 0 ? imageUrls[0] : null;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: price === "" ? null : Number(price),
      imageUrl: primary,
      imageUrls,
      // address removed
      cityId: cityId ? Number(cityId) : null,
      categoryId: categoryId ? Number(categoryId) : null,
      featureIds: featureIds.map(Number),
    };

    if (!payload.name) return stopWith("Name is required.");
    if (!payload.description) return stopWith("Description is required.");
    if (payload.price === null || isNaN(payload.price) || payload.price <= 0)
      return stopWith("Price must be a positive number.");
    if (!payload.cityId || !payload.categoryId)
      return stopWith("Please select category and city.");
    if (!payload.featureIds || payload.featureIds.length === 0)
      return stopWith("Select at least one feature.");
    if (!payload.imageUrls || payload.imageUrls.length === 0)
      return stopWith("Add at least one image to the gallery.");

    try {
      await Api.put(`/products/${id}`, payload);
      navigate("/admin/products");
    } catch (e2) {
      setError(
        e2?.data?.message || e2?.message || "Could not update product (validation failed).",
      );
    } finally {
      setSaving(false);
    }
  }

  function stopWith(msg) {
    setSaving(false);
    setError(msg);
  }

  // UI
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit product</h1>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-3 py-2 rounded border"
        >
          Back
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Name + Price */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (USD)</label>
              <input
                type="number"
                min="1"
                step="0.01"
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 120"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 rounded border border-gray-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product"
              required
            />
          </div>

          {/* City + Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <select
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={cityId || ""}
                onChange={(e) => setCityId(e.target.value)}
                required
              >
                <option value="">Select a city</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.country ? ` — ${c.country}` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={categoryId || ""}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Features</label>
              <span className="text-xs text-gray-500">
                Select at least one feature.
              </span>
            </div>

            {features.length === 0 ? (
              <div className="px-3 py-2 rounded border bg-gray-50 text-sm text-gray-500">
                No features available
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {features.map((f) => {
                  const fid = f.id ?? f.featureId;
                  const checked = featureIds.map(Number).includes(Number(fid));
                  return (
                    <label key={fid} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(fid)}
                      />
                      <span>{f.name}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Gallery */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">
                Gallery ({images.length}/5)
              </h2>
              <div className="text-xs text-gray-500">At least 1 image required.</div>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-3 py-2 rounded bg-gray-900 text-white"
              >
                Add images
              </button>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="px-2 py-2 rounded border w-72"
                  placeholder="Paste image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-3 py-2 rounded border"
                >
                  Add URL
                </button>
              </div>
            </div>

            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`border-2 border-dashed rounded-lg p-4 text-sm ${
                isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
              }`}
            >
              Drag & drop images here, or use “Add images”.
            </div>

            {images.length > 0 && (
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map((img) => (
                  <li key={img.url} className="relative">
                    <div className="w-full h-28 rounded-lg overflow-hidden border bg-gray-50">
                      <img
                        src={img.url}
                        alt="product"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.url)}
                      className="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
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
      )}
    </div>
  );
}
