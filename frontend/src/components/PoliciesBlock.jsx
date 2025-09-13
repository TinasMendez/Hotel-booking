// frontend/src/components/PoliciesBlock.jsx
// Policies block 100% width, title underlined, distributed in columns.

import React from "react";

export default function PoliciesBlock({ policies }) {
  // Fallback defaults if backend does not provide policies
  const fallback = [
    { title: "House rules", description: "No smoking. No parties or events." },
    { title: "Health & safety", description: "Follow local health guidelines." },
    { title: "Cancellation policy", description: "Free cancellation up to 48 hours before check-in." },
  ];

  const list = Array.isArray(policies) && policies.length > 0 ? policies : fallback;

  return (
    <section className="mt-8 w-full">
      <h2 className="text-xl font-semibold underline underline-offset-4 mb-3">Policies</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {list.map((p, idx) => (
          <div key={idx} className="bg-gray-50 rounded p-4">
            <h3 className="font-semibold">{p.title}</h3>
            <p className="text-sm text-gray-700">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
