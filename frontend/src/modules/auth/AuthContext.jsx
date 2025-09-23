// frontend/src/modules/auth/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Api, { AuthAPI, clearToken as apiClearToken } from "../../services/api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Bootstrap session if a token exists
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (Api.getToken()) {
          const me = await AuthAPI.me();
          if (!cancelled) setUser(me);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setBooted(true);
          setIsLoadingAuth(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login({ email, password }) {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      await AuthAPI.login({ email, password });
      const me = await AuthAPI.me();
      setUser(me);
      return me;
    } catch (e) {
      apiClearToken(); // never keep a bad token
      setUser(null);
      setAuthError(e);
      throw e;
    } finally {
      setIsLoadingAuth(false);
      setBooted(true);
    }
  }

  function logout() {
    apiClearToken();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isLoadingAuth, booted, authError, login, logout }),
    [user, isLoadingAuth, booted, authError],
  );

  // Render children immediately; consumers can rely on isLoadingAuth/booted
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
}
