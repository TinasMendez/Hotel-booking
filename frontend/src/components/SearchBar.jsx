import { useEffect, useState } from "react";
import { getCategories } from "../services/categories";
import { getCities } from "../services/cities";

/**
 * Search bar with: text query, category, city, start and end dates.
 * - Calls onSearch({...}) with the complete filter object.
 */
export default function SearchBar({ defaultValues, onSearch }) {
    const [q, setQ] = useState(defaultValues?.q ?? "");
    const [categoryId, setCategoryId] = useState(defaultValues?.categoryId ?? "");
    const [cityId, setCityId] = useState(defaultValues?.cityId ?? "");
    const [start, setStart] = useState(defaultValues?.start ?? "");
    const [end, setEnd] = useState(defaultValues?.end ?? "");

    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        // Load categories and cities for the selects; ignore errors silently.
        (async () => {
        try {
            const cs = await getCategories();
            setCategories(cs || []);
        } catch {}
        try {
            const ct = await getCities();
            setCities(ct || []);
        } catch {}
        })();
    }, []);

    function submit(e) {
        e.preventDefault();
        onSearch?.({
        q: q.trim(),
        categoryId: categoryId || "",
        cityId: cityId || "",
        start: start || "",
        end: end || "",
        });
    }

    function reset() {
        setQ("");
        setCategoryId("");
        setCityId("");
        setStart("");
        setEnd("");
        onSearch?.({
        q: "",
        categoryId: "",
        cityId: "",
        start: "",
        end: "",
        });
    }

    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="md:col-span-2">
            <label className="block text-sm font-medium">Search</label>
            <input
            type="text"
            placeholder="Hotel, glamping, loft..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Category</label>
            <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            >
            <option value="">All</option>
            {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium">City</label>
            <select
            className="mt-1 w-full border rounded px-3 py-2"
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            >
            <option value="">All</option>
            {cities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            </select>
        </div>

        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div>
            <label className="block text-sm font-medium">Start</label>
            <input
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
                value={start}
                onChange={(e) => setStart(e.target.value)}
            />
            </div>
            <div>
            <label className="block text-sm font-medium">End</label>
            <input
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
            />
            </div>

            <div className="sm:col-span-3 flex items-end gap-2">
            <button
                type="submit"
                className="h-10 px-4 rounded bg-gray-900 text-white hover:bg-gray-800"
            >
                Search
            </button>
            <button
                type="button"
                onClick={reset}
                className="h-10 px-4 rounded border hover:bg-gray-50"
            >
                Reset
            </button>
            </div>
        </div>
        </form>
    );
}
