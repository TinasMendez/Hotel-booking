// /frontend/src/routes/ProtectedRoute.jsx
// Simple auth gate using localStorage token.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

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

    export default function ProtectedRoute() {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
    }
