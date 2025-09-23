// frontend/src/components/ModalGallery.jsx
// Simple fullscreen modal for all images.

import React from "react";

export default function ModalGallery({ open, images = [], onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
      <div className="p-3 flex justify-end">
        <button onClick={onClose} className="px-3 py-1 rounded bg-white">
          Close
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Image ${idx + 1}`}
              className="w-full h-64 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
