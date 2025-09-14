// Centralized API client using fetch with sensible defaults.
// Adds Authorization: Bearer <token> automatically if present.
// Base path is '/api' (Vite proxy → backend http://localhost:8080).

const API_BASE = '/api';

// ---------------- Token helpers ----------------

export function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('jwt') || '';
}

export function setToken(token) {
  localStorage.setItem('token', token || '');
  localStorage.setItem('jwt', token || '');
}

export function clearToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('jwt');
  localStorage.removeItem('auth.user');
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

async function coreFetch(url, options = {}) {
  const { method = 'GET', headers, body, ...rest } = options;

  const resp = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
    ...rest,
  });

  const contentType = resp.headers.get('Content-Type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await resp.json().catch(() => null) : null;

  if (!resp.ok) {
    const message =
      (payload && (payload.message || payload.error)) || `${resp.status} ${resp.statusText}`;
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
    const headers = buildHeaders(config.headers, data);
    return coreFetch(url, { method: 'POST', headers, body: data, ...config });
  },
  async put(path, data, config = {}) {
    const url = joinPath(API_BASE, path);
    const headers = buildHeaders(config.headers, data);
    return coreFetch(url, { method: 'PUT', headers, body: data, ...config });
  },
  async delete(path, config = {}) {
    const url = joinPath(API_BASE, path);
    const headers = buildHeaders(config.headers);
    return coreFetch(url, { method: 'DELETE', headers, ...config });
  },
};

export default api;

// ---------------- Auth & Booking helpers ----------------

export const AuthAPI = {
  // Backend expects email + password for login
  async login({ email, password }) {
    return api.post('/auth/login', { email, password });
  },
  // Optional: if your backend exposes a "me" endpoint
  async me() {
    return api.get('/auth/me');
  },
  // Optional: adjust path if your backend uses a different register endpoint
  async register({ firstName, lastName, email, password }) {
    return api.post('/auth/register', { firstName, lastName, email, password });
  },
};

export const BookingAPI = {
  async checkAvailability({ productId, startDate, endDate }) {
    const params = new URLSearchParams({
      productId: String(productId),
      startDate,
      endDate,
    });
    return api.get(`/bookings/availability?${params.toString()}`);
  },
  async createBooking(payload) {
    // Expected: { productId, customerId, startDate, endDate }
    return api.post('/bookings', payload);
  },
};
