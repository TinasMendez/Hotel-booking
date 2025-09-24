// frontend/src/pages/admin/CitiesAdmin.jsx
import React, { useEffect, useState } from "react";
import { CitiesAPI } from "../../services/api.js";

export default function CitiesAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // form
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  // inline edits
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCountry, setEditCountry] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await CitiesAPI.list();
      const arr = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
      setList(arr);
    } catch (e) {
      setErr(e?.data?.message || e?.message || "Failed to load cities");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;
    try {
      const created = await CitiesAPI.create({ name: name.trim(), country: country.trim() || undefined });
      setList((prev) => [...prev, created]);
      setName("");
      setCountry("");
    } catch (e) {
      alert(e?.data?.message || e?.message || "Could not create city");
    }
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditName(c.name || "");
    setEditCountry(c.country || "");
  }

  async function saveEdit(id) {
    try {
      const updated = await CitiesAPI.update(id, { name: editName.trim(), country: editCountry.trim() || undefined });
      setList((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setEditingId(null);
    } catch (e) {
      alert(e?.data?.message || e?.message || "Could not update city");
    }
  }

  async function remove(id) {
    if (!confirm("Delete this city?")) return;
    try {
      await CitiesAPI.remove(id);
      setList((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert(e?.data?.message || e?.message || "Could not delete city");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Cities</h2>

      {/* Create */}
      <div className="bg-white rounded-md shadow p-4 space-y-3">
        <h3 className="font-medium">Add City</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="text"
            className="px-3 py-2 rounded border"
            placeholder="City name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="px-3 py-2 rounded border"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button className="px-3 py-2 rounded bg-emerald-600 text-white" onClick={create}>
            Create
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Country</th>
              <th className="text-left px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-4" colSpan={4}>Loading…</td></tr>
            ) : err ? (
              <tr><td className="px-4 py-4 text-red-600" colSpan={4}>{err}</td></tr>
            ) : list.length === 0 ? (
              <tr><td className="px-4 py-4" colSpan={4}>No cities</td></tr>
            ) : (
              list.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-4 py-2">{c.id}</td>
                  <td className="px-4 py-2">
                    {editingId === c.id ? (
                      <input className="px-2 py-1 rounded border w-full" value={editName} onChange={(e) => setEditName(e.target.value)} />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === c.id ? (
                      <input className="px-2 py-1 rounded border w-full" value={editCountry} onChange={(e) => setEditCountry(e.target.value)} />
                    ) : (
                      c.country || "—"
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    {editingId === c.id ? (
                      <>
                        <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={() => saveEdit(c.id)}>Save</button>
                        <button className="px-3 py-1 rounded border" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="px-3 py-1 rounded border" onClick={() => startEdit(c)}>Edit</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={() => remove(c.id)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
