// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * App footer with brand on the left and quick links on the right.
 * - "Policies" keeps internal routing.
 * - "Contact" now routes to /contact (contact page with mailto submit).
 * - Links are white and slightly larger for contrast on dark background.
 * - Includes focus-ring for keyboard accessibility.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-slate-950 text-slate-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Brand / Copyright */}
          <div className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-700/20 ring-1 ring-emerald-700/30">
              <span className="h-3 w-3 rounded-sm bg-slate-200 block" />
            </span>
            <p className="text-sm sm:text-base">
              © {year} Digital Booking — All rights reserved.
            </p>
          </div>

          {/* Quick links */}
          <nav className="flex items-center gap-5">
            <Link
              to="/policies"
              className="text-white text-base font-medium hover:text-emerald-200 focus-ring rounded"
            >
              Policies
            </Link>
            <Link
              to="/contact"
              className="text-white text-base font-medium hover:text-emerald-200 focus-ring rounded"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
