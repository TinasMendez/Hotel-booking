import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

/**
 * Search bar with debounced autocomplete and double date inputs.
 * Meets Sprint 3 HU#22. Uses GET /api/v1/products/suggest?q=
 */
export default function SearchBar({ onSubmit }) {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef(null);
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 250);
    return () => clearTimeout(t);
  }, [q]);

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

  function submit(e) {
    e.preventDefault();
    setOpen(false);
    if (typeof onSubmit === "function") onSubmit({ q, from, to });
  }

  return (
    <div className="searchbar">
      <form onSubmit={submit}>
        <div className="row">
          <input
            type="text"
            placeholder="Search by name, city or category"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => suggestions.length && setOpen(true)}
            aria-autocomplete="list"
            aria-expanded={open}
          />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            aria-label="From date"
          />
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            aria-label="To date"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="suggestions" role="listbox">
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              role="option"
              onMouseDown={() => {
                setQ(sug.name || sug.title || "");
                setOpen(false);
              }}
            >
              {sug.name || sug.title}
            </li>
          ))}
        </ul>
      )}

      <style>
        {`
        .searchbar { position:relative; }
        .row{ display:grid; grid-template-columns: 1fr 160px 160px 120px; gap:.75rem; }
        .suggestions{
          position:absolute; z-index:20; top:100%; left:0; right:0;
          background:#fff; border:1px solid #eee; border-radius:8px; margin:.25rem 0 0; padding:.5rem 0;
          max-height:260px; overflow:auto; list-style:none;
        }
        .suggestions li{ padding:.5rem .75rem; cursor:pointer; }
        .suggestions li:hover{ background:#f6f6f6; }
        @media (max-width:900px){
          .row{ grid-template-columns: 1fr; }
        }
      `}
      </style>
    </div>
  );
}
