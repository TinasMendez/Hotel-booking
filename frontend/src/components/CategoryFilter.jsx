// frontend/src/components/CategoryFilter.jsx
import React, { useEffect, useState } from "react";
import { getCategories } from "../services/products.js";

/** Controlled select. Emits the selected category id (string) or "" for All. */
export default function CategoryFilter({ value = "", onChange = () => {} }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const data = await getCategories();
        if (!off) setList(Array.isArray(data) ? data : []);
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => {
      off = true;
    };
  }, []);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">Category</label>
      <select
        className="w-full px-3 py-2 rounded-lg border"
        value={value}
        disabled={loading}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {list.map((c) => (
          <option key={c.id} value={String(c.id)}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
