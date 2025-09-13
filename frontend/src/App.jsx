import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import { AuthGuard } from "./modules/auth/AuthGuard";

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
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Booking details (guard optional; availability is public in your backend) */}
        <Route path="/booking/:productId" element={<Booking />} />

        {/* Example for authenticated-only routes */}
        <Route element={<AuthGuard />}>
          {/* Add private pages here if needed */}
          {/* <Route path="/bookings" element={<MyBookings />} /> */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

