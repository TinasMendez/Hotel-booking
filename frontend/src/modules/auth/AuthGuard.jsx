// /frontend/src/modules/auth/AuthGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Basic guard: if not authenticated, redirect to /login and keep return URL. */
export function AuthGuard() {
  const { isAuthenticated, isLoadingAuth, authError } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <p className="p-6">Checking session...</p>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, reason: authError?.code || null }}
      />
    );
  }

  return <Outlet />;
}

export default AuthGuard;
