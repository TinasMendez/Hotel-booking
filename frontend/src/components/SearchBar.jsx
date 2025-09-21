import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

/**
 * Search bar with debounced autocomplete and double date inputs.
 * - A11y: focus-ring on inputs/button, proper roles, aria attributes.
 * - Styling: Tailwind utilities only (no inline <style>).
 * - Compatibility: supports onSearch (preferred) and onSubmit props.
 */
export default function SearchBar({ onSearch, onSubmit }) {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(null);
  const [debouncedQ, setDebouncedQ] = useState("");

  // Debounce query to reduce network chatter
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQ || debouncedQ.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    api
      .get(`/api/v1/products/suggest`, {
        params: { q: debouncedQ },
        signal: ctrl.signal,
      })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        setSuggestions(list);
        setOpen(list.length > 0);
      })
      .catch(() => {
        setSuggestions([]);
        setOpen(false);
      });

    return () => ctrl.abort();
  }, [debouncedQ]);

  function handleSubmit(e) {
    e.preventDefault();
    setOpen(false);
    const payload = { q, startDate: from, endDate: to, from, to };
    // Prefer onSearch; fallback to onSubmit for backward compatibility
    if (typeof onSearch === "function") onSearch(payload);
    else if (typeof onSubmit === "function") onSubmit(payload);
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="w-full">
        {/* Grid: query, from, to, submit. Stacks on small screens */}
        <div className="grid grid-cols-[1fr_160px_160px_120px] gap-3 max-[900px]:grid-cols-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, city or category"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => suggestions.length && setOpen(true)}
              aria-autocomplete="list"
              aria-expanded={open}
              aria-controls="search-suggestions"
              className="input focus-ring"
            />
            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
              <ul
                id="search-suggestions"
                role="listbox"
                className="absolute z-20 top-full left-0 right-0 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white shadow-md"
              >
                {suggestions.map((sug, idx) => (
                  <li
                    key={`${sug.id ?? sug.name ?? idx}-${idx}`}
                    role="option"
                    tabIndex={-1}
                    className="px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 cursor-pointer"
                    onMouseDown={() => {
                      // onMouseDown keeps focus on the input after click
                      setQ(sug.name || sug.title || "");
                      setOpen(false);
                    }}
                  >
                    {sug.name || sug.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
            className="input focus-ring"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
            className="input focus-ring"
          />
          <button type="submit" className="btn-primary focus-ring">
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
