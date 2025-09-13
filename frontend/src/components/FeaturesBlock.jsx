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
          <div key={f.id || f.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="text-lg">{renderIcon(f.icon)}</span>
            <span className="text-sm">{f.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
