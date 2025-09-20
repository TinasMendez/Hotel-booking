import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";

export default function AuthGuard({ reason = "Debes iniciar sesión para continuar." }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ reason, from: location.pathname + location.search + location.hash }}
      />
    );
  }

  return <Outlet />;
}
