// /frontend/src/modules/auth/AuthGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Basic guard: if not authenticated, redirect to /login and keep return URL. */
export function AuthGuard() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="p-6">Checking session...</p>;
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

export default AuthGuard;
