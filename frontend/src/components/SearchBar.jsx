// src/components/SearchBar.jsx
import React, { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import CityAutocomplete from "./CityAutocomplete";
import { getCategories } from "../services/categories";
import { getRandomProducts } from "../services/products";

/**
 * Emits normalized search params to parent. Parent performs the API call.
 */
export default function SearchBar({ onSearch = () => {}, onReset = () => {} }) {
    const [q, setQ] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [city, setCity] = useState(null);
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [quickSuggestions, setQuickSuggestions] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            const [categories, products] = await Promise.all([
            getCategories(),
            getRandomProducts(8),
            ]);
            if (cancelled) return;
            const combined = [];
            const seen = new Set();
            categories
            .filter((item) => item?.name)
            .forEach((item) => {
                const key = `category:${item.name.toLowerCase()}`;
                if (!seen.has(key)) {
                seen.add(key);
                combined.push({ type: "category", label: item.name });
                }
            });
            products
            .filter((item) => item?.title || item?.name)
            .forEach((item) => {
                const name = item.title || item.name;
                const key = `product:${name.toLowerCase()}`;
                if (!seen.has(key)) {
                seen.add(key);
                combined.push({ type: "product", label: name });
                }
            });
            setQuickSuggestions(combined.slice(0, 15));
        } catch (error) {
            if (!cancelled) {
            setQuickSuggestions([]);
            }
        }
        })();
        return () => {
        cancelled = true;
        };
    }, []);

    function submit(e) {
        e.preventDefault();
        onSearch({
        q: q.trim() || undefined,
        categoryId: categoryId || undefined,
        cityId: city?.id !== undefined && city?.id !== null ? String(city.id) : undefined,
        startDate: start || undefined,
        endDate: end || undefined,
        page: 0,
        size: 10,
        });
    }

    function reset() {
        setQ(""); setCategoryId(""); setCity(null); setStart(""); setEnd("");
        onReset();
    }

    return (
        <form onSubmit={submit} className="space-y-3">
        <div className="grid md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1" htmlFor="search-q">Search</label>
            <input
                id="search-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border"
                placeholder="Hotel, glamping, loft..."
                list={quickSuggestions.length ? "search-suggestions" : undefined}
                autoComplete="off"
            />
            {quickSuggestions.length > 0 && (
                <datalist id="search-suggestions">
                {quickSuggestions.map((item, index) => (
                    <option
                    key={`${item.type}-${index}`}
                    value={item.label}
                    label={`${item.type === "category" ? "Categoría" : "Producto"}: ${item.label}`}
                    />
                ))}
                </datalist>
            )}
            </div>
            <CategoryFilter value={categoryId} onChange={setCategoryId} />
            <CityAutocomplete value={city} onChange={setCity} placeholder="Todas" />
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
