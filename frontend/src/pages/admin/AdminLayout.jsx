// src/pages/admin/AdminLayout.jsx
// Minimal admin layout with a left sidebar and top title.

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Administration</h2>
            <p className="text-sm text-gray-500">Manage catalog</p>
            </div>
            <nav className="p-2">
            <NavLink
                to="/administration/products"
                className={({ isActive }) =>
                `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
                }
            >
                Products
            </NavLink>
            <NavLink
                to="/administration/categories"
                className={({ isActive }) =>
                `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
                }
            >
                Categories
            </NavLink>
            <NavLink
                to="/administration/features"
                className={({ isActive }) =>
                `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`
                }
            >
                Features
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
