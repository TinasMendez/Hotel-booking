import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

/**
 * Two-month availability calendar that disables occupied dates.
 * It tries multiple endpoints for better backend compatibility:
 *  1) GET /api/v1/bookings/occupied?productId&from&to -> [{startDate,endDate}]
 *  2) GET /api/v1/bookings/availability?productId&from&to -> same shape
 *  3) GET /api/v1/products/{id}/occupied?from&to -> same shape
 */
export default function AvailabilityCalendar({
  productId,
  initialMonth = new Date(),
  monthsToShow = 2,
  onSelectRange,
}) {
  const [current, setCurrent] = useState(startOfMonth(initialMonth));
  const [busy, setBusy] = useState(new Set());
  const [error, setError] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const queryWindow = useMemo(() => {
    const start = addMonths(startOfMonth(current), -1);
    const end = addMonths(startOfMonth(current), monthsToShow + 2);
    return { start: toISO(start), end: toISO(addDays(end, -1)) };
  }, [current, monthsToShow]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    const pars = { productId, from: queryWindow.start, to: queryWindow.end };

    // Helper: consume any of the endpoints; stop on first that returns data OK.
    async function load() {
      const tryEndpoints = [
        () => api.get("/api/v1/bookings/occupied", { params: pars }),
        () => api.get("/api/v1/bookings/availability", { params: pars }),
        () => api.get(`/api/v1/products/${productId}/occupied`, {
          params: { from: pars.from, to: pars.to },
        }),
      ];

      let data = null;
      for (const fn of tryEndpoints) {
        try {
          const res = await fn();
          if (Array.isArray(res?.data)) {
            data = res.data;
            break;
          }
        } catch {
          // Keep trying next endpoint
        }
      }

      if (!mounted) return;

      if (!data) {
        setError("Unable to load availability. Please try again.");
        setBusy(new Set());
      } else {
        const set = new Set();
        data.forEach((r) => {
          const s = new Date(r.startDate);
          const e = new Date(r.endDate);
          for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
            set.add(toISO(d));
          }
        });
        setBusy(set);
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [productId, queryWindow.start, queryWindow.end]);

  function changeMonth(delta) {
    setCurrent(addMonths(current, delta));
  }

  function handlePick(dayISO) {
    if (busy.has(dayISO)) return;
    const day = new Date(dayISO);
    if (!from || (from && to)) {
      setFrom(day);
      setTo(null);
    } else if (day < from) {
      setFrom(day);
      setTo(null);
    } else {
      const invalid = rangeIncludesBusy(from, day, busy);
      if (invalid) return;
      setTo(day);
      if (typeof onSelectRange === "function") {
        onSelectRange({ from: toISO(from), to: toISO(day) });
      }
    }
  }

  return (
    <section className="avail">
      <header className="bar">
        <h3>Availability</h3>
        <div className="nav">
          <button onClick={() => changeMonth(-1)} aria-label="Previous month">{"<"}</button>
          <button onClick={() => changeMonth(1)} aria-label="Next month">{">"}</button>
        </div>
      </header>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={() => setCurrent(new Date(current))}>Retry</button>
        </div>
      )}

      <div className="months">
        {Array.from({ length: monthsToShow }).map((_, i) => {
          const month = addMonths(current, i);
          return (
            <MonthGrid
              key={i}
              monthDate={month}
              busy={busy}
              from={from}
              to={to}
              loading={loading}
              onPick={handlePick}
            />
          );
        })}
      </div>

      <style>{`
        .bar{ display:flex; align-items:center; justify-content:space-between; margin-bottom:.75rem; }
        .nav button{ border:1px solid #ddd; background:#fff; padding:.25rem .5rem; cursor:pointer; }
        .months{ display:grid; grid-template-columns: repeat(auto-fit, minmax(280px,1fr)); gap:1rem; }
        .error{ background:#fff3f3; border:1px solid #ffd6d6; padding:.75rem; border-radius:8px; margin-bottom:.75rem; }
      `}</style>
    </section>
  );
}

function MonthGrid({ monthDate, busy, from, to, loading, onPick }) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const inRange = (day) => {
    if (!from || !to) return false;
    const iso = toISO(day);
    return iso >= toISO(from) && iso <= toISO(to);
  };

  return (
    <div className="month">
      <div className="head">
        {monthDate.toLocaleString(undefined, { month: "long", year: "numeric" })}
      </div>
      <div className="grid">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((w) => <div key={w} className="wk">{w}</div>)}
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} />;
          const iso = toISO(day);
          const disabled = busy.has(iso);
          return (
            <button
              key={iso}
              disabled={disabled || loading}
              className={`cell ${disabled ? "busy" : ""} ${inRange(day) ? "inrange" : ""}`}
              onClick={() => onPick(iso)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      <style>{`
        .month{ border:1px solid #eee; border-radius:12px; padding:.75rem; }
        .head{ font-weight:600; text-transform:capitalize; margin-bottom:.5rem; }
        .grid{ display:grid; grid-template-columns: repeat(7, 1fr); gap:.25rem; }
        .wk{ text-align:center; font-size:.8rem; color:#778; padding:.25rem 0; }
        .cell{ height:36px; border:0; background:#fff; border-radius:8px; cursor:pointer; box-shadow:0 0 0 1px #eee inset; }
        .cell:hover{ box-shadow:0 0 0 2px #3b82f6 inset; }
        .cell.busy{ background:#f6f7f9; color:#a3a3a3; cursor:not-allowed; text-decoration: line-through; }
        .cell.inrange{ background:#e8f0fe; box-shadow:0 0 0 2px #3b82f6 inset; }
      `}</style>
    </div>
  );
}

/* helpers */
function startOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
function addMonths(d, m){ return new Date(d.getFullYear(), d.getMonth() + m, 1); }
function addDays(d, n){ const dd = new Date(d); dd.setDate(dd.getDate() + n); return dd; }
function toISO(d){ return d.toISOString().slice(0,10); }
function rangeIncludesBusy(a,b,set){ const s=a<b?a:b,e=a<b?b:a; for(let d=new Date(s); d<=e; d=addDays(d,1)){ if(set.has(toISO(d))) return true;} return false; }
