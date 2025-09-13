// src/components/ProtectedAdminRoute.jsx
// Simple guard: requires a JWT token in localStorage. 
// If you expose roles in the token later, add a role check here.

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedAdminRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location, reason: 'admin-protected' }} />;
  }

  return children;
}
