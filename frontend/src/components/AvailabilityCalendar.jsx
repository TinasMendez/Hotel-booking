// frontend/src/components/AvailabilityCalendar.jsx
import { useEffect, useMemo, useState } from "react";

/** Format Date -> 'YYYY-MM-DD' */
function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Build a matrix of weeks (arrays) for a given month */
function buildMonthMatrix(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const last = new Date(year, monthIndex + 1, 0);
  const days = [];
  const startOffset = (first.getDay() + 6) % 7; // Monday=0
  for (let i = 0; i < startOffset; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, monthIndex, d));
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

/** Check if a date string is within a selected range */
function isInRange(dateStr, start, end) {
  if (!start || !end) return false;
  return dateStr >= start && dateStr <= end;
}

/**
 * Minimal, dependency-free availability calendar:
 * - Shows 2 consecutive months (current + next) by default
 * - Blocked dates are disabled and styled
 * - Emits {start, end} via onChange
 */
export default function AvailabilityCalendar({
  startDate,
  endDate,
  blockedDates = [],
  initialMonth = new Date(),
  onChange,
}) {
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);
  const minDay = fmt(today);

  const [cursor, setCursor] = useState(new Date(initialMonth < today ? today : initialMonth));
  const [start, setStart] = useState(startDate || "");
  const [end, setEnd] = useState(endDate || "");

  useEffect(() => {
    if (startDate && startDate >= minDay) setStart(startDate);
    else if (!startDate) setStart("");
  }, [startDate, minDay]);
  useEffect(() => {
    if (endDate && endDate >= minDay) setEnd(endDate);
    else if (!endDate) setEnd("");
  }, [endDate, minDay]);

  const blockedSet = useMemo(() => new Set(blockedDates || []), [blockedDates]);

  function handlePick(dayStr) {
    if (!start || (start && end)) {
      setStart(dayStr);
      setEnd("");
      onChange?.({ start: dayStr, end: "" });
      return;
    }
    if (dayStr < start) {
      setStart(dayStr);
      onChange?.({ start: dayStr, end });
    } else {
      setEnd(dayStr);
      onChange?.({ start, end: dayStr });
    }
  }

  /** Render a single month */
  function Month({ year, monthIndex }) {
    const weeks = buildMonthMatrix(year, monthIndex);
    const label = new Date(year, monthIndex, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
    return (
      <div className="rounded-xl border bg-white">
        <div className="px-3 pt-3">
          <div className="font-medium">{label}</div>
          <div className="grid grid-cols-7 text-xs text-slate-500 mt-2">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
              <div key={d} className="p-1 text-center">
                {d}
              </div>
            ))}
          </div>
        </div>
        <div className="px-3 pb-3">
          {weeks.map((w, i) => (
            <div key={i} className="grid grid-cols-7 text-sm">
              {w.map((d, j) => {
                if (!d) return <div key={j} className="p-1" />;
                const dayStr = fmt(d);
                const isBlocked = blockedSet.has(dayStr) || dayStr < minDay;
                const isSelStart = start && dayStr === start;
                const isSelEnd = end && dayStr === end;
                const inRange = isInRange(dayStr, start, end);
                const base = "m-0.5 rounded px-2 py-1 text-center";
                let cls = "cursor-pointer hover:bg-emerald-50";
                if (isBlocked) cls = "bg-slate-100 text-slate-400 cursor-not-allowed";
                if (inRange && !isSelStart && !isSelEnd) cls = "bg-emerald-100 text-emerald-900";
                if (isSelStart || isSelEnd) cls = "bg-emerald-600 text-white";
                return (
                  <button
                    key={j}
                    type="button"
                    disabled={isBlocked}
                    onClick={() => handlePick(dayStr)}
                    className={`${base} ${cls}`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const monthGrids = [
    <Month key="m0" year={cursor.getFullYear()} monthIndex={cursor.getMonth()} />,
    <Month
      key="m1"
      year={cursor.getFullYear()}
      monthIndex={cursor.getMonth() + 1}
    />,
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          className="btn-outline"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
        >
          ‹ Prev
        </button>
        <div className="text-sm text-slate-600">
          <span className="inline-block mr-4"><span className="inline-block w-3 h-3 bg-emerald-600 rounded-sm mr-1" /> Start/End</span>
          <span className="inline-block mr-4"><span className="inline-block w-3 h-3 bg-emerald-100 rounded-sm mr-1 border border-emerald-200" /> In range</span>
          <span className="inline-block"><span className="inline-block w-3 h-3 bg-slate-100 rounded-sm mr-1 border" /> Unavailable</span>
        </div>
        <button
          type="button"
          className="btn-outline"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
        >
          Next ›
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {monthGrids}
      </div>
    </div>
  );
}
