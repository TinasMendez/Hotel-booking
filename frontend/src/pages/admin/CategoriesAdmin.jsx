// src/pages/admin/CategoriesAdmin.jsx
// List + create + delete categories (title, description, imageUrl)

import React, { useEffect, useState } from 'react';
import { httpDelete, httpGet, httpPost } from '../../api/http';

export default function CategoriesAdmin() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const data = await httpGet('/categories');
      setItems(Array.isArray(data) ? data : data?.content ?? []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await httpPost('/categories', { title, description, imageUrl });
      setTitle(''); setDescription(''); setImageUrl('');
      await load();
    } catch (e) {
      alert('Create failed: ' + e.message);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await httpDelete(`/categories/${id}`);
      setItems(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Categories</h2>
      {loading && <p>Loading…</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {/* Create form */}
      <form onSubmit={onCreate} className="mb-4 bg-white p-4 rounded shadow grid gap-3">
        <h3 className="font-semibold">Add Category</h3>
        <div className="grid gap-1">
          <label className="text-sm">Title</label>
          <input className="border rounded p-2" required value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Description</label>
          <textarea className="border rounded p-2" required value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-1">
          <label className="text-sm">Image URL</label>
          <input className="border rounded p-2" required value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <div>
          <button className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black">Create</button>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">ID</th>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">Description</th>
              <th className="text-left p-3">Image</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.description}</td>
                <td className="p-3">
                  {c.imageUrl ? <a className="underline" href={c.imageUrl} target="_blank">Open</a> : '-'}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onDelete(c.id)}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No categories.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
