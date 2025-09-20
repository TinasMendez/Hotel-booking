// /frontend/src/routes/ProtectedRoute.jsx
// Simple auth gate using localStorage token.

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function getToken() {
  try {
    const direct = localStorage.getItem("token");
    if (direct) return direct;
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (auth && (auth.token || auth.accessToken || auth.jwt)) {
      return auth.token || auth.accessToken || auth.jwt;
    }
  } catch (_) {}
  return null;
}

export default function ProtectedRoute({ redirectTo = "/login", message }) {
  const location = useLocation();
  const token = getToken();
  if (!token) {
    const state = { from: location };
    if (message) {
      state.message = message;
    }
    return <Navigate to={redirectTo} replace state={state} />;
  }
  return <Outlet />;
}
