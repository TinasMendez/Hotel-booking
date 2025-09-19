// frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

/** Footer must always be visible, responsive and consistent with brand identity. */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-10">
      <div className="container mx-auto px-4 py-6 text-sm text-white/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Isologotype for brand recognition */}
          <span className="grid place-items-center w-8 h-8 rounded bg-emerald-500/15 ring-1 ring-emerald-400/30">
            <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
              <path
                fill="currentColor"
                d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a3 3 0 0 1-3 3H8a5 5 0 0 1-5-5V7z"
              />
            </svg>
          </span>
          <span>
            © {year} Digital Booking — All rights reserved.
          </span>
        </div>

        <nav className="flex items-center gap-4 text-xs">
          <Link to="/policies" className="hover:text-emerald-400">
            Policies
          </Link>
          <a href="mailto:reservations@digitalbooking.local" className="hover:text-emerald-400">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}

