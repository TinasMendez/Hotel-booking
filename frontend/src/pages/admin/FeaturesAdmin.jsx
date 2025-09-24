// frontend/src/pages/admin/FeaturesAdmin.jsx
// Admin - Manage Features WITHOUT "icon" field in the UI,

import React, { useEffect, useState } from "react";
import Api from "../../services/api.js";

export default function FeaturesAdmin() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // keep the current (hidden) icon when editing, or fallback to "-"
  const [currentIcon, setCurrentIcon] = useState("-");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      // GET /api/features is public (permitAll en SecurityConfig)
      const data = await Api.get("/features", { auth: false });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
        ? data.content
        : [];
      setFeatures(
        list.map((f) => ({
          id: f.id,
          name: f.name,
          description: f.description || "",
          // we keep icon internally to avoid breaking PUT validation
          icon: f.icon || "-",
        }))
      );
    } catch (e) {
      setErr(e?.data?.message || e?.message || "Failed to load features.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setCurrentIcon("-");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!name.trim()) {
      setErr("Name is required.");
      return;
    }

    // Backend likely requires `icon` -> send existing or placeholder
    const payload = {
      name: name.trim(),
      description: description.trim(),
      icon: (currentIcon && currentIcon.trim()) || "-",
    };

    try {
      if (editingId) {
        await Api.put(`/features/${editingId}`, payload);
      } else {
        // for create, force a benign placeholder if nothing is set
        payload.icon = "-";
        await Api.post("/features", payload);
      }
      resetForm();
      await load();
    } catch (e) {
      setErr(
        e?.data?.message ||
          e?.message ||
          "Could not save feature. Please try again."
      );
    }
  }

  function onEdit(feature) {
    setEditingId(feature.id);
    setName(feature.name || "");
    setDescription(feature.description || "");
    // keep whatever icon is stored in backend, we don't show it
    setCurrentIcon(feature.icon || "-");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(feature) {
    const ok = window.confirm(`Delete feature “${feature.name}”?`);
    if (!ok) return;
    try {
      await Api.del(`/features/${feature.id}`);
      if (editingId === feature.id) resetForm();
      await load();
    } catch (e) {
      alert(
        e?.data?.message || e?.message || "Could not delete feature right now."
      );
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <section className="rounded-lg border bg-white">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="font-semibold">
            {editingId ? "Edit Feature" : "Add Feature"}
          </h2>
        </div>

        {err && (
          <div className="mx-4 mt-4 mb-0 border border-red-200 bg-red-50 text-red-700 text-sm p-3 rounded">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded border"
              placeholder="Feature name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          {/* Icon field intentionally hidden from UI */}

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 rounded border"
              placeholder="Describe the feature"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {editingId ? "Save changes" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-lg border bg-white">
        <div className="px-4 py-3 border-b bg-gray-50">
          <h2 className="font-semibold">Features</h2>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="text-left px-4 py-3 w-24">ID</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Description</th>
              <th className="text-left px-4 py-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : features.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No features found.
                </td>
              </tr>
            ) : (
              features.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-3">{f.id}</td>
                  <td className="px-4 py-3">{f.name}</td>
                  <td className="px-4 py-3">
                    {f.description ? (
                      <span className="text-gray-700">{f.description}</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded border text-xs"
                        onClick={() => onEdit(f)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded bg-red-600 text-white text-xs"
                        onClick={() => onDelete(f)}
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
      </section>
    </div>
  );
}
