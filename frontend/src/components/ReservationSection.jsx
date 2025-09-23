import React, { useState } from "react";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";
import ReserveButton from "./ReserveButton.jsx";

/**
 * Self-contained reservation block:
 * - Lets user pick a date range from AvailabilityCalendar
 * - Sends the range to the booking creation route with ReserveButton
 */
export default function ReservationSection({ productId }) {
  const [range, setRange] = useState({ from: "", to: "" });

  return (
    <section className="reservation">
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        Availability
      </h2>

      <AvailabilityCalendar
        productId={productId}
        monthsToShow={2}
        onSelectRange={({ from, to }) => setRange({ from, to })}
      />

      <div className="mt-3">
        <ReserveButton productId={productId} from={range.from} to={range.to} />
      </div>
    </section>
  );
}
