// src/pages/admin/ProductsAdmin.jsx
// Lists products and allows deleting. Pagination client-side (10 per page).

import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { httpDelete, httpGet } from '../../api/http';

const PAGE_SIZE = 10;

export default function ProductsAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    httpGet('/products')
      .then(data => {
        if (!mounted) return;
        setItems(Array.isArray(data) ? data : data?.content ?? []);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
    return () => (mounted = false);
  }, []);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  const onDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await httpDelete(`/products/${id}`);
      setItems(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  if (loading) return <p>Loading products…</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{items.length} total</p>
          <Link
            to="/admin/products/new"
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Category</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.id}</td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category?.name ?? p.categoryName ?? '-'}</td>
                <td className="p-3">{p.city?.name ?? p.cityName ?? '-'}</td>
                <td className="p-3">
                  {/* If you already have a product-create/edit page, link to it here */}
                  {/* <a href={`/admin/products/${p.id}/edit`} className="mr-2 underline">Edit</a> */}
                  <button
                    onClick={() => onDelete(p.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center gap-2">
        <button
          className="px-3 py-1 rounded border"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
