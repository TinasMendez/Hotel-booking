// src/pages/admin/ProductsAdmin.jsx
// Lists products and allows deleting. Now uses API pagination (page/size/sort).

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { httpDelete, httpGet } from '../../api/http';
import { useToast } from '../../shared/ToastProvider.jsx';
import { getApiErrorMessage, normalizeApiError } from '../../utils/apiError.js';

const PAGE_SIZE = 10;

export default function ProductsAdmin() {
  const toast = useToast();
  const { formatMessage } = useIntl();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [reloadStamp, setReloadStamp] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        const data = await httpGet('/products', {
          params: {
            page: Math.max(0, page - 1),
            size: PAGE_SIZE,
            sort: 'name,asc',
          },
        });

        if (cancelled) return;
        const content = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
            ? data.content
            : [];
        const total = typeof data?.totalElements === 'number' ? data.totalElements : content.length;
        const pages = typeof data?.totalPages === 'number' ? data.totalPages : Math.max(1, Math.ceil(total / PAGE_SIZE));

        setItems(content);
        setTotalElements(total);
        setTotalPages(Math.max(1, pages));
      } catch (error) {
        if (cancelled) return;
        const normalized = normalizeApiError(error, formatMessage({ id: 'errors.generic' }));
        const message = getApiErrorMessage(normalized, formatMessage, formatMessage({ id: 'errors.generic' }));
        setErr(message);
        toast?.error(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, reloadStamp]);

  const onDelete = async (id) => {
    const confirmed = window.confirm(formatMessage({ id: 'admin.products.confirmDelete', defaultMessage: 'Are you sure you want to delete this product?' }));
    if (!confirmed) return;
    try {
      await httpDelete(`/products/${id}`);
      const nextTotal = Math.max(0, totalElements - 1);
      const nextTotalPages = Math.max(1, Math.ceil(nextTotal / PAGE_SIZE));
      const targetPage = Math.min(page, nextTotalPages);
      setTotalElements(nextTotal);
      setTotalPages(nextTotalPages);
      if (targetPage !== page) {
        setPage(targetPage);
      } else {
        setReloadStamp(stamp => stamp + 1);
      }
      toast?.success(formatMessage({ id: 'admin.products.deleteSuccess', defaultMessage: 'Product deleted successfully.' }));
    } catch (e) {
      const normalized = normalizeApiError(e, formatMessage({ id: 'errors.generic' }));
      const message = getApiErrorMessage(normalized, formatMessage, e?.message);
      toast?.error(message || formatMessage({ id: 'errors.generic' }));
    }
  };

  if (loading) return <p>Loading products…</p>;
  if (err) return <p className="text-red-600">Error: {err}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-500">{totalElements} {formatMessage({ id: 'admin.products.total', defaultMessage: 'total' })}</p>
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
            {items.map(p => (
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
            {items.length === 0 && (
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
          onClick={() => setPage(1)}
        >
          First
        </button>
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
