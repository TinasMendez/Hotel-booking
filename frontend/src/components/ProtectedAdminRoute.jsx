// src/components/ProtectedAdminRoute.jsx
// Simple guard: requires a JWT token in localStorage.
// If you expose roles in the token later, add a role check here.

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../modules/auth/AuthContext.jsx";

function hasAdminRole(user) {
  if (!user || !Array.isArray(user.roles)) return false;
  return user.roles.some((role) => role === "ADMIN" || role === "ROLE_ADMIN");
}

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isLoadingAuth, user } = useAuth();

  if (isLoadingAuth) {
    return <div className="p-6">Checking permissions…</div>;
  }

  if (!isAuthenticated || !hasAdminRole(user)) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, reason: "admin-protected" }}
      />
    );
  }

  return children;
}
