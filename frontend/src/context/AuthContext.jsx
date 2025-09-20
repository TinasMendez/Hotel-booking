import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api from "../services/api";

/**
 * Authentication context to keep the current user and provide auth actions.
 * All network requests are JSON; the login payload is a flat object:
 *   { email: string, password: string }
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // Load the current user if a token exists.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const token = Api.getToken();
        if (token) {
          const me = await Api.AuthAPI.me();
          if (!cancelled) setUser(me);
        }
      } catch {
        // Token might be invalid/expired; clear it.
        Api.clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setBootstrapped(true);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login({ email, password }) {
    // Ensure a flat JSON body: { email, password }
    const payload = {
      email: String(email || "").trim().toLowerCase(),
      password: String(password || ""),
    };

    const data = await Api.AuthAPI.login(payload); // expects { token, ... }
    if (!data?.token) {
      throw new Error("Login failed: missing token");
    }

    Api.setToken(data.token);
    const me = await Api.AuthAPI.me();
    setUser(me);
    return me;
  }

  function logout() {
    Api.clearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      bootstrapped,
      login,
      logout,
    }),
    [user, bootstrapped]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
