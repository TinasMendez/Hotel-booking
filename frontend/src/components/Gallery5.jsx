// frontend/src/components/Gallery5.jsx
// 1 main image + 4 thumbs grid (desktop), responsive with Tailwind.

import React from "react";

export default function Gallery5({ images = [], onViewMore }) {
  const list = images.slice(0, 5);
  const main = list[0];
  const thumbs = list.slice(1);

  if (!main) {
    return (
      <div className="bg-gray-100 rounded p-6 text-center">
        <p className="text-gray-500">No images available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Main */}
      <div className="rounded overflow-hidden">
        <img src={main} alt="Main" className="w-full h-80 object-cover" />
      </div>
      {/* 4 thumbs */}
      <div className="grid grid-cols-2 grid-rows-2 gap-3">
        {thumbs.map((src, idx) => (
          <img key={idx} src={src} alt={`Thumb ${idx + 1}`} className="w-full h-38 object-cover rounded" />
        ))}
        {/* View more button (bottom right) */}
        <button
          type="button"
          onClick={onViewMore}
          className="col-span-2 justify-self-end px-3 py-1 rounded border text-sm"
          title="Open full gallery"
        >
          View gallery
        </button>
      </div>
    </div>
  );
}
