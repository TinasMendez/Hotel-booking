import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { getCities } from "../services/cities";

const MAX_RESULTS = 8;

function normalizeId(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

export default function CityAutocomplete({
  label = "City",
  placeholder = "All cities",
  value = "",
  onChange = () => {},
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [cities, setCities] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef(null);
  const committedValueRef = useRef(normalizeId(value));
  const listboxId = useId();
  const optionIdPrefix = useId();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const list = await getCities();
        if (active) {
          setCities(Array.isArray(list) ? list : []);
        }
      } catch (err) {
        if (active) {
          setError("We couldn't load the cities. Try again later.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const normalizedValue = normalizeId(value);
    if (normalizedValue === committedValueRef.current) return;
    committedValueRef.current = normalizedValue;
    if (!normalizedValue) {
      setInputValue("");
      return;
    }
    const match = cities.find(
      (city) => normalizeId(city.id) === normalizedValue,
    );
    if (match) {
      setInputValue(match.name ?? "");
    }
  }, [value, cities]);

  const filteredCities = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return cities.slice(0, MAX_RESULTS);
    return cities
      .filter((city) => (city.name ?? "").toLowerCase().includes(query))
      .slice(0, MAX_RESULTS);
  }, [cities, inputValue]);

  const hasResults = filteredCities.length > 0;

  function openList() {
    if (!disabled) {
      setIsOpen(true);
    }
  }

  function closeList() {
    setIsOpen(false);
    setHighlightedIndex(-1);
  }

  function handleInputChange(event) {
    const nextValue = event.target.value;
    setInputValue(nextValue);
    openList();
    setHighlightedIndex(0);
    if (committedValueRef.current) {
      committedValueRef.current = "";
      onChange("");
    }
  }

  function handleSelect(city) {
    const id = normalizeId(city.id);
    committedValueRef.current = id;
    setInputValue(city.name ?? "");
    onChange(id);
    closeList();
  }

  function handleClear() {
    committedValueRef.current = "";
    setInputValue("");
    onChange("");
    closeList();
  }

  function moveHighlight(offset) {
    if (!hasResults) return;
    openList();
    setHighlightedIndex((prev) => {
      const next = prev + offset;
      if (next < 0) return filteredCities.length - 1;
      if (next >= filteredCities.length) return 0;
      return next;
    });
  }

  function handleKeyDown(event) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveHighlight(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveHighlight(-1);
        break;
      case "Enter":
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          highlightedIndex < filteredCities.length
        ) {
          event.preventDefault();
          handleSelect(filteredCities[highlightedIndex]);
        }
        break;
      case "Escape":
        if (isOpen) {
          event.preventDefault();
          closeList();
        }
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeList();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && highlightedIndex === -1 && hasResults) {
      setHighlightedIndex(0);
    }
  }, [isOpen, highlightedIndex, hasResults]);

  const activeDescendant =
    highlightedIndex >= 0 && highlightedIndex < filteredCities.length
      ? `${optionIdPrefix}-${filteredCities[highlightedIndex].id}`
      : undefined;

  return (
    <div className="w-full" ref={containerRef}>
      <label
        className="block text-sm font-medium mb-1"
        htmlFor={`${listboxId}-input`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={`${listboxId}-input`}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendant}
          aria-describedby={error ? `${listboxId}-error` : undefined}
          className="w-full px-3 py-2 rounded-lg border pr-10"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={openList}
          onKeyDown={handleKeyDown}
          disabled={disabled || loading}
          autoComplete="off"
        />
        {(loading || committedValueRef.current || inputValue) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 px-3 text-slate-500 hover:text-slate-700 focus:outline-none"
            aria-label="Clear selected city"
            disabled={disabled}
          >
            ×
          </button>
        )}
        {isOpen && (loading || hasResults || error) && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg"
          >
            {loading && (
              <li
                className="px-3 py-2 text-sm text-slate-500"
                role="status"
                aria-live="polite"
              >
                Loading cities…
              </li>
            )}
            {!loading &&
              hasResults &&
              filteredCities.map((city, index) => {
                const optionId = `${optionIdPrefix}-${city.id}`;
                const isHighlighted = index === highlightedIndex;
                return (
                  <li
                    key={optionId}
                    id={optionId}
                    role="option"
                    aria-selected={isHighlighted}
                    className={`cursor-pointer px-3 py-2 text-sm ${
                      isHighlighted ? "bg-slate-100" : "bg-white"
                    }`}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSelect(city);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    {city.name}
                  </li>
                );
              })}
            {!loading && !hasResults && !error && (
              <li className="px-3 py-2 text-sm text-slate-500">
                No cities match your search.
              </li>
            )}
            {error && !loading && (
              <li
                id={`${listboxId}-error`}
                className="px-3 py-2 text-sm text-red-600"
              >
                {error}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
