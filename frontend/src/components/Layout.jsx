import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import FloatingWhatsAppButton from "./FloatingWhatsAppButton.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-slate-100">
        {/* Si tus páginas ya tienen container, puedes quitar este wrapper */}
        <div className="container mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
}
