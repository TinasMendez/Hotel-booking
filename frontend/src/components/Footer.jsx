import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-8">
      <div className="container mx-auto px-4 py-6 text-sm opacity-80">
        © {new Date().getFullYear()} Digital Booking — All rights reserved.
      </div>
    </footer>
  );
}

