// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { Toaster } from "./Toaster";

/**
 * App shell with persistent header/footer, global toaster and WhatsApp FAB.
 * Accessibility: Adds a "Skip to content" link and #content anchor on main.
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link for keyboard/screen reader users */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 bg-emerald-600 text-white px-3 py-2 rounded-md"
      >
        Skip to content
      </a>

      <Header />

      {/* Main needs an id as the skip link target */}
      <main id="content" className="flex-1 bg-slate-50">
        <Outlet />
      </main>

      <Footer />
      <Toaster />
      <WhatsAppButton />
    </div>
  );
}
