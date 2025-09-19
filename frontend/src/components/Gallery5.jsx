// frontend/src/components/Gallery5.jsx
// 1 main image (left) + 4 thumbs (right on desktop). CTA "View more" bottom-right.

import React from "react";

/** Displays first 5 images with a prominent main image. */
export default function Gallery5({ images = [], onViewMore }) {
  const list = images.slice(0, 5);
  const main = list[0];
  const thumbs = list.slice(1);

  if (!main) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-gray-500">No images available.</p>
      </div>
    );
  }

  const src = (img) => (typeof img === "string" ? img : img?.url || img?.imageUrl || "");

  return (
    <div className="grid md:grid-cols-2 gap-3">
      {/* Main image (left) */}
      <div className="rounded-xl overflow-hidden">
        <img
          src={src(main)}
          alt="Main image"
          className="w-full h-[360px] md:h-[420px] object-cover"
          loading="lazy"
        />
      </div>

      {/* 2x2 grid (right on desktop) + CTA bottom-right */}
      <div className="grid grid-cols-2 gap-3 content-start relative">
        {thumbs.slice(0, 4).map((img, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden">
            <img
              src={src(img)}
              alt={`Image ${idx + 2}`}
              className="w-full h-[170px] md:h-[200px] object-cover"
              loading="lazy"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={onViewMore}
          className="col-span-2 justify-self-end px-3 py-1 rounded-lg border text-sm hover:bg-slate-50"
          title="View all images"
        >
          View more
        </button>
      </div>
    </div>
  );
}
