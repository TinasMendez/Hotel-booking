// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Booking from "./pages/Booking.jsx";
import Bookings from "./pages/Bookings.jsx";
import Favorites from "./pages/Favorites.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";
import Policies from "./pages/Policies.jsx";
import Profile from "./pages/Profile.jsx";
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
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route
          element={
            <ProtectedRoute message="Debes iniciar sesión para completar una reserva." />
          }
        >
          <Route path="/booking/:productId" element={<Booking />} />
        </Route>
        <Route path="/booking/confirm" element={<BookingConfirmation />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductCreateAdmin />} />
        <Route path="products/:id/edit" element={<ProductEditAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="categories/new" element={<CategoryCreateAdmin />} />
        <Route path="features" element={<FeaturesAdmin />} />
        <Route path="admins" element={<AdminRoles />} />
      </Route>

      {/* Alias requested by challenge (Spanish path to admin) */}
      <Route path="administración" element={<Navigate to="/admin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
