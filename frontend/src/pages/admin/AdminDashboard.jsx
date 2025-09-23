// frontend/src/pages/admin/AdminDashboard.jsx
// Simple dashboard cards with latest lists. Data comes from /api/admin/dashboard/summary.

import { useEffect, useState } from "react";
import { AdminDashboardAPI } from "../../services/api.js";

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl shadow p-4 bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    AdminDashboardAPI.summary()
      .then(setData)
      .catch((e) => setErr(e.message || "Failed to load dashboard"));
  }, []);

  if (err) return <p className="text-red-600">{err}</p>;
  if (!data) return <p>Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Products" value={data.productsCount} />
        <StatCard title="Categories" value={data.categoriesCount} />
        <StatCard title="Features" value={data.featuresCount} />
        <StatCard title="Users" value={data.usersCount} />
        <StatCard title="Admins" value={data.adminsCount} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="font-semibold mb-2">Latest Products</h2>
          <ul className="list-disc pl-5">
            {data.lastProducts?.map((p) => (
              <li key={p.id}>
                #{p.id} — {p.name}
              </li>
            ))}
            {!data.lastProducts?.length && <li>No products yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl bg-white p-4 shadow">
          <h2 className="font-semibold mb-2">Latest Bookings</h2>
          <ul className="list-disc pl-5">
            {data.lastBookings?.map((b) => (
              <li key={b.id}>
                #{b.id} — product {b.productId} — customer {b.customerId}
              </li>
            ))}
            {!data.lastBookings?.length && <li>No bookings yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}

