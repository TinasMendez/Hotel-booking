// frontend/src/pages/admin/CategoriesAdmin.jsx
// Shows categories with product count and allows drilling down into the products of a selected category.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../services/api.js";
import { AdminDashboardAPI } from "../../services/api.js";

export default function CategoriesAdmin() {
  // --- State ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null); // selected category object
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [errorProducts, setErrorProducts] = useState("");

  // --- Load categories (with count) ---
  async function loadCategories() {
    setLoading(true);
    setError("");
    try {
      // Prefer admin endpoint with counts for better UX
      const rows = await AdminDashboardAPI.listCategoriesWithCount();
      // Fallback: if admin endpoint not available for any reason, use public
      if (!Array.isArray(rows) || rows.length === 0) {
        const pub = await Api.get("/categories", { auth: false });
        const list = Array.isArray(pub) ? pub : pub?.content ?? [];
        setCategories(
          list.map((c) => ({
            id: c.id,
            name: c.name,
            productsCount: "-",
          })),
        );
      } else {
        setCategories(rows);
      }
    } catch (e) {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  // --- Load products for selected category ---
  async function loadProductsByCategory(cat) {
    if (!cat) return;
    setLoadingProducts(true);
    setErrorProducts("");
    try {
      const rows = await AdminDashboardAPI.listProductsByCategory(cat.id);
      setProducts(Array.isArray(rows) ? rows : []);
    } catch (e) {
      setErrorProducts("Failed to load products for this category.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selected) loadProductsByCategory(selected);
  }, [selected]);

  // --- Render ---
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link
          to="/admin/categories/new"
          className="px-3 py-2 rounded-md bg-gray-900 text-white"
        >
          + New
        </Link>
      </div>

      {/* Categories list */}
      <div className="rounded-xl bg-white shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading…</p>
        ) : error ? (
          <p className="p-4 text-red-600">{error}</p>
        ) : categories.length === 0 ? (
          <p className="p-4">No categories.</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2"># Products</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.name}</td>
                  <td className="px-3 py-2">{c.productsCount}</td>
                  <td className="px-3 py-2">
                    <button
                      className="px-3 py-1 rounded bg-gray-900 text-white"
                      onClick={() => setSelected(c)}
                    >
                      View products
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Drill-down panel */}
      {selected && (
        <div className="rounded-xl bg-white shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">
              Products in “{selected.name}”
            </h2>
            <div className="space-x-2">
              <button
                className="text-sm px-3 py-1 rounded border"
                onClick={() => loadProductsByCategory(selected)}
                title="Reload products"
              >
                Reload
              </button>
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={() => {
                  setSelected(null);
                  setProducts([]);
                }}
              >
                Close
              </button>
            </div>
          </div>

          {loadingProducts ? (
            <p>Loading products…</p>
          ) : errorProducts ? (
            <p className="text-red-600">{errorProducts}</p>
          ) : products.length === 0 ? (
            <p>No products in this category.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="px-3 py-2">{p.id}</td>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          to={`/admin/products/${p.id}/edit`}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          Edit
                        </Link>
                        {/* If you want a public view link:
                        <a
                          href={`/product/${p.id}`}
                          className="ml-2 px-3 py-1 rounded bg-white border hover:bg-gray-50"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a> */}
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
