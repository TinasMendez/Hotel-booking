// /frontend/src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import ProductDetail from "./pages/ProductDetail.jsx";
import { AuthGuard } from "./modules/auth/AuthGuard";

// Admin
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin";
import FeaturesAdmin from "./pages/admin/FeaturesAdmin";

/** Global layout for header/main/footer using Tailwind container widths. */
function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* ✅ param name must be productId */}
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/booking/:productId" element={<Booking />} />

        {/* Private area with your AuthGuard (example) */}
        <Route element={<AuthGuard />}>
          {/* e.g. <Route path="/bookings" element={<MyBookings />} /> */}
        </Route>

        {/* Admin (protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/administration" element={<AdminLayout />}>
            <Route index element={<ProductsAdmin />} />
            <Route path="products" element={<ProductsAdmin />} />
            <Route path="categories" element={<CategoriesAdmin />} />
            <Route path="features" element={<FeaturesAdmin />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}


