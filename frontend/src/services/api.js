// /frontend/src/services/api.js
// Axios client + auth helpers used by AuthContext and features.

import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ---------------- token storage helpers ---------------- */

export function getStoredToken() {
  try {
    return localStorage.getItem("token") || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  } catch {}
}

export function persistAuth(payload) {
  try {
    if (!payload) {
      clearAuth();
      return;
    }
    setAuthToken(payload.token);
    const user = {
      id: payload.userId,
      firstName: payload.firstName ?? "",
      lastName: payload.lastName ?? "",
      email: payload.email ?? "",
      roles: payload.roles ?? [],
    };
    localStorage.setItem("user", JSON.stringify(user));
  } catch {}
}

export function clearAuth() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {}
}

/* ---------------- auth endpoints ---------------- */

export async function login({ email, password }) {
  const { data } = await api.post("/api/auth/login", { email, password });
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
}

export async function me() {
  const { data } = await api.get("/api/auth/me");
  return data;
}
