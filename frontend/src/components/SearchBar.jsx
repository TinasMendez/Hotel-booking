// frontend/src/components/SearchBar.jsx
import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import CityAutocomplete from "./CityAutocomplete";

/** Emits normalized search params to parent. Parent performs the API call. */
export default function SearchBar({ onSearch = () => {}, onReset = () => {} }) {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [city, setCity] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function submit(e) {
    e.preventDefault();
    const params = {
      q: q.trim() || undefined,
      categoryId: categoryId || undefined,
      city: city || undefined,
      start: start || undefined,
      end: end || undefined,
      page: 0,
      size: 10,
    };
    onSearch(params);
  }

  function reset() {
    setQ(""); setCategoryId(""); setCity(""); setStart(""); setEnd("");
    onReset();
  }

  return (
    <div className="card p-4">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="input"
              placeholder="Hotel, glamping, loft..."
              aria-label="Search by name or description"
            />
          </div>
          <CategoryFilter value={categoryId} onChange={setCategoryId} />
          <CityAutocomplete value={city} onChange={setCity} />
        </div>

        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Start</label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary w-full md:w-auto">Search</button>
            <button type="button" onClick={reset} className="btn-outline w-full md:w-auto">Reset</button>
          </div>
        </div>
      </form>
    </div>
  );
}
