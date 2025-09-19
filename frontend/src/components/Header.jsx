// frontend/src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";
import { getUserDisplayName, getUserInitials } from "../utils/user.js";

/** Keeps the global navigation consistent and sticky across pages. */
export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuRef.current || !menuOpen) return;
      const inMenu = menuRef.current.contains(e.target);
      const inTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      if (!inMenu && !inTrigger) setMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Left block: logo + tagline (click → Home) */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Go to Home">
          <span className="grid place-items-center w-9 h-9 rounded-xl ring-1 ring-emerald-400/40 bg-emerald-500/10">
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
              <path
                d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a3 3 0 0 1-3 3H8a5 5 0 0 1-5-5V7z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-slate-900 tracking-tight">Digital Booking</div>
            <div className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
              Find your perfect stay
            </div>
          </div>
        </Link>

        {/* Right block */}
        <nav className="flex items-center gap-3">
          {!isAuthenticated && (
            <>
              <NavLink
                to="/register"
                className="px-3 py-2 rounded-lg border hover:bg-slate-50 text-sm"
              >
                Create account
              </NavLink>
              <NavLink
                to="/login"
                className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
              >
                Sign in
              </NavLink>
            </>
          )}

          {isAuthenticated && (
            <div className="relative">
              <button
                ref={triggerRef}
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 text-sm font-medium">
                  {getUserInitials(user)}
                </span>
                <span className="hidden sm:block text-sm text-slate-800">
                  {getUserDisplayName(user)}
                </span>
              </button>

              {menuOpen && (
                <div
                  ref={menuRef}
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg p-2"
                >
                  <MenuItem to="/profile" onClick={() => setMenuOpen(false)}>
                    My profile
                  </MenuItem>
                  <MenuItem to="/favorites" onClick={() => setMenuOpen(false)}>
                    Favorites
                  </MenuItem>
                  <MenuItem to="/bookings" onClick={() => setMenuOpen(false)}>
                    My bookings
                  </MenuItem>
                  {isAdmin && (
                    <>
                      <div className="my-2 h-px bg-slate-200" />
                      <MenuItem to="/admin" onClick={() => setMenuOpen(false)}>
                        Administration
                      </MenuItem>
                    </>
                  )}
                  <div className="my-2 h-px bg-slate-200" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      logout?.();
                    }}
                    className="w-full text-left block px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 focus:bg-red-50 text-sm"
                  >
                    Sign out
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

function MenuItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-3 py-2 rounded-lg text-sm ${
          isActive ? "bg-slate-900 text-white" : "hover:bg-slate-50"
        }`
      }
      role="menuitem"
    >
      {children}
    </NavLink>
  );
}

