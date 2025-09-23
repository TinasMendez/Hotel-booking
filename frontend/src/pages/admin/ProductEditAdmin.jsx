// frontend/src/pages/admin/ProductEditAdmin.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../../services/api.js";

export default function ProductEditAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  // reference data
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [features, setFeatures] = useState([]);

  // product data
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(""); // required by backend

  // Features (editable)
  const [productFeatures, setProductFeatures] = useState([]); // array of feature ids

  // Images (editable list of URLs; uploader optional)
  const [images, setImages] = useState([]); // [{id?, url, title?}]
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const fileRef = useRef(null);

  // keep original in case we need some fallbacks (not needed anymore, but harmless)
  const [originalProduct, setOriginalProduct] = useState(null);

  // helpers
  const normId = (obj) =>
    obj && typeof obj === "object"
      ? obj.id ?? obj.categoryId ?? obj.cityId ?? obj.featureId ?? null
      : null;

  const normalizeImage = (img) => {
    if (!img) return null;
    if (typeof img === "string") return { id: null, url: img, title: "" };
    if (typeof img === "object") {
      const id = img.id ?? img.imageId ?? img.uid ?? null;
      const url =
        img.url ||
        img.imageUrl ||
        img.link ||
        img.path ||
        img.location ||
        null;
      const title = img.title || img.name || "";
      if (!url) return null;
      return { id, url, title };
    }
    return null;
  };

  // load reference lists (public)
  async function loadRefs() {
    const [cats, cits, feats] = await Promise.all([
      Api.get("/categories", { auth: false }),
      Api.get("/cities", { auth: false }),
      Api.get("/features", { auth: false }),
    ]);
    const toArray = (d) =>
      Array.isArray(d) ? d : Array.isArray(d?.content) ? d.content : [];
    setCategories(toArray(cats));
    setCities(toArray(cits));
    setFeatures(toArray(feats));
  }

  // load product
  async function loadProduct() {
    const data = await Api.get(`/products/${id}`, { auth: false });
    setOriginalProduct(data);

    setName(data?.name ?? "");
    setDescription(data?.description ?? "");
    setPrice(
      data?.price !== undefined && data?.price !== null ? String(data.price) : "",
    );

    const catId =
      data?.categoryId ??
      data?.category?.id ??
      (typeof data?.category === "number" ? data.category : "");
    const ctId =
      data?.cityId ??
      data?.city?.id ??
      (typeof data?.city === "number" ? data.city : "");

    setCategoryId(catId ?? "");
    setCityId(ctId ?? "");

    // Address is required by backend. Try to read it if present; fallback empty and force user input.
    setAddress(
      (data && (data.address || data.location || "")) || ""
    );

    // features (prefer featureIds; fallback from features[])
    const featIds = Array.isArray(data?.featureIds)
      ? Array.from(data.featureIds)
      : Array.isArray(data?.features)
      ? data.features
          .map((f) =>
            typeof f === "number" ? f : f?.id ?? f?.featureId ?? null,
          )
          .filter(Boolean)
      : [];
    setProductFeatures(featIds);

    // images: prefer imageUrls + imageUrl primary; fallback entity images array
    let imgs = [];
    if (Array.isArray(data?.imageUrls) && data.imageUrls.length > 0) {
      imgs = data.imageUrls.map((u) => normalizeImage(u)).filter(Boolean);
    } else if (Array.isArray(data?.images)) {
      imgs = data.images.map(normalizeImage).filter(Boolean);
    } else {
      // last resort fallbacks (avoid if backend returns 500)
      try {
        const a = await Api.get(`/images`, {
          auth: false,
          params: { productId: id },
        });
        imgs = (Array.isArray(a) ? a : []).map(normalizeImage).filter(Boolean);
      } catch {
        /* ignore */
      }
    }

    // if backend also returns a primary imageUrl but not in list, add it at the front
    if (data?.imageUrl && !imgs.some((i) => i.url === data.imageUrl)) {
      imgs = [{ id: null, url: data.imageUrl, title: "" }, ...imgs];
    }

    setImages(imgs);
  }

  async function refreshImages() {
    try {
      const data = await Api.get(`/products/${id}`, { auth: false });
      let imgs = [];
      if (Array.isArray(data?.imageUrls) && data.imageUrls.length > 0) {
        imgs = data.imageUrls.map((u) => normalizeImage(u)).filter(Boolean);
      } else if (Array.isArray(data?.images)) {
        imgs = data.images.map(normalizeImage).filter(Boolean);
      }
      if (data?.imageUrl && !imgs.some((i) => i.url === data.imageUrl)) {
        imgs = [{ id: null, url: data.imageUrl, title: "" }, ...imgs];
      }
      setImages(imgs);
    } catch {
      // keep previous
    }
  }

  useEffect(() => {
    setLoading(true);
    setError("");
    (async () => {
      try {
        await Promise.all([loadRefs(), loadProduct()]);
      } catch (e) {
        setError(
          e?.data?.message || e?.message || "Failed to load product details.",
        );
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const featuresById = useMemo(() => {
    const map = new Map();
    features.forEach((f) => map.set(normId(f) ?? f.id ?? f.featureId, f));
    return map;
  }, [features]);

  // ====== SAVE (DTO-compliant) ======
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    // Build DTO exactly as backend expects
    const imageUrls = images.map((i) => i.url).filter(Boolean).slice(0, 5);
    const primary = imageUrls.length > 0 ? imageUrls[0] : null;

    const payload = {
      name: (name || "").trim(),
      description: (description || "").trim(),
      price: price === "" ? null : Number(price),
      imageUrl: primary,         // optional, but we send the first
      imageUrls,                 // required, 1..5
      address: (address || "").trim(), // required
      cityId: cityId ? Number(cityId) : null,
      categoryId: categoryId ? Number(categoryId) : null,
      featureIds: productFeatures.map((x) => Number(x)).filter(Boolean), // required, min 1
    };

    // Client-side checks aligned with @Valid
    if (!payload.name) {
      setSaving(false);
      setError("Name is required.");
      return;
    }
    if (!payload.description) {
      setSaving(false);
      setError("Description is required.");
      return;
    }
    if (payload.price === null || isNaN(payload.price) || payload.price <= 0) {
      setSaving(false);
      setError("Price must be a positive number.");
      return;
    }
    if (!payload.address) {
      setSaving(false);
      setError("Address is required.");
      return;
    }
    if (!payload.cityId || !payload.categoryId) {
      setSaving(false);
      setError("Please select category and city.");
      return;
    }
    if (!payload.featureIds || payload.featureIds.length === 0) {
      setSaving(false);
      setError("Select at least one feature.");
      return;
    }
    if (!payload.imageUrls || payload.imageUrls.length === 0) {
      setSaving(false);
      setError("At least one image is required.");
      return;
    }

    try {
      await Api.put(`/products/${id}`, payload);
      navigate("/admin/products");
      return;
    } catch (err) {
      setError(
        err?.data?.message ||
          err?.message ||
          "Could not save changes (validation failed).",
      );
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    navigate("/admin/products");
  }

  // ====== FEATURES UI ======
  function toggleFeature(fid) {
    setProductFeatures((prev) => {
      const s = new Set(prev.map(Number));
      const n = Number(fid);
      if (s.has(n)) s.delete(n);
      else s.add(n);
      return Array.from(s);
    });
  }

  // ====== IMAGES actions ======
  async function handleDeleteImage(image) {
    if (!image?.url) return;
    const ok = window.confirm("Delete this image from gallery?");
    if (!ok) return;

    setDeletingId(image.id || image.url);
    setUploadError("");

    // In this project, images are persisted from imageUrls via updateProduct(dto)
    // Deleting here means "remove from local list and then save()".
    setImages((prev) => prev.filter((i) => i.url !== image.url));
    setDeletingId(null);
  }

  async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    setUploadError("");

    try {
      const files = Array.from(fileList);

      const readers = await Promise.all(
        files.map(
          (f) =>
            new Promise((resolve, reject) => {
              // Basic size check
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
        const current = prev.map((p) => p.url);
        const additions = readers
          .map((r) => ({ id: null, url: r.url, title: r.name }))
          .filter((o) => !current.includes(o.url));
        const merged = [...prev, ...additions];
        // Cap to 5 as per DTO validation
        return merged.slice(0, 5);
      });
    } catch (e) {
      setUploadError(e?.message || "Could not process selected files.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // Drag & drop helpers
  const [isDragging, setIsDragging] = useState(false);
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

  // ========= UI =========
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit product</h1>

      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Row: name + category */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Product name"
                  className="w-full px-3 py-2 rounded border border-gray-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 rounded border border-gray-300"
                  value={categoryId || ""}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select a category…</option>
                  {categories.map((c) => (
                    <option key={c.id ?? normId(c)} value={c.id ?? normId(c)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row: city + price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  className="w-full px-3 py-2 rounded border border-gray-300"
                  value={cityId || ""}
                  onChange={(e) => setCityId(e.target.value)}
                  required
                >
                  <option value="">Select a city…</option>
                  {cities.map((c) => (
                    <option key={c.id ?? normId(c)} value={c.id ?? normId(c)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="w-full px-3 py-2 rounded border border-gray-300"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Address (required by backend) */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                placeholder="Street and number"
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={6}
                placeholder="Describe the product"
                className="w-full px-3 py-2 rounded border border-gray-300"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Features editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium">Features</label>
                <span className="text-xs text-gray-500">
                  Select at least one feature.
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                {features.map((f) => {
                  const fid = f.id ?? normId(f);
                  const checked = productFeatures.map(Number).includes(Number(fid));
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
            </div>

            {/* IMAGES */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Images</h2>
                <div className="text-xs text-gray-500">
                  At least 1 image. Up to 5 will be saved.
                </div>
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
                  className="px-3 py-2 rounded bg-gray-900 text-white disabled:opacity-60"
                  disabled={uploading}
                >
                  {uploading ? "Processing…" : "Add images"}
                </button>
                {uploadError && (
                  <span className="text-sm text-red-600">{uploadError}</span>
                )}
              </div>

              {/* Drag & Drop area */}
              <div
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                className={`border-2 border-dashed rounded-lg p-4 text-sm ${
                  isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
                }`}
              >
                Drag & drop images here, or click “Add images”.
              </div>

              {images.length === 0 ? (
                <p className="text-sm text-gray-500">No images yet.</p>
              ) : (
                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {images.map((img) => (
                    <li key={img.id || img.url} className="relative">
                      <div className="w-full h-28 rounded-lg overflow-hidden border bg-gray-50">
                        <img
                          src={img.url}
                          alt={img.title || "product image"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img)}
                        disabled={deletingId === (img.id || img.url)}
                        className="absolute top-2 right-2 px-2 py-1 rounded text-xs bg-red-600 text-white disabled:opacity-60"
                        title="Remove from gallery"
                      >
                        {deletingId === (img.id || img.url) ? "…" : "Remove"}
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
                onClick={onCancel}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
