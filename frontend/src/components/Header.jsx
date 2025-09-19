// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { getUserDisplayName, getUserFirstName, getUserInitials } from "../utils/user.js";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { formatMessage } = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);
  const firstItemRef = useRef(null);
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const displayName = getUserDisplayName(user);
  const firstName = getUserFirstName(user) || displayName || user?.email || "";
  const initials = getUserInitials(user) || "ME";

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuOpen) return;
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target) || triggerRef.current?.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    }

    function handleKey(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      // Focus the first menu item for accessibility
      requestAnimationFrame(() => {
        firstItemRef.current?.focus();
      });
    }
  }, [menuOpen]);

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function handleLogout() {
    setMenuOpen(false);
    logout();
  }

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-semibold text-white hover:text-emerald-300 transition-colors">
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
            {formatMessage({ id: "header.home" })}
          </NavLink>

          <NavLink
            to="/policies"
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`
            }
          >
            {formatMessage({ id: "header.policies" })}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `px-3 py-1 rounded-lg ${isActive ? "bg-slate-800" : "hover:bg-slate-800/60"}`
              }
            >
              {formatMessage({ id: "header.admin" })}
            </NavLink>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3 py-1 rounded-lg bg-slate-200 text-slate-900 hover:bg-slate-100"
              >
                {formatMessage({ id: "header.login" })}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-lg border border-slate-200 text-white bg-slate-800 hover:bg-slate-700"
              >
                {formatMessage({ id: "header.register" })}
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                onClick={toggleMenu}
                className="flex items-center gap-2 rounded-full bg-slate-800/80 hover:bg-slate-700 px-2 py-1 transition-colors"
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold uppercase">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={displayName || user.email}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    initials.slice(0, 2)
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-white">
                  {firstName}
                </span>
                <svg
                  className="hidden md:block w-4 h-4 text-slate-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  aria-label="Account menu"
                  className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50"
                >
                  <Link
                    ref={firstItemRef}
                    to="/profile"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    onClick={() => setMenuOpen(false)}
                  >
                    {formatMessage({ id: "header.profile" })}
                  </Link>
                  <Link
                    to="/bookings"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    onClick={() => setMenuOpen(false)}
                  >
                    {formatMessage({ id: "header.bookings" })}
                  </Link>
                  <Link
                    to="/favorites"
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
                    onClick={() => setMenuOpen(false)}
                  >
                    {formatMessage({ id: "header.favorites" })}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none"
                    onClick={handleLogout}
                  >
                    {formatMessage({ id: "header.logout" })}
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
