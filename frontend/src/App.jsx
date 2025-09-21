// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Policies from "./pages/Policies.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Authenticated areas
import Bookings from "./pages/Bookings.jsx";
import Favorites from "./pages/Favorites.jsx";
import Profile from "./pages/Profile.jsx";
import BookingCreate from "./pages/BookingCreate.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";

// Guards (solo una vez)
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// Admin
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import ProductCreateAdmin from "./pages/admin/ProductCreateAdmin.jsx";
import ProductEditAdmin from "./pages/admin/ProductEditAdmin.jsx";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin.jsx";
import CategoryCreateAdmin from "./pages/admin/CategoryCreateAdmin.jsx";
import FeaturesAdmin from "./pages/admin/FeaturesAdmin.jsx";
import AdminRoles from "./pages/admin/AdminRoles.jsx";

export default function App() {
  return (
    <Routes>
      {/* Shell principal */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Auth públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute message="Please sign in to continue." />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />

          {/* Flujo de reservas (Sprint 4) */}
          <Route path="/product/:id/book" element={<BookingCreate />} />
          <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
        </Route>

        {/* Otras */}
        <Route path="/policies" element={<Policies />} />
      </Route>

      {/* Admin (no responsive, por desafío) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductCreateAdmin />} />
        <Route path="products/:id/edit" element={<ProductEditAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="categories/new" element={<CategoryCreateAdmin />} />
        <Route path="features" element={<FeaturesAdmin />} />
        <Route path="admins" element={<AdminRoles />} />
      </Route>

      {/* Alias español */}
      <Route path="administración" element={<Navigate to="/admin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
