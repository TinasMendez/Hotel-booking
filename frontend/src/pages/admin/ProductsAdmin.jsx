// frontend/src/pages/admin/ProductsAdmin.jsx
// Lists products (≤10 per page), with Edit/Delete actions and confirmation.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Api from "../../services/api.js";

const PAGE_SIZE = 10;

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(p = page) {
    setLoading(true);
    setError("");
    try {
      // IMPORTANT: Api.get returns the JSON directly, not { data }
      const data = await Api.get("/products", {
        params: { page: p - 1, size: PAGE_SIZE, sort: "name,asc" },
      });

      const content = Array.isArray(data?.content)
        ? data.content
        : Array.isArray(data)
        ? data
        : [];

      const totalElements =
        typeof data?.totalElements === "number"
          ? data.totalElements
          : content.length;

      const totalPagesCalc =
        typeof data?.totalPages === "number"
          ? data.totalPages
          : Math.max(1, Math.ceil(totalElements / PAGE_SIZE));

      setItems(content);
      setTotalPages(totalPagesCalc);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await Api.delete(`/products/${id}`);
      await load(page);
    } catch {
      window.alert("Failed to delete product.");
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <Link
          to="/admin/products/new"
          className="px-3 py-2 rounded-md bg-gray-900 text-white"
        >
          + New
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr className="border-t" key={p.id}>
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-right space-x-2">
                    <Link
                      to={`/admin/products/${p.id}/edit`}
                      className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => {
                const next = page - 1;
                setPage(next);
                load(next);
              }}
            >
              ← Prev
            </button>
            <span>
              Page {page} / {totalPages}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                load(next);
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
