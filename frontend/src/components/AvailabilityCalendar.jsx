// src/components/AvailabilityCalendar.jsx
import React, { useEffect, useMemo, useState } from "react";

/**
 * Utility: YYYY-MM-DD from Date
 */
function toISO(d) {
  if (!d) return "";
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  return x.toISOString().slice(0, 10);
}

/**
 * Add days returning a new Date
 */
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Build array of all days in [start, end] inclusive
 */
function daysBetween(start, end) {
  const out = [];
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return out;
  let cur = new Date(a);
  while (cur <= b) {
    out.push(toISO(cur));
    cur = addDays(cur, 1);
  }
  return out;
}

/**
 * Create a Set of disabled day ISO strings based on bookings.
 * Each booking is expected to have startDate/endDate (inclusive).
 */
function useDisabledSet(bookings) {
  return useMemo(() => {
    if (!Array.isArray(bookings) || bookings.length === 0) return new Set();
    const all = bookings.flatMap((b) => {
      const from = b.startDate ?? b.from ?? b.checkIn ?? b.start;
      const to = b.endDate ?? b.to ?? b.checkOut ?? b.end;
      return daysBetween(from, to);
    });
    return new Set(all);
  }, [bookings]);
}

/**
 * Generate calendar matrix for a given month
 */
function buildMonthMatrix(year, month /* 0-based */) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay(); // 0 Sun..6 Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid = [];
  let row = [];

  // leading blanks
  for (let i = 0; i < startWeekday; i++) row.push(null);

  // month days
  for (let d = 1; d <= daysInMonth; d++) {
    row.push(new Date(year, month, d));
    if (row.length === 7) {
      grid.push(row);
      row = [];
    }
  }
  // trailing blanks
  if (row.length) {
    while (row.length < 7) row.push(null);
    grid.push(row);
  }
  return grid;
}

/**
 * Simple double-month availability calendar
 * Props:
 *  - bookings: array with startDate/endDate
 *  - value: { from: string|Date|null, to: string|Date|null }
 *  - onChange: (next) => void
 */
export default function AvailabilityCalendar({ bookings = [], value, onChange }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const disabled = useDisabledSet(bookings);

  const fromISO = value?.from ? toISO(value.from) : "";
  const toISOValue = value?.to ? toISO(value.to) : "";

  function selectDay(d) {
    if (!d) return;
    const iso = toISO(d);
    if (disabled.has(iso)) return;

    // build new range
    let nextFrom = fromISO && !toISOValue ? fromISO : "";
    let nextTo = toISOValue;

    if (!fromISO || (fromISO && toISOValue)) {
      // start new range
      nextFrom = iso;
      nextTo = "";
    } else {
      // set end; ensure from <= to
      const a = new Date(fromISO);
      const b = new Date(iso);
      if (b < a) {
        nextFrom = iso;
        nextTo = toISO(new Date(fromISO));
      } else {
        nextTo = iso;
      }
    }

    onChange?.({
      from: nextFrom ? new Date(nextFrom) : null,
      to: nextTo ? new Date(nextTo) : null,
    });
  }

  function monthLabel(d) {
    return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }

  function move(n) {
    setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + n, 1));
  }

  const left = cursor;
  const right = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => move(-1)}
          className="rounded border px-2 py-1"
          aria-label="Previous month"
        >
          &lt;
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className="rounded border px-2 py-1"
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <CalendarMonth
          date={left}
          disabled={disabled}
          range={{ fromISO, toISO: toISOValue }}
          onPick={selectDay}
        />
        <CalendarMonth
          date={right}
          disabled={disabled}
          range={{ fromISO, toISO: toISOValue }}
          onPick={selectDay}
        />
      </div>
    </div>
  );
}

function CalendarMonth({ date, disabled, range, onPick }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const matrix = buildMonthMatrix(year, month);

  const label = date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const week = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="rounded-2xl border p-4">
      <div className="text-lg font-semibold mb-2">{label}</div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {week.map((d) => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {matrix.map((row, i) =>
          row.map((cell, j) => {
            if (!cell) return <div key={`${i}-${j}`} className="h-9" />;
            const iso = toISO(cell);
            const isDisabled = disabled.has(iso);
            const inRange =
              range.fromISO && range.toISO && iso >= range.fromISO && iso <= range.toISO;
            const isStart = range.fromISO && iso === range.fromISO;
            const isEnd = range.toISO && iso === range.toISO;

            const base =
              "h-9 flex items-center justify-center rounded cursor-pointer select-none";
            const cls = [
              base,
              isDisabled && "bg-gray-100 text-gray-400 cursor-not-allowed",
              !isDisabled && "hover:bg-blue-50",
              inRange && "bg-blue-100",
              isStart && "ring-2 ring-blue-600 ring-offset-1",
              isEnd && "ring-2 ring-blue-600 ring-offset-1",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={`${i}-${j}`}
                type="button"
                className={cls}
                disabled={isDisabled}
                onClick={() => onPick(cell)}
              >
                {cell.getDate()}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
