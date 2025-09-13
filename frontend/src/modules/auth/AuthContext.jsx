// /frontend/src/modules/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Api, { saveToken, clearToken, getToken } from "../../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!getToken()) return;
        const me = await Api.me();
        if (mounted) setUser(me);
      } catch {
        clearToken();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    if (!getToken()) setLoading(false);
    return () => { mounted = false; };
  }, []);

  async function login(email, password) {
    const res = await Api.login(email, password);
    if (!res?.token) throw new Error("Login did not return a token.");
    saveToken(res.token);
    const me = await Api.me().catch(() => ({ email }));
    setUser(me);
  }

  async function register(payload) {
    const res = await Api.register(payload);
    if (res?.token) {
      saveToken(res.token);
      const me = await Api.me().catch(() => null);
      setUser(me);
    }
    return res;
  }

  function logout() { clearToken(); setUser(null); }

  const value = useMemo(() => ({
    user, loading, isAuthenticated: !!user, login, register, logout
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}

