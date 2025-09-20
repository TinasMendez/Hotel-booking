// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import { Toaster } from "./Toaster";

/** App shell with persistent header/footer, global toaster and WhatsApp FAB. */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-slate-50">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
      <WhatsAppButton />
    </div>
  );
}

