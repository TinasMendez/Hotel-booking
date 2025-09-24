// frontend/src/pages/admin/CategoriesAdmin.jsx
// Admin view for Categories with product counts and drill-down.
// - Reads counts from /admin/categories (AdminDashboardAPI.listCategoriesWithCount)
// - Robust: accepts productCount / productsCount / count / total / totalProducts, etc.
// - Drill-down calls /admin/categories/:id/products

import React, { useEffect, useState } from "react";
import Api, { AdminDashboardAPI } from "../../services/api.js";
import { useNavigate } from "react-router-dom";

export default function CategoriesAdmin() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]); // [{id,name,count}]
  const [error, setError] = useState("");

  // Drill-down
  const [openCatId, setOpenCatId] = useState(null);
  const [openCatName, setOpenCatName] = useState("");
  const [openCatProducts, setOpenCatProducts] = useState([]);
  const [loadingDrill, setLoadingDrill] = useState(false);

  const navigate = useNavigate();

  function pickCount(c) {
    const v =
      c?.productCount ??
      c?.productsCount ??
      c?.product_count ??
      c?.products_count ??
      c?.totalProducts ??
      c?.total_products ??
      c?.count ??
      c?.total ??
      0;
    const num = Number(v);
    return Number.isFinite(num) ? num : 0;
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await AdminDashboardAPI.listCategoriesWithCount();
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      const mapped = list.map((c) => ({
        id: c.id ?? c.categoryId ?? c.category_id,
        name: c.name ?? c.categoryName ?? c.category_name ?? "—",
        count: pickCount(c),
      }));

      setRows(mapped.sort((a, b) => (a.id || 0) - (b.id || 0)));
    } catch (e) {
      setError(e?.data?.message || e?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Drill-down handler
  async function onViewProducts(cat) {
    if (!cat?.id) return;
    // toggle
    if (openCatId === cat.id) {
      closeDrill();
      return;
    }
    setLoadingDrill(true);
    setOpenCatId(cat.id);
    setOpenCatName(cat.name);
    setOpenCatProducts([]);
    try {
      const list = await AdminDashboardAPI.listProductsByCategory(cat.id);
      const arr = Array.isArray(list)
        ? list
        : Array.isArray(list?.content)
          ? list.content
          : [];
      setOpenCatProducts(
        arr.map((p) => ({
          id: p.id,
          name: p.name,
        })),
      );
    } catch (e) {
      setOpenCatProducts([]);
    } finally {
      setLoadingDrill(false);
    }
  }

  function closeDrill() {
    setOpenCatId(null);
    setOpenCatName("");
    setOpenCatProducts([]);
  }

  async function onDelete(cat) {
    if (!cat?.id) return;
    const ok = window.confirm(
      `Delete category “${cat.name}”? This cannot be undone.`,
    );
    if (!ok) return;

    try {
      // FIX: usar Api.del para golpear http://localhost:8080/api y adjuntar token
      await Api.del(`/categories/${cat.id}`);
      await load();
      if (openCatId === cat.id) closeDrill();
    } catch (e) {
      alert(
        e?.data?.message ||
          e?.message ||
          "Could not delete category. Make sure it has no products or try again.",
      );
    }
  }

  return (
    <div className="space-y-6">
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
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm p-3 rounded">
          {error}
        </div>
      )}

      <div className="rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 w-24">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3 w-32"># Products</th>
              <th className="text-left px-4 py-3 w-64">Actions</th>
            </tr>
          </thead>
        <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-3">{c.id}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.count}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-gray-900 text-white text-xs"
                        onClick={() => onViewProducts(c)}
                      >
                        {openCatId === c.id ? "Close" : "View products"}
                      </button>
                      <button
                        type="button"
                        className={`px-3 py-1.5 rounded text-xs ${
                          c.count > 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-red-600 text-white"
                        }`}
                        disabled={c.count > 0}
                        onClick={() => onDelete(c)}
                        title={
                          c.count > 0
                            ? "Cannot delete a category with products"
                            : "Delete category"
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-4 py-2 text-xs text-gray-500">
          {rows.length} categories
        </div>
      </div>

      {/* Drill-down panel */}
      {openCatId && (
        <div className="rounded-lg border bg-white">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <h2 className="font-semibold text-sm">
              Products in “{openCatName}”
            </h2>
            <button
              type="button"
              onClick={closeDrill}
              className="px-3 py-1.5 rounded border text-sm"
            >
              Close
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-600">
                <th className="text-left px-4 py-3 w-24">ID</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingDrill ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Loading…
                  </td>
                </tr>
              ) : openCatProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No products in this category.
                  </td>
                </tr>
              ) : (
                openCatProducts.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded border text-xs"
                        onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
