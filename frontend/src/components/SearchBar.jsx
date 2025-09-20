// src/components/SearchBar.jsx
import React, { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import CityAutocomplete from "./CityAutocomplete";

/**
 * Emits normalized search params to parent. Parent performs the API call.
 */
export default function SearchBar({ onSearch = () => {}, onReset = () => {} }) {
    const [q, setQ] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [city, setCity] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    function submit(e) {
        e.preventDefault();
        onSearch({
        q: q.trim() || undefined,
        categoryId: categoryId || undefined,
        cityId: city || undefined,
        startDate: start || undefined,
        endDate: end || undefined,
        page: 0,
        size: 10,
        });
    }

    function reset() {
        setQ(""); setCategoryId(""); setCity(""); setStart(""); setEnd("");
        onReset();
    }

    return (
        <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                placeholder="Hotel, glamping, loft..."
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
                className="w-full px-3 py-2 rounded-lg border"
            />
            </div>
            <div>
            <label className="block text-sm font-medium mb-1">End</label>
            <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
            />
            </div>
            <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800">
                Search
            </button>
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border hover:bg-slate-50">
                Reset
            </button>
            </div>
        </div>
        </form>
    );
}
