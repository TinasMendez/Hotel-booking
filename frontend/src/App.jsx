import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// TU layout y páginas existentes
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Booking from "./pages/Booking.jsx";
import Bookings from "./pages/Bookings.jsx";
import Favorites from "./pages/Favorites.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BookingConfirmation from "./pages/BookingConfirmation.jsx";

// Guard que ya tienes
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin.jsx";
import FeaturesAdmin from "./pages/admin/FeaturesAdmin.jsx";
import AdminRoles from "./pages/admin/AdminRoles.jsx";
import ProductCreateAdmin from "./pages/admin/ProductCreateAdmin.jsx";
import CategoryCreateAdmin from "./pages/admin/CategoryCreateAdmin.jsx";

// AuthGuard que ya tienes (usa <Outlet/>)
import AuthGuard from "./modules/auth/AuthGuard.jsx";

export default function App() {
  return (
    <Routes>
      {/* Páginas públicas envueltas por TU Layout (Header + Footer) */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductDetail />} />

        {/* Rutas que requieren login */}
        <Route element={<AuthGuard />}>
          {/* MUY IMPORTANTE: tu Booking.jsx usa useParams({ productId }) */}
          <Route path="booking/:productId" element={<Booking />} />
          <Route path="booking/confirmation/:bookingId" element={<BookingConfirmation />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Route>

      {/* Auth fuera del layout */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* Admin */}
      <Route
        path="admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products/new" element={<ProductCreateAdmin />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="categories/new" element={<CategoryCreateAdmin />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="features" element={<FeaturesAdmin />} />
        <Route path="admins" element={<AdminRoles />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
