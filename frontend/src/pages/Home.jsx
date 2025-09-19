// frontend/src/pages/Home.jsx
// Home page with advanced search (URL-synced filters, autosuggest and range calendar)

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { useIntl, FormattedMessage } from "react-intl";
import { httpGet } from "../api/http";
import Pagination from "../components/Pagination";
import { getApiErrorMessage, normalizeApiError } from "../utils/apiError.js";

const PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;
const SUGGESTION_DEBOUNCE = 250;
const RECOMMENDATION_LIMIT = 10;

function toISO(date) {
  if (!(date instanceof Date)) return "";
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

function parseISODate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function addDays(date, days) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function formatRangeLabel(start, end) {
  if (!start || !end) return "Select dates";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Select dates";
  }
  const opts = { month: "short", day: "numeric" };
  return `${startDate.toLocaleDateString(undefined, opts)} → ${endDate.toLocaleDateString(undefined, opts)}`;
}

function getCover(product) {
  if (!product) return "https://via.placeholder.com/640x360?text=No+Image";
  if (product.imageUrl) return product.imageUrl;
  if (Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
    return product.imageUrls[0];
  }
  if (Array.isArray(product.images) && product.images.length > 0) {
    const first = product.images[0];
    return typeof first === "string" ? first : first?.url;
  }
  return "https://via.placeholder.com/640x360?text=No+Image";
}

const today = (() => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
})();
const defaultStartISO = toISO(today);
const defaultEndISO = toISO(addDays(today, 2));

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [cityId, setCityId] = useState("all");
  const [start, setStart] = useState(defaultStartISO);
  const [end, setEnd] = useState(defaultEndISO);
  const [dateRange, setDateRange] = useState({
    from: parseISODate(defaultStartISO),
    to: parseISODate(defaultEndISO),
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [recommendationsError, setRecommendationsError] = useState("");
  const [showMetaSections, setShowMetaSections] = useState(false);

  const calendarRef = useRef(null);
  const calendarTriggerRef = useRef(null);
  const suggestionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const suggestionRequestId = useRef(0);

  // Autosuggest state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const loadProducts = useCallback(async (opts = {}) => {
    const {
      q: queryValue = "",
      categoryId: catValue = "all",
      cityId: cityValue = "all",
      page: pageValue = DEFAULT_PAGE,
    } = opts;

    setLoading(true);
    setErr("");

    try {
      const hasFilters = Boolean(
        queryValue ||
        (catValue && catValue !== "all") ||
        (cityValue && cityValue !== "all")
      );

      const params = {
        page: Math.max(0, Number(pageValue) - 1),
        size: PAGE_SIZE,
        sort: "name,asc",
      };

      if (queryValue) params.q = queryValue;
      if (catValue && catValue !== "all") params.categoryId = catValue;
      if (cityValue && cityValue !== "all") params.cityId = cityValue;

      const path = hasFilters ? "/products/search" : "/products";
      const response = await httpGet(path, { params });

      const content = Array.isArray(response)
        ? response
        : response?.content ?? [];
      const total = typeof response?.totalElements === "number"
        ? response.totalElements
        : content.length;
      const pages = typeof response?.totalPages === "number"
        ? response.totalPages
        : Math.max(1, Math.ceil(total / PAGE_SIZE));

      setItems(content);
      setTotalElements(total);
      setTotalPages(pages);

      return { totalPages: pages, totalElements: total };
    } catch (error) {
      const normalized = normalizeApiError(error, formatMessage({ id: "errors.generic" }));
      setErr(getApiErrorMessage(normalized, formatMessage));
      setItems([]);
      setTotalElements(0);
      setTotalPages(1);
      return { totalPages: 1, totalElements: 0, error };
    } finally {
      setLoading(false);
    }
  }, [formatMessage]);

  const fetchRecommendations = useCallback(async () => {
    setRecommendationsLoading(true);
    setRecommendationsError("");
    try {
      const data = await httpGet("/products/random", { params: { limit: RECOMMENDATION_LIMIT } });
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setRecommendations(list.slice(0, RECOMMENDATION_LIMIT));
    } catch (error) {
      setRecommendations([]);
      const normalized = normalizeApiError(error, formatMessage({ id: "errors.generic" }));
      setRecommendationsError(getApiErrorMessage(normalized, formatMessage));
    } finally {
      setRecommendationsLoading(false);
    }
  }, [formatMessage]);

  // Fetch categories and cities once
  useEffect(() => {
    (async () => {
      try {
        const [cats, cits] = await Promise.all([
          httpGet("/categories").catch(() => []),
          httpGet("/cities").catch(() => []),
        ]);
        setCategories(Array.isArray(cats) ? cats : cats?.content ?? []);
        setCities(Array.isArray(cits) ? cits : cits?.content ?? []);
      } catch {
        // silently ignore filter errors
      }
    })();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // Hydrate state from URL and load products when query changes
  useEffect(() => {
    let cancelled = false;

    const params = new URLSearchParams(location.search);
    const qParam = params.get("q") ?? "";
    const catParam = params.get("categoryId") ?? "all";
    const cityParam = params.get("cityId") ?? "all";
    const startParam = params.get("start") ?? defaultStartISO;
    const endParam = params.get("end") ?? defaultEndISO;
    const pageParamRaw = params.get("page");
    const parsedPage = Number(pageParamRaw);
    const safePage = Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.trunc(parsedPage)
      : DEFAULT_PAGE;

    setQ(qParam);
    setCategoryId(catParam || "all");
    setCityId(cityParam || "all");
    setStart(startParam);
    setEnd(endParam);
    setDateRange({
      from: parseISODate(startParam) ?? parseISODate(defaultStartISO),
      to: parseISODate(endParam) ?? parseISODate(startParam) ?? parseISODate(defaultEndISO),
    });

    (async () => {
      const meta = await loadProducts({
        q: qParam,
        categoryId: catParam || "all",
        cityId: cityParam || "all",
        page: safePage,
      });
      if (cancelled) return;

      const pages = Math.max(1, meta?.totalPages || 1);
      const boundedPage = Math.min(Math.max(1, safePage), pages);
      setPage(boundedPage);

      if (boundedPage !== safePage) {
        const nextParams = new URLSearchParams(location.search);
        if (boundedPage === 1) nextParams.delete("page");
        else nextParams.set("page", String(boundedPage));
        navigate({ pathname: "/", search: nextParams.toString() ? `?${nextParams.toString()}` : "" }, { replace: true });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.search, loadProducts, navigate]);

  // Close calendar on outside click
  useEffect(() => {
    function handleClick(event) {
      if (!showCalendar) return;
      if (calendarRef.current?.contains(event.target)) return;
      if (calendarTriggerRef.current?.contains(event.target)) return;
      setShowCalendar(false);
    }
    function handleKey(event) {
      if (event.key === "Escape") {
        setShowCalendar(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showCalendar]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(event) {
      if (!showSuggestions) return;
      if (suggestionsRef.current?.contains(event.target)) return;
      if (searchInputRef.current?.contains(event.target)) return;
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showSuggestions]);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const formatLabel = useMemo(() => formatRangeLabel(start, end), [start, end]);

  function handleDateSelect(range) {
    if (!range) return;
    const { from, to } = range;
    if (!from) return;
    const fromISO = toISO(from);
    const toISOValue = toISO(to || from);
    setDateRange({ from, to: to || from });
    setStart(fromISO);
    setEnd(toISOValue);
  }

  function updateURL(paramsObj, options = {}) {
    const { replace = false } = options;
    const params = new URLSearchParams();
    const queryValue = typeof paramsObj.q === "string" ? paramsObj.q.trim() : "";
    if (queryValue) params.set("q", queryValue);
    const categoryValue = paramsObj.categoryId ?? "all";
    if (categoryValue && categoryValue !== "all") {
      params.set("categoryId", categoryValue);
    }
    const cityValue = paramsObj.cityId ?? "all";
    if (cityValue && cityValue !== "all") {
      params.set("cityId", cityValue);
    }
    if (paramsObj.start) params.set("start", paramsObj.start);
    if (paramsObj.end) params.set("end", paramsObj.end);
    const pageValue = Number(paramsObj.page ?? DEFAULT_PAGE);
    if (Number.isFinite(pageValue) && pageValue > 0) {
      params.set("page", String(Math.trunc(pageValue)));
    }
    const search = params.toString();
    const nextSearch = search ? `?${search}` : "";
    if (nextSearch === location.search) {
      return;
    }
    navigate({ pathname: "/", search: nextSearch }, { replace });
  }

  function syncPage(nextPage, { replace = true, scroll = true } = {}) {
    const maxPage = Math.max(1, totalPages);
    const target = Math.min(Math.max(1, nextPage), maxPage);
    if (target !== page) {
      setPage(target);
    }
    updateURL({ q, categoryId, cityId, start, end, page: target }, { replace });
    if (scroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    setShowSuggestions(false);
    setHighlightIndex(-1);
    const startISO = start || defaultStartISO;
    const endISO = end || startISO;
    updateURL({ q: q.trim(), categoryId, cityId, start: startISO, end: endISO, page: DEFAULT_PAGE });
  }

  function handleReset() {
    setQ("");
    setCategoryId("all");
    setCityId("all");
    const newStart = defaultStartISO;
    const newEnd = defaultEndISO;
    setStart(newStart);
    setEnd(newEnd);
    setDateRange({ from: parseISODate(newStart), to: parseISODate(newEnd) });
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightIndex(-1);
    updateURL({ q: "", categoryId: "all", cityId: "all", start: newStart, end: newEnd, page: DEFAULT_PAGE });
    fetchRecommendations();
  }

  function buildSuggestion(term) {
    const trimmed = term.trim();
    if (trimmed.length < 3) {
      setSuggestions([]);
      setHighlightIndex(-1);
      return;
    }

    suggestionRequestId.current += 1;
    const requestId = suggestionRequestId.current;

    const lower = trimmed.toLowerCase();

    const cityMatches = cities
      .filter((c) => c.name && c.name.toLowerCase().includes(lower))
      .slice(0, 4)
      .map((c) => ({
        type: "city",
        id: c.id,
        label: c.name,
      }));

    const categoryMatches = categories
      .filter((c) => {
        const label = c.title || c.name;
        return label && label.toLowerCase().includes(lower);
      })
      .slice(0, 4)
      .map((c) => ({
        type: "category",
        id: c.id,
        label: c.title || c.name,
      }));

    (async () => {
      try {
        const response = await httpGet(`/products/search?q=${encodeURIComponent(trimmed)}&size=5`);
        const data = Array.isArray(response) ? response : response?.content ?? [];
        const propertyMatches = data.slice(0, 5).map((p) => ({
          type: "property",
          id: p.id,
          label: p.name,
        }));
        const combined = [...propertyMatches, ...cityMatches, ...categoryMatches];
        if (suggestionRequestId.current === requestId) {
          setSuggestions(combined);
          setShowSuggestions(true);
          setHighlightIndex(combined.length > 0 ? 0 : -1);
        }
      } catch {
        const combined = [...cityMatches, ...categoryMatches];
        if (suggestionRequestId.current === requestId) {
          setSuggestions(combined);
          setShowSuggestions(true);
          setHighlightIndex(combined.length > 0 ? 0 : -1);
        }
      }
    })();
  }

  function handleSearchInputChange(event) {
    const value = event.target.value;
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => buildSuggestion(value), SUGGESTION_DEBOUNCE);
    if (value.trim().length >= 3) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  }

  function handleSuggestionSelect(suggestion) {
    if (!suggestion) return;
    setShowSuggestions(false);
    setHighlightIndex(-1);

    if (suggestion.type === "property") {
      navigate(`/product/${suggestion.id}`);
      return;
    }

    if (suggestion.type === "city") {
      setCityId(String(suggestion.id));
      setQ(suggestion.label);
      return;
    }

    if (suggestion.type === "category") {
      setCategoryId(String(suggestion.id));
      setQ(suggestion.label);
    }
  }

  function handleSearchKeyDown(event) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((idx) => (idx + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((idx) => (idx - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
        event.preventDefault();
        handleSuggestionSelect(suggestions[highlightIndex]);
      }
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
      setHighlightIndex(-1);
    }
  }

  function renderProductCard(product) {
    const cover = getCover(product);
    const average = Number(product.ratingAverage ?? 0);
    const count = Number(product.ratingCount ?? 0);
    return (
      <div
        key={product.id}
        className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col"
      >
        <img
          src={cover}
          alt={product.name}
          className="h-44 w-full object-cover"
          loading="lazy"
        />
        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-slate-900">{product.name}</h3>
          {count > 0 ? (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <span className="font-semibold">★ {average.toFixed(1)}</span>
              <span className="text-xs text-slate-500">({count})</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Sin valoraciones todavía</div>
          )}
          <p className="text-sm text-slate-600 line-clamp-3">
            {product.description}
          </p>
          <div className="mt-auto flex gap-2 pt-3">
            <Link
              to={`/product/${product.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Details
            </Link>
            <Link
              to={`/booking/${product.id}`}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const featureCategories = useMemo(() => {
    return categories.slice(0, 4).map((category) => ({
      id: String(category.id),
      name: category.title || category.name,
      description: category.description,
      image: category.imageUrl || "https://via.placeholder.com/480x320?text=Category",
    }));
  }, [categories]);

  function handleCategoryShortcut(id) {
    setCategoryId(id);
    updateURL({ q: q.trim(), categoryId: id, cityId, start, end, page: DEFAULT_PAGE });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">{formatMessage({ id: "home.title" })}</h1>
        <p className="text-sm text-slate-600">{formatMessage({ id: "home.subtitle" })}</p>
      </header>

      <div className="space-y-4">
        <div className="md:hidden flex justify-end">
          <button
            type="button"
            onClick={() => setShowMetaSections((open) => !open)}
            className="text-sm text-emerald-600 font-medium"
          >
            {showMetaSections
              ? formatMessage({ id: "home.meta.toggle.hide" })
              : formatMessage({ id: "home.meta.toggle.show" })}
          </button>
        </div>
        <div className={`${showMetaSections ? "space-y-6" : "hidden"} md:block md:space-y-6`}>
          {featureCategories.length > 0 && (
            <section className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{formatMessage({ id: "home.explore.title" })}</h2>
                  <p className="text-sm text-slate-600">{formatMessage({ id: "home.explore.subtitle" })}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {featureCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryShortcut(category.id)}
                    className="group text-left bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:border-emerald-500 hover:shadow-md transition-all"
                  >
                    <div className="h-32 bg-slate-200 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-semibold text-slate-900">{category.name}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {category.description || formatMessage({ id: "home.explore.subtitle" })}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {(recommendationsLoading || recommendations.length > 0 || recommendationsError) && (
            <section className="bg-white rounded-2xl shadow p-6 space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {formatMessage({ id: "home.recommendations.title" })}
                  </h2>
                  <p className="text-sm text-slate-600">
                    {formatMessage({ id: "home.recommendations.subtitle" })}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchRecommendations}
                  disabled={recommendationsLoading}
                  className="px-3 py-1.5 text-sm rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                >
                  {recommendationsLoading
                    ? formatMessage({ id: "home.recommendations.loading" })
                    : formatMessage({ id: "home.recommendations.refresh" })}
                </button>
              </div>
              {recommendationsError && (
                <p className="text-sm text-red-600">{recommendationsError}</p>
              )}
              {recommendationsLoading && recommendations.length === 0 ? (
                <p className="text-sm text-slate-500">
                  {formatMessage({ id: "home.recommendations.loading" })}
                </p>
              ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((product) => renderProductCard(product))}
                </div>
              ) : null}
            </section>
          )}
        </div>
      </div>

      <section className="bg-white rounded-2xl shadow p-6 space-y-4">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <input
              ref={searchInputRef}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 placeholder:text-slate-400"
              placeholder={formatMessage({ id: "home.search.placeholder" })}
            value={q}
              onChange={handleSearchInputChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => {
                if (q.trim().length >= 3 && suggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}-${suggestion.label}`}
                    type="button"
                    onMouseEnter={() => setHighlightIndex(index)}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      handleSuggestionSelect(suggestion);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-sm ${
                      index === highlightIndex ? "bg-slate-100" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-slate-700 text-left">{suggestion.label}</span>
                    <span className="text-xs text-slate-500 capitalize">{suggestion.type}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            <option value="all">{formatMessage({ id: "home.filter.allCategories" })}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title || c.name}
              </option>
            ))}
          </select>

          <select
            className="border border-slate-200 rounded-lg px-3 py-2 text-slate-900"
            value={cityId}
            onChange={(event) => setCityId(event.target.value)}
          >
            <option value="all">{formatMessage({ id: "home.filter.allCities" })}</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="relative">
            <button
              ref={calendarTriggerRef}
              type="button"
              onClick={() => setShowCalendar((open) => !open)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-left text-slate-900 hover:border-slate-300"
            >
              <span className="text-sm">{formatLabel}</span>
            </button>
            {showCalendar && (
              <div
                ref={calendarRef}
                className="absolute left-0 z-50 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl p-4"
              >
                <DayPicker
                  mode="range"
                  numberOfMonths={2}
                  fromDate={today}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  defaultMonth={dateRange.from || today}
                />
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 hover:bg-slate-100"
                    onClick={() => setShowCalendar(false)}
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          <input type="hidden" value={start} readOnly />
          <input type="hidden" value={end} readOnly />

          <div className="md:col-span-4 flex flex-wrap gap-3 md:justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              {formatMessage({ id: "home.search" })}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              {formatMessage({ id: "home.reset" })}
            </button>
          </div>
        </form>
      </section>

      {loading && <p className="text-slate-600">Loading…</p>}
      {err && <p className="text-red-600">{err}</p>}

      {!loading && !err && (
        <section className="space-y-4">
          <p className="text-sm text-slate-600">
            <FormattedMessage id="home.results" values={{ count: totalElements }} />
          </p>

          {items.length === 0 ? (
            <p className="text-sm text-slate-500">
              {formatMessage({ id: "home.results.empty" })}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((product) => renderProductCard(product))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onFirst={() => syncPage(DEFAULT_PAGE)}
              onPrev={() => syncPage(page - 1)}
              onNext={() => syncPage(page + 1)}
            />
          )}
        </section>
      )}
    </div>
  );
}
