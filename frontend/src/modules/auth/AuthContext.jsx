import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthAPI, setToken as storeToken, getToken, clearToken as wipeToken } from '../../services/api';

/**
 * AuthContext keeps auth state and exposes:
 * - user: { id, email, username?, roles?, customerId? } | null
 * - token: string
 * - login(email, password)
 * - logout()
 * - refreshMe()  // optional best-effort
 *
 * We DO NOT depend on /auth/me to resolve the user after login.
 * Instead we decode the JWT payload to build a minimal user object,
 * and then (optionally) try /auth/me in the background to enrich it.
 */

// ---------- small JWT decoder (no crypto validation, just payload parse) ----------
function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const json = JSON.parse(atob(payload));
    return json;
  } catch {
    return null;
  }
}

function normalizeFromClaims(claims, fallbackEmail) {
  if (!claims) return null;
  // Common claim names in typical JWTs
  const id = claims.userId ?? claims.id ?? claims.sub ?? null;
  const email = claims.email ?? fallbackEmail ?? null;
  const username = claims.username ?? claims.name ?? claims.sub ?? null;
  const roles = claims.roles ?? claims.authorities ?? claims.scope ?? null;
  const customerId = claims.customerId ?? claims.userId ?? claims.id ?? null;
  return { id, email, username, roles, customerId };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth.user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(false);

  const persistUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem('auth.user', JSON.stringify(u));
    else localStorage.removeItem('auth.user');
  };

  const refreshMe = useCallback(async () => {
    // Optional enrichment; ignore errors (401/404)
    try {
      const me = await AuthAPI.me();
      if (me) persistUser({ ...user, ...me });
      return me;
    } catch {
      return null;
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await AuthAPI.login({ email, password });
      const jwt = res?.token || res?.jwt || '';
      if (!jwt) throw new Error('Login did not return a token');

      // 1) Store token
      storeToken(jwt);
      setToken(jwt);

      // 2) Prefer server-provided user if available
      if (res?.user) {
        const normalized = {
          id: res.user.id ?? res.user.userId ?? null,
          email: res.user.email ?? email,
          username: res.user.username ?? res.user.name ?? null,
          roles: res.user.roles ?? res.user.authorities ?? null,
          customerId: res.user.customerId ?? res.user.id ?? res.user.userId ?? null,
        };
        persistUser(normalized);
        // Optional enrichment (best-effort)
        refreshMe();
        return normalized;
      }

      // 3) Else, decode JWT to build a minimal user
      const claims = decodeJwt(jwt);
      const fromToken = normalizeFromClaims(claims, email);
      if (!fromToken || !fromToken.email) {
        // Try best-effort /auth/me if decoding is not enough
        const me = await AuthAPI.me().catch(() => null);
        if (!me) throw new Error('Could not resolve current user after login');
        persistUser(me);
        return me;
      }
      persistUser(fromToken);
      // Optional enrichment in background
      refreshMe();
      return fromToken;
    } finally {
      setLoading(false);
    }
  }, [refreshMe]);

  const logout = useCallback(() => {
    persistUser(null);
    wipeToken();
    setToken('');
  }, []);

  // On mount: if there is a token but no user, derive from token immediately
  useEffect(() => {
    if (getToken() && !user) {
      const claims = decodeJwt(getToken());
      const minimal = normalizeFromClaims(claims, null);
      if (minimal) {
        persistUser(minimal);
        // Optional enrichment
        refreshMe();
      }
    }
  }, []); // run once

  const value = useMemo(
    () => ({ user, token, loading, login, logout, refreshMe }),
    [user, token, loading, login, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
