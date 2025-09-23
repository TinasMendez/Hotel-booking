// /frontend/src/modules/auth/AuthGuard.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/** Basic guard: if not authenticated, redirect to /login and keep return URL. */
export function AuthGuard({
  reason = "Necesitas iniciar sesión para continuar.",
}) {
  const { isAuthenticated, isLoadingAuth, authError } = useAuth();
  const location = useLocation();

  if (isLoadingAuth) {
    return <p className="p-6">Checking session...</p>;
  }

  if (!isAuthenticated) {
    const message = reason ?? authError?.message ?? authError?.code ?? null;
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, reason: message }}
      />
    );
  }

  return <Outlet />;
}

export default AuthGuard;
