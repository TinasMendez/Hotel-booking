// src/modules/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  api,            // axios instance
  getStoredToken, // read token from localStorage
  persistAuth,    // write token + user to localStorage
  clearAuth,      // clear token + user
  login as apiLogin, // POST /api/auth/login
  me as apiMe,       // GET  /api/auth/me
} from "../../services/api";

const AuthContext = createContext(null);

/** Centralized auth state (token + user). */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Bootstrap auth state from localStorage on first mount.
  useEffect(() => {
    try {
      const stored = getStoredToken();
      if (stored) {
        setToken(stored);
      }
    } finally {
      setReady(true);
    }
  }, []);

  // Keep axios Authorization header in sync with the token.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  async function login({ email, password }) {
    const data = await apiLogin({ email, password });
    // Expecting: { token, tokenType, expiresAt, userId, firstName, lastName, email, roles }
    persistAuth(data);
    setToken(data.token);
    setUser({
      id: data.userId,
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      roles: data.roles ?? [],
    });
    return data;
  }

  async function refreshMe() {
    // Optional helper to reload /auth/me
    const data = await apiMe();
    if (data) {
      setUser(data);
    }
    return data;
  }

  function logout() {
    clearAuth();
    setToken(null);
    setUser(null);
  }

  const isAuthenticated = !!token;

  const value = useMemo(() => ({
    token, user, ready, isAuthenticated,
    login, logout, refreshMe
  }), [token, user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
