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
      const { data } = await Api.get("/products", {
        params: { page: p - 1, size: PAGE_SIZE, sort: "name,asc" },
      });
      const content = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
      const totalElements =
        typeof data?.totalElements === "number" ? data.totalElements : content.length;
      const totalPages =
        typeof data?.totalPages === "number"
          ? data.totalPages
          : Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
      setItems(content);
      setTotalPages(totalPages);
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
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;
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
        <Link to="/admin/products/new" className="px-3 py-2 rounded-lg border hover:bg-slate-50">
          Add product
        </Link>
      </div>

      {loading && <div className="text-sm text-slate-600">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto border rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
                <th>Id</th>
                <th>Name</th>
                <th className="w-40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2">{p.id}</td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/products/${p.id}/edit`}
                        className="px-2 py-1 rounded border hover:bg-slate-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="px-2 py-1 rounded border text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-slate-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Simple pager */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
            onClick={() => {
              setPage(1);
              load(1);
            }}
            disabled={page === 1}
          >
            ⏮ First
          </button>
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
            onClick={() => {
              const p = Math.max(1, page - 1);
              setPage(p);
              load(p);
            }}
            disabled={page === 1}
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-2 py-1 rounded border disabled:opacity-50"
            onClick={() => {
              const p = Math.min(totalPages, page + 1);
              setPage(p);
              load(p);
            }}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
