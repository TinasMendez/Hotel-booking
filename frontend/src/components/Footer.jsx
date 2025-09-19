import React from "react";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";

export default function Footer() {
  const { formatMessage } = useIntl();
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-white/80 flex flex-wrap items-center justify-between gap-3">
        <span>© {new Date().getFullYear()} Digital Booking — All rights reserved.</span>
        <nav className="flex items-center gap-4 text-xs">
          <Link to="/policies" className="hover:text-emerald-400">
            {formatMessage({ id: "header.policies" })}
          </Link>
          <a
            href="mailto:reservas@digitalbooking.local"
            className="hover:text-emerald-400"
          >
            {formatMessage({ id: "footer.contact" })}
          </a>
        </nav>
      </div>
    </footer>
  );
}
