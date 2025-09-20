// src/modules/auth/AuthContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthAPI, setToken as setStoredToken, clearToken as clearStoredToken } from "../../services/api";

/**
 * Auth context that avoids the "first click Unauthorized" race:
 * 1) login → set token atomically
 * 2) fetch profile with token already present
 */
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchMe = useCallback(async () => {
    // Some backends expose /auth/me only; keep it first.
    try {
      return await AuthAPI.me();
    } catch (e) {
      // If your API also supports /users/me, uncomment next line.
      // return (await Api.get("/users/me")).data;
      throw e;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    // Set token BEFORE calling /me to avoid 401 on the first attempt.
    try {
      const data = await AuthAPI.login({ email, password });
      if (!data?.token) throw new Error("Missing token");
      setStoredToken(data.token);
      const profile = await fetchMe();
      setUser(profile);
      setAuthError(null);
    } catch (error) {
      clearStoredToken();
      setUser(null);
      const normalized = normalizeAuthError(error);
      setAuthError(normalized);
      if (typeof error === "object" && error !== null) {
        error.payload = normalized;
      }
      throw error;
    }
  }, [fetchMe]);

  const register = useCallback(async (payload) => {
    await AuthAPI.register(payload);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredToken();
    setAuthError(null);
  }, []);

  useEffect(() => {
    // Session restore
    let active = true;
    setIsLoadingAuth(true);
    (async () => {
      try {
        const me = await fetchMe();
        if (!active) return;
        setUser(me || null);
        setAuthError(null);
      } catch (error) {
        if (!active) return;
        clearStoredToken();
        setUser(null);
        setAuthError(normalizeAuthError(error));
      } finally {
        if (!active) return;
        setIsLoadingAuth(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchMe]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoadingAuth,
      authError,
      login,
      logout,
      register,
    }),
    [user, isLoadingAuth, authError, login, logout, register]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("AuthContext missing");
  return ctx;
}

function normalizeAuthError(error) {
  const status = error?.response?.status ?? 0;
  let code = "auth.profileError";
  if (status === 401) code = "auth.sessionExpired";
  else if (status === 403) code = "auth.notAllowed";

  const message = error?.response?.data?.message || error?.message || "";
  return { status, code, message };
}
