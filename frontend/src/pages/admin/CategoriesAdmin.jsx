// /frontend/src/pages/admin/CategoriesAdmin.jsx
import { useEffect, useState } from "react";
import Api from "../../services/api";

/** Admin page to list and delete categories. */
export default function CategoriesAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await Api.getCategories();
      setList(Array.isArray(data) ? data : data.content ?? []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(catId) {
    const yes = confirm("Are you sure you want to delete this category?");
    if (!yes) return;
    try {
      await Api.deleteCategory(catId);
      await load();
    } catch (e) {
      alert(`Delete failed: ${e.message}`);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Categories</h2>
      {loading && <p>Loading...</p>}
      {err && <p className="text-red-600">Error: {err}</p>}

      {!loading && !err && (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-2">{c.id}</td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">
                  <button
                    onClick={() => onDelete(c.id)}
                    className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-700"
                    title="Delete category"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

