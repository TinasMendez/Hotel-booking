import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthAPI } from "/src/services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    let alive = true;
    async function boot() {
      try {
        const t = localStorage.getItem("token");
        if (t) {
          const me = await AuthAPI.me();
          if (alive) setUser(me || null);
        } else {
          if (alive) setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
        if (alive) setUser(null);
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

  const login = async ({ email, password }) => {
    const res = await AuthAPI.login({ email, password });
    if (res?.token) {
      setToken(res.token);
      const me = await AuthAPI.me();
      setUser(me || null);
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setToken("");
    AuthAPI.logout();
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoadingAuth,
    login,
    logout,
  }), [user, token, isLoadingAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
