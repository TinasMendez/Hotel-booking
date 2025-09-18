// src/components/Header.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
// ⬇️ CORRECTO: desde src/components -> src/modules es un solo nivel
import { useAuth } from "../modules/auth/AuthContext.jsx";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-semibold">
          Digital Booking
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`
            }
          >
            Home
          </NavLink>

          {isAuthenticated && (
            <NavLink
              to="/bookings"
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`
              }
            >
              Bookings
            </NavLink>
          )}

          {isAdmin && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`
              }
            >
              Admin
            </NavLink>
          )}

          {/* Auth area */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">{user?.email}</span>
              <button
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-100"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-100"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
