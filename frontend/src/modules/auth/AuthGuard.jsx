import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Route guard for authenticated-only pages. */
export function AuthGuard() {
  const { ready, isAuthenticated } = useAuth();
  const loc = useLocation();

  // Prevent flicker before AuthProvider loads localStorage.
  if (!ready) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  return <Outlet />;
}
