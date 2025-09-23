// src/pages/Profile.jsx
import React from "react";
import { useAuth } from "../modules/auth/AuthContext";

/**
 * Solid layout with bottom padding so floating elements (FAB/toasts) do not overlap.
 */
export default function Profile() {
  const { user } = useAuth();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : (user?.name || "U")
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase();

  return (
    <div className="container mx-auto px-4 py-6 pb-28">
      {" "}
      {/* bottom padding matters */}
      <h1 className="text-3xl font-bold mb-6">My profile</h1>
      <section className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-xl font-semibold text-slate-900">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || "User"}
            </div>
            <div className="text-sm text-slate-600 truncate">{user?.email}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div>
            <div className="text-xs font-medium text-slate-500">
              ACCOUNT INFORMATION
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-500">FULL NAME</div>
              <div className="text-sm text-slate-900">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.name || "—"}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500">ROLES</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(user?.roles || []).map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Need to update your data?
        </h2>
        <p className="text-sm text-slate-600">
          If you need to change your name, email or password, contact our
          support team.{" "}
          <a
            href="mailto:reservas@digitalbooking.local"
            className="text-slate-900 underline"
          >
            reservas@digitalbooking.local
          </a>
          .
        </p>
      </section>
    </div>
  );
}
