// frontend/src/components/FeaturesBlock.jsx
import React from "react";

/**
 * Optional internal title to avoid duplicated "Features" on pages that already render a heading.
 */
export default function FeaturesBlock({ features = [], renderTitle = true }) {
  const list = Array.isArray(features) ? features : [];
  return (
    <div>
      {renderTitle && <h3 className="text-base font-semibold mb-2">Features</h3>}
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">No features provided for this product.</p>
      ) : (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
          {list.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              {f?.icon && <span aria-hidden="true">{f.icon}</span>}
              <span>{f?.name || String(f)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
