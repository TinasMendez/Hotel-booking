// src/pages/admin/AdminLayout.jsx
// Minimal admin layout with a left sidebar and top title.

import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import useIsMobile from '../../hooks/useIsMobile.js';

export default function AdminLayout() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">Administration is not available on mobile</h1>
        <p className="text-sm text-slate-600 max-w-md">
          Please use the desktop version to manage products, categories and reservations. You can continue browsing properties on your phone.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b space-y-2">
          <div>
            <h2 className="text-lg font-semibold">Administration</h2>
            <p className="text-sm text-gray-500">Manage catalog</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full px-3 py-2 rounded border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back to Home
          </button>
        </div>
        <nav className="p-2 space-y-1">
          <NavLink
            to="products"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="categories"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="features"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Features
          </NavLink>
          <NavLink
            to="admins"
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Admin Roles
          </NavLink>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <Outlet />
      </main>
    </div>
  );
}
