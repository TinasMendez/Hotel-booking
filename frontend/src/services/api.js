// Centralized API client.
// - Default export: `api` (axios-like) para imports legacy (AuthContext, etc).
// - Named exports: `apiFetch`, `BookingAPI`, `getToken`, `setToken`, `clearToken`.
// - Adjunta automáticamente el JWT guardado en localStorage ('token' o 'jwt').
// - Base: '/api' (el proxy de Vite reenvía a http://localhost:8080).

const API_BASE = '/api';

// ---------------- Token helpers ----------------

export function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('jwt') || '';
}

export function setToken(token) {
  // Store under both keys for legacy compatibility
  localStorage.setItem('token', token || '');
  localStorage.setItem('jwt', token || '');
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('jwt');
}

// ---------------- internal utilities ----------------

function joinPath(base, path) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  const p = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return `${b}${p}`;
}

function buildHeaders(extraHeaders = {}, body) {
  const headers = new Headers(extraHeaders);
  if (!(body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
}

async function coreFetch(url, { method = 'GET', headers = {}, body, ...rest } = {}) {
  const resp = await fetch(url, {
    method,
    headers,
    body,
    credentials: 'include',
    ...rest
  });

  const contentType = resp.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await resp.json().catch(() => null) : null;

  if (!resp.ok) {
    const message = (payload && (payload.message || payload.error)) || `${resp.status} ${resp.statusText}`;
    const err = new Error(message);
    err.status = resp.status;
    err.payload = payload;
    throw err;
  }
  return payload;
}

// ---------------- Default export (axios-like) ----------------

const api = {
  async get(path, config = {}) {
    const url = joinPath(API_BASE, path);
    const headers = buildHeaders(config.headers);
    return coreFetch(url, { method: 'GET', headers, ...config });
  },
  async post(path, data, config = {}) {
    const url = joinPath(API_BASE, path);
    const isForm = data instanceof FormData;
    const body = isForm ? data : JSON.stringify(data ?? {});
    const headers = buildHeaders(config.headers, data);
    return coreFetch(url, { method: 'POST', headers, body, ...config });
  },
  async put(path, data, config = {}) {
    const url = joinPath(API_BASE, path);
    const isForm = data instanceof FormData;
    const body = isForm ? data : JSON.stringify(data ?? {});
    const headers = buildHeaders(config.headers, data);
    return coreFetch(url, { method: 'PUT', headers, body, ...config });
  },
  async delete(path, config = {}) {
    const url = joinPath(API_BASE, path);
    const headers = buildHeaders(config.headers);
    return coreFetch(url, { method: 'DELETE', headers, ...config });
  }
};

export default api;

// ---------------- Named helpers for new code ----------------

export async function apiFetch(path, options = {}) {
  const url = joinPath(API_BASE, path);
  const headers = buildHeaders(options.headers, options.body);
  return coreFetch(url, { ...options, headers });
}

export const BookingAPI = {
  async checkAvailability({ productId, startDate, endDate }) {
    const params = new URLSearchParams({
      productId: String(productId),
      startDate,
      endDate
    });
    return api.get(`/bookings/availability?${params.toString()}`);
  },
  async createBooking(payload) {
    return api.post('/bookings', payload);
  }
};
