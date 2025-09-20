// frontend/src/components/RatingStars.jsx
import { useMemo, useState } from "react";

function buildStars(value, outOf) {
  const rating = Number.isFinite(value) ? value : 0;
  return Array.from({ length: outOf }, (_, index) => {
    const position = index + 1;
    return {
      key: position,
      filled: rating >= position,
    };
  });
}

export function RatingStarsInput({ value = 0, onChange, disabled = false, className = "", outOf = 5, sizeClass = "text-2xl" }) {
  const [hover, setHover] = useState(0);
  const stars = useMemo(() => buildStars(hover || value, outOf), [hover, value, outOf]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map(({ key, filled }) => (
        <button
          key={key}
          type="button"
          className={`${sizeClass} leading-none transition-colors ${filled ? "text-amber-500" : "text-slate-300"}`}
          disabled={disabled}
          onMouseEnter={() => setHover(key)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange?.(key)}
        >
          {filled ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function RatingStars({ value = 0, outOf = 5, className = "", sizeClass = "text-xl" }) {
  const stars = useMemo(() => buildStars(value, outOf), [value, outOf]);
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {stars.map(({ key, filled }) => (
        <span
          key={key}
          className={`${sizeClass} leading-none ${filled ? "text-amber-500" : "text-slate-300"}`}
          aria-hidden
        >
          {filled ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}
