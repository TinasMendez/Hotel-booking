// src/components/CityAutocomplete.jsx
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { getCities } from "../services/cities";

/**
 * Autocompletado accesible para seleccionar una ciudad.
 * Recibe la ciudad seleccionada (objeto o null) y devuelve la ciudad completa al seleccionar.
 */
export default function CityAutocomplete({
  value = null,
  onChange = () => {},
  placeholder = "Todas",
  label = "City",
  name = "city",
}) {
  const [query, setQuery] = useState(value?.name || "");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const listboxId = useId();
  const optionIdPrefix = useId();
  const containerRef = useRef(null);
  const debounceRef = useRef();
  const lastRequestRef = useRef(0);
  const inputRef = useRef(null);

  // Mantiene sincronizado el texto cuando el valor externo cambia.
  useEffect(() => {
    if (!value) {
      setQuery("");
      return;
    }
    if (value?.name !== query) {
      setQuery(value.name);
    }
  }, [value]);

  const debouncedQuery = useMemo(() => query.trim(), [query]);
  const visibleOptions = useMemo(() => options.slice(0, 10), [options]);

  useEffect(() => {
    if (!isOpen) return;
    if (visibleOptions.length === 0) {
      setHighlightedIndex(-1);
      return;
    }
    setHighlightedIndex((prev) => (prev >= 0 && prev < visibleOptions.length ? prev : 0));
  }, [isOpen, visibleOptions]);

  useEffect(() => {
    if (!isOpen) return;

    const currentRequestId = Date.now();
    lastRequestRef.current = currentRequestId;
    const controller = new AbortController();

    const loadCities = async () => {
      setLoading(true);
      setError("");
      try {
        const list = await getCities(debouncedQuery, { signal: controller.signal });
        if (lastRequestRef.current !== currentRequestId) return;
        setOptions(Array.isArray(list) ? list : []);
      } catch (err) {
        if (err.name === "AbortError") return;
        if (lastRequestRef.current !== currentRequestId) return;
        setOptions([]);
        setError("No se pudieron cargar las ciudades");
      } finally {
        if (lastRequestRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    // Pequeño debounce manual.
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(loadCities, debouncedQuery ? 200 : 0);

    return () => {
      clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [debouncedQuery, isOpen]);

  // Cierra la lista cuando el foco sale del contenedor.
  function handleBlur(event) {
    const nextFocused = event.relatedTarget;
    if (!containerRef.current?.contains(nextFocused)) {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  function openList() {
    setIsOpen(true);
  }

  function closeList() {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function selectCity(city) {
    if (city) {
      setQuery(city.name || "");
      onChange(city);
    } else {
      setQuery("");
      onChange(null);
    }
    closeList();
    const focusInput = () => {
      inputRef.current?.focus();
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(focusInput);
    } else {
      setTimeout(focusInput, 0);
    }
  }

  function handleInputChange(event) {
    const text = event.target.value;
    setQuery(text);
    if (!text || (value && text !== value.name)) {
      onChange(null);
    }
    if (!isOpen) {
      openList();
    }
  }

  function handleKeyDown(event) {
    if (!isOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      openList();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (visibleOptions.length === 0) {
        setHighlightedIndex(-1);
        return;
      }
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= visibleOptions.length ? 0 : next;
      });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (visibleOptions.length === 0) {
        setHighlightedIndex(-1);
        return;
      }
      setHighlightedIndex((prev) => {
        if (prev <= 0) return visibleOptions.length - 1;
        return prev - 1;
      });
    } else if (event.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < visibleOptions.length) {
        event.preventDefault();
        selectCity(visibleOptions[highlightedIndex]);
      }
    } else if (event.key === "Escape") {
      closeList();
    }
  }

  return (
    <div className="relative w-full" ref={containerRef} onBlur={handleBlur}>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          id={name}
          name={name}
          className="w-full px-3 py-2 rounded-lg border"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={openList}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${listboxId}-list`}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${optionIdPrefix}-option-${highlightedIndex}` : undefined
          }
        />
        {value && (
          <button
            type="button"
            className="absolute inset-y-0 right-2 my-auto text-slate-500 hover:text-slate-700"
            onClick={() => selectCity(null)}
            aria-label="Limpiar ciudad seleccionada"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          id={`${listboxId}-list`}
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border bg-white shadow-lg"
        >
          {loading && (
            <li className="px-3 py-2 text-sm text-slate-500" role="status">
              Cargando...
            </li>
          )}
          {!loading && error && (
            <li className="px-3 py-2 text-sm text-red-600" role="alert">
              {error}
            </li>
          )}
          {!loading && !error && visibleOptions.length === 0 && (
            <li className="px-3 py-2 text-sm text-slate-500">
              Sin resultados
            </li>
          )}
          {!loading && !error &&
            visibleOptions.map((city, index) => (
              <li
                key={city.id || `${city.name}-${index}`}
                id={`${optionIdPrefix}-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  index === highlightedIndex ? "bg-slate-100" : ""
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCity(city)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {city.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
