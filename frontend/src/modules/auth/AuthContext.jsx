// src/modules/auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api, { AuthAPI, setToken as setStoredToken, clearToken as clearStoredToken } from "../../services/api";

/**
 * Auth context that avoids the "first click Unauthorized" race:
 * 1) login → set token atomically
 * 2) fetch profile with token already present
 */
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  async function fetchMe() {
    // Some backends expose /auth/me only; keep it first.
    try {
      return await AuthAPI.me();
    } catch (e) {
      // If your API also supports /users/me, uncomment next line.
      // return (await Api.get("/users/me")).data;
      throw e;
    }
  }

  async function login({ email, password }) {
    // Set token BEFORE calling /me to avoid 401 on the first attempt.
    const data = await AuthAPI.login({ email, password });
    if (!data?.token) throw new Error("Missing token");
    setStoredToken(data.token);
    const profile = await fetchMe();
    setUser(profile);
  }

  async function register(payload) {
    await AuthAPI.register(payload);
  }

  async function logout() {
    setUser(null);
    clearStoredToken();
  }

  useEffect(() => {
    // Session restore
    (async () => {
      try {
        const me = await fetchMe();
        setUser(me || null);
      } catch {
        clearStoredToken();
      } finally {
        setBooted(true);
      }
    })();
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, register }),
    [user]
  );

  if (!booted) return null;
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}
