// frontend/src/pages/admin/AdminDashboard.jsx
// Clean dashboard: KPI cards + three booking buckets stacked vertically (Active, Previous, Cancelled).
// Column "Total" was removed per request.

import { useEffect, useState } from "react";
import { AdminDashboardAPI } from "../../services/api.js";

function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl shadow bg-white p-4">
      <div className="text-[11px] uppercase tracking-wider text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-semibold">{value}</div>
      {subtitle ? <div className="text-xs text-gray-400 mt-1">{subtitle}</div> : null}
    </div>
  );
}

function BucketCard({ title, rows }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">{title}</h2>
      </div>
      {!rows || rows.length === 0 ? (
        <p className="text-sm text-gray-500">No items.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Dates</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-3 py-2 text-gray-500">#{b.id}</td>
                <td className="px-3 py-2">{b.productName || `Product ${b.productId ?? "?"}`}</td>
                <td className="px-3 py-2">{b.customerName || `Customer ${b.customerId ?? "?"}`}</td>
                <td className="px-3 py-2 text-gray-600">{b.customerEmail || "-"}</td>
                <td className="px-3 py-2">
                  {(b.checkIn || "?") + " → " + (b.checkOut || "?")}
                  {typeof b.nights === "number" ? (
                    <span className="ml-2 text-xs text-gray-500">({b.nights} nights)</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [buckets, setBuckets] = useState({ active: [], previous: [], cancelled: [] });
  const [err, setErr] = useState("");

  useEffect(() => {
    Promise.all([
      AdminDashboardAPI.summary(),
      AdminDashboardAPI.bookingBuckets(8, 200),
    ])
      .then(([s, b]) => {
        setSummary(s);
        setBuckets({
          active: Array.isArray(b?.active) ? b.active : [],
          previous: Array.isArray(b?.previous) ? b.previous : [],
          cancelled: Array.isArray(b?.cancelled) ? b.cancelled : [],
        });
      })
      .catch((e) => setErr(e.message || "Failed to load dashboard"));
  }, []);

  if (err) return <p className="text-red-600">{err}</p>;
  if (!summary) return <p>Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Products" value={summary.productsCount} />
        <StatCard title="Categories" value={summary.categoriesCount} />
        <StatCard title="Features" value={summary.featuresCount} />
        <StatCard title="Users" value={summary.usersCount} />
        <StatCard title="Admins" value={summary.adminsCount} />
      </div>

      {/* Buckets stacked vertically */}
      <div className="space-y-6">
        <BucketCard title="Active bookings" rows={buckets.active} />
        <BucketCard title="Previous bookings" rows={buckets.previous} />
        <BucketCard title="Cancelled bookings" rows={buckets.cancelled} />
      </div>
    </div>
  );
}

