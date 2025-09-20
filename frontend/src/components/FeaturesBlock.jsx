// frontend/src/components/FeaturesBlock.jsx
// Shows product features with icons. Supports emoji or CSS class in feature.icon.

import React from "react";

function renderIcon(icon) {
  if (!icon) return "•";
  // If icon looks like an emoji, render directly; if it's a CSS class (e.g., "fi fi-wifi"), use <i>.
  const isEmoji = /\p{Extended_Pictographic}/u.test(icon);
  if (isEmoji) return icon;
  return <i className={icon}></i>;
}

export default function FeaturesBlock({ features = [] }) {
  if (!Array.isArray(features) || features.length === 0) {
    return null;
  }
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Features</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((f) => (
          <div key={f.id || f.name} className="flex gap-2 p-3 bg-gray-50 rounded">
            <span className="text-lg mt-0.5">{renderIcon(f.icon)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{f.name}</p>
              {f.description && (
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 whitespace-pre-line">{f.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
