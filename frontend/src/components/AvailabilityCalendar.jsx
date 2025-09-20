// frontend/src/components/AvailabilityCalendar.jsx
import React, { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

/**
 * Two-month calendar that shrinks to content on desktop.
 * Mobile uses full width for usability.
 */
export default function AvailabilityCalendar({ bookings = [], value, onChange }) {
  const disabled = useMemo(() => {
    return bookings
      .map((b) => {
        const from = new Date(b.startDate || b.start || b.from);
        const to = new Date(b.endDate || b.end || b.to);
        if (isNaN(from) || isNaN(to)) return null;
        return { from, to };
      })
      .filter(Boolean);
  }, [bookings]);

  return (
    <div
      className={
        // mobile: full width; md+: shrink-to-fit content
        "rounded-xl border bg-white p-3 w-full md:w-auto md:inline-block"
      }
    >
      <div className="overflow-x-auto">
        <DayPicker
          mode="range"
          numberOfMonths={2}
          pagedNavigation
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          classNames={{
            months: "rdp-months flex flex-nowrap gap-4",
            month: "rdp-month",
          }}
          styles={{
            months: {
              display: "flex",
              flexDirection: "row",
              gap: "1rem",
              flexWrap: "nowrap",
            },
            month: { minWidth: 280 }, // compact but readable
            caption: { fontWeight: 600 },
          }}
        />
      </div>
    </div>
  );
}
