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
import Contact from "./pages/Contact.jsx";

// Authenticated areas
import Bookings from "./pages/Bookings.jsx";
import Favorites from "./pages/Favorites.jsx";
import Profile from "./pages/Profile.jsx";
import BookingCreate from "./pages/BookingCreate.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";

// Guards
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
import AdminDashboard from "./pages/admin/AdminDashboard.jsx"; // ← NEW
import CitiesAdmin from "./pages/admin/CitiesAdmin.jsx"; // ← NEW

/**
 * App Router
 * - Public shell under <Layout/>
 * - Protected routes wrapped by <ProtectedRoute/>
 * - Admin area under /admin (non-responsive per challenge)
 * - Contact page exposed at /contact
 */
export default function App() {
  return (
    <Routes>
      {/* Public/App shell */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute message="Please sign in to continue." />}>
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          {/* Booking flow (Sprint 4) */}
          <Route path="/product/:id/book" element={<BookingCreate />} />
          <Route path="/booking/:bookingId" element={<BookingConfirmation />} />
        </Route>
      </Route>

      {/* Admin (non-responsive per challenge) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Admin home (Dashboard) */}
        <Route index element={<AdminDashboard />} />
        {/* Management sections */}
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductCreateAdmin />} />
        <Route path="products/:id/edit" element={<ProductEditAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="categories/new" element={<CategoryCreateAdmin />} />
        <Route path="cities" element={<CitiesAdmin />} /> {/* ← NEW */}
        <Route path="features" element={<FeaturesAdmin />} />
        <Route path="admins" element={<AdminRoles />} />
      </Route>

      {/* Spanish alias */}
      <Route path="administración" element={<Navigate to="/admin" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
