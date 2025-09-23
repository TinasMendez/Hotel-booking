// frontend/src/components/AvailabilityCalendar.jsx
import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

/**
 * Compact availability calendar:
 * - Wrapper uses inline-block so the card shrinks to its content (no blank area on the right).
 * - Disables booked dates.
 * - Controlled range via `value={{from,to}}` + `onChange({from,to})`.
 */
export default function AvailabilityCalendar({ bookings = [], value = { from: null, to: null }, onChange }) {
  const disabledDays = useMemo(() => {
    return bookings
      .map(b => toRange(b.startDate, b.endDate))
      .filter(Boolean);
  }, [bookings]);

  return (
    <div className="card p-4 inline-block overflow-hidden">
      <DayPicker
        mode="range"
        numberOfMonths={2}
        selected={value}
        onSelect={(range) => typeof onChange === "function" && onChange(range || { from: null, to: null })}
        disabled={disabledDays}
        captionLayout="months"
        className="max-w-full"
        styles={{
          root: { width: "fit-content" },         // shrink to content
          months: { display: "flex", gap: "1.25rem" },
        }}
      />
      <p className="mt-2 text-xs text-slate-500">
        Select a start and end date. Unavailable dates are disabled.
      </p>
    </div>
  );
}

/* helpers */
function toRange(start, end) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e)) return null;
    return { from: s, to: e };
  } catch {
    return null;
  }
}
