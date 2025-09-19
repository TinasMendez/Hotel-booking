import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "/src/services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let alive = true;
    async function boot() {
      try {
        const t = localStorage.getItem("token");
        if (t) {
          const me = await AuthAPI.me();
          if (alive) {
            setUser(me || null);
            setAuthError(null);
          }
        } else {
          if (alive) setUser(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        if (alive) {
          setUser(null);
          setAuthError(normalizeAuthError(error));
        }
      } finally {
        if (alive) setIsLoadingAuth(false);
      }
    }
    boot();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = useCallback(async ({ email, password }) => {
    try {
      const res = await AuthAPI.login({ email, password });
      if (res?.token) {
        setToken(res.token);
        const me = await AuthAPI.me();
        setUser(me || null);
        setAuthError(null);
      }
      return res;
    } catch (error) {
      setAuthError(normalizeAuthError(error));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken("");
    setAuthError(null);
    AuthAPI.logout();
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const me = await AuthAPI.me();
      setUser(me || null);
      setAuthError(null);
      return me;
    } catch (error) {
      const normalized = normalizeAuthError(error);
      setAuthError(normalized);
      if (normalized.status === 401 || normalized.status === 403) {
        setUser(null);
        setToken("");
        localStorage.removeItem("token");
      }
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoadingAuth,
    authError,
    login,
    logout,
    refreshProfile,
  }), [user, token, isLoadingAuth, authError, login, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }

function normalizeAuthError(error) {
  const status = error?.response?.status ?? 0;
  let code = "auth.profileError";
  if (status === 401) code = "auth.sessionExpired";
  else if (status === 403) code = "auth.notAllowed";

  const message = error?.response?.data?.message || error?.message || "";
  return { status, code, message };
}
