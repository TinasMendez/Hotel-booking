// frontend/src/components/Header.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext";
import UserAvatar from "./UserAvatar";
import { fullNameOf, hasRole } from "../utils/strings";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-gray-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gray-900 text-white font-semibold">
              ■
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Digital Booking</span>
              <span className="text-xs text-gray-500">
                Find your perfect stay
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                {/* Use unified button styles (small) */}
                <NavLink
                  to="/register"
                  className="btn-outline btn-sm focus-ring hidden sm:inline-flex"
                >
                  Create account
                </NavLink>
                <NavLink to="/login" className="btn-primary btn-sm focus-ring">
                  Sign in
                </NavLink>
              </>
            ) : (
              <UserDropdown user={user} onLogout={handleLogout} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function UserDropdown({ user, onLogout }) {
  const isAdmin = hasRole(user, "ROLE_ADMIN");
  const name = fullNameOf(user);

  return (
    <details className="relative group">
      <summary className="list-none inline-flex items-center gap-3 cursor-pointer select-none">
        <UserAvatar user={user} />
        <span className="hidden sm:block text-sm font-medium text-gray-800 max-w-[16ch] truncate">
          {name}
        </span>
        <svg
          className="ml-1 h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>

      <menu className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white shadow-lg p-2">
        <MenuItem to="/profile" label="My profile" />
        <MenuItem to="/bookings" label="My bookings" />
        <MenuItem to="/favorites" label="Favorites" />
        {isAdmin && <MenuItem to="/admin" label="Admin panel" />}
        <li className="pt-1 mt-1 border-t">
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 focus-ring"
          >
            Sign out
          </button>
        </li>
      </menu>
    </details>
  );
}

function MenuItem({ to, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          [
            "block rounded-lg px-3 py-2 text-sm font-medium focus-ring",
            isActive
              ? "bg-gray-100 text-gray-900"
              : "text-gray-700 hover:bg-gray-50",
          ].join(" ")
        }
      >
        {label}
      </NavLink>
    </li>
  );
}
