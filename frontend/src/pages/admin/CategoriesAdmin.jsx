// frontend/src/pages/admin/CategoriesAdmin.jsx
// Admin: list categories with product counts, view products in a category,
// and delete a category only when it's not in use (count === 0).

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api, { AdminDashboardAPI } from "../../services/api.js";

export default function CategoriesAdmin() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [catProducts, setCatProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Normalize the count property name (productCount | count | numProducts)
  const getCount = (c) =>
    Number(
      c?.productCount ?? c?.count ?? c?.numProducts ?? c?.total ?? 0,
    );

  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      const data = await AdminDashboardAPI.listCategoriesWithCount();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setCategories(list);
    } catch (e) {
      setError(e?.data?.message || e?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  async function loadProductsFor(cat) {
    if (!cat?.id) return;
    setLoadingProducts(true);
    try {
      const list = await AdminDashboardAPI.listProductsByCategory(cat.id);
      setCatProducts(Array.isArray(list) ? list : []);
    } catch (e) {
      setCatProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // When selected category changes, load its products
  useEffect(() => {
    if (selectedCat) loadProductsFor(selectedCat);
  }, [selectedCat?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(cat) {
    if (!cat?.id) return;
    const count = getCount(cat);
    if (count > 0) return; // safety
    const ok = window.confirm(
      `Delete category "${cat.name}"? This action cannot be undone.`,
    );
    if (!ok) return;

    setSaving(true);
    setError("");
    try {
      await Api.del(`/categories/${cat.id}`); // requires ADMIN
      // If we were viewing this category's products, clear panel
      if (selectedCat?.id === cat.id) {
        setSelectedCat(null);
        setCatProducts([]);
      }
      // Refresh list
      await loadCategories();
    } catch (e) {
      setError(
        e?.data?.message ||
          e?.message ||
          "Could not delete category. It may be in use.",
      );
    } finally {
      setSaving(false);
    }
  }

  const totalCategories = useMemo(() => categories.length, [categories]);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          type="button"
          onClick={() => navigate("/admin/categories/new")}
          className="px-3 py-2 rounded bg-gray-900 text-white"
        >
          + New
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-2 font-semibold">ID</th>
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold"># Products</th>
                <th className="px-4 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((c) => {
                  const count = getCount(c);
                  const canDelete = count === 0 && !saving;
                  return (
                    <tr
                      key={c.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2">{c.id}</td>
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{count}</td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCat(c)}
                          className="px-3 py-1 rounded bg-gray-900 text-white"
                        >
                          View products
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(c)}
                          disabled={!canDelete}
                          title={
                            count > 0
                              ? "Cannot delete: category has products."
                              : "Delete category"
                          }
                          className={`px-3 py-1 rounded ${
                            canDelete
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-red-200 text-white cursor-not-allowed"
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="px-4 py-3 text-xs text-gray-500 border-t">
            {totalCategories} categories
          </div>
        )}
      </div>

      {/* Drill-down: products in selected category */}
      {selectedCat && (
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="text-base font-semibold">
              Products in “{selectedCat.name}”
            </h2>
            <button
              type="button"
              onClick={() => {
                setSelectedCat(null);
                setCatProducts([]);
              }}
              className="text-sm px-3 py-1 rounded border"
            >
              Close
            </button>
          </div>

          {loadingProducts ? (
            <div className="p-4 text-sm text-gray-500">Loading products…</div>
          ) : catProducts.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No products.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600">
                    <th className="px-4 py-2 font-semibold">ID</th>
                    <th className="px-4 py-2 font-semibold">Name</th>
                    <th className="px-4 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {catProducts.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{p.id}</td>
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                          className="px-3 py-1 rounded border"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
