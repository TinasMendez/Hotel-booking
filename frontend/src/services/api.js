// src/services/api.js
// Centralized API helper with fetch wrapper and domain-specific utilities.

const RAW_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8080/api").replace(/\/$/, "");
const BASE_HAS_API = RAW_BASE.endsWith("/api");
const ROOT_BASE = BASE_HAS_API ? RAW_BASE.substring(0, RAW_BASE.length - 4) : RAW_BASE;
const DEFAULT_API_BASE = BASE_HAS_API ? RAW_BASE : `${RAW_BASE}/api`;

function buildSearch(params) {
  if (!params) return "";
  if (params instanceof URLSearchParams) {
    const query = params.toString();
    return query ? `?${query}` : "";
  }
  const usp = new URLSearchParams();
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => usp.append(key, v));
      } else {
        usp.append(key, value);
      }
    });
  const query = usp.toString();
  return query ? `?${query}` : "";
}

export function resolveApiUrl(path = "", params) {
  if (/^https?:\/\//i.test(path)) {
    const query = buildSearch(params);
    return `${path}${query}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathHasApi = normalizedPath === "/api" || normalizedPath.startsWith("/api/");
  const base = pathHasApi ? (ROOT_BASE || RAW_BASE) : DEFAULT_API_BASE;
  const url = `${base}${normalizedPath}`;
  const query = buildSearch(params);
  return `${url}${query}`;
}

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem("token");
    return;
  }
  localStorage.setItem("token", token);
}

export function clearToken() {
  setToken("");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function normalizeOptions(options = {}) {
  return options && typeof options === "object" ? options : {};
}

async function request(method, path, options = {}) {
  const opts = normalizeOptions(options);
  const { params, data, body, headers: extraHeaders, ...rest } = opts;
  const url = resolveApiUrl(path, params);
  const payload = body !== undefined ? body : data;

  const headers = {
    ...((payload !== undefined && !(payload instanceof FormData)) ? { "Content-Type": "application/json" } : {}),
    ...authHeaders(),
    ...extraHeaders,
  };

  const init = {
    method,
    headers,
    credentials: "include",
    ...rest,
  };

  if (payload !== undefined) {
    init.body = payload instanceof FormData || typeof payload === "string"
      ? payload
      : JSON.stringify(payload);
    if (payload instanceof FormData) {
      delete headers["Content-Type"]; // browser will set boundary
    }
  }

  const res = await fetch(url, init);
  const contentType = res.headers.get("content-type") || "";
  let responseBody = null;
  if (contentType.includes("application/json")) {
    try {
      responseBody = await res.json();
    } catch {
      responseBody = null;
    }
  } else if (contentType.startsWith("text/")) {
    responseBody = await res.text();
  }

  if (!res.ok) {
    const message = responseBody?.message || responseBody?.error || `${res.status} ${res.statusText}`;
    const error = new Error(message);
    error.response = { status: res.status, data: responseBody };
    throw error;
  }

  return {
    data: responseBody,
    status: res.status,
    ok: res.ok,
    headers: res.headers,
  };
}

const get = (path, options) => request("GET", path, options);
const post = (path, data, options) => request("POST", path, { ...normalizeOptions(options), data });
const put = (path, data, options) => request("PUT", path, { ...normalizeOptions(options), data });
const del = (path, options) => request("DELETE", path, normalizeOptions(options));

/* ------------------------------ Domain APIs ------------------------------ */

const AuthAPI = {
  async login({ email, password }) {
    return (await post("/auth/login", { email, password })).data;
  },
  async register(payload) {
    return (await post("/auth/register", payload)).data;
  },
  async me() {
    return (await get("/auth/me")).data;
  },
  logout: clearToken,
};

const BookingAPI = {
  async checkAvailability({ productId, startDate, endDate }) {
    const params = { productId, startDate, endDate };
    return (await get("/bookings/availability", { params })).data;
  },
  async createBooking(payload) {
    return (await post("/bookings", payload)).data;
  },
  async listMine() {
    return (await get("/bookings/me")).data || [];
  },
  async cancelBooking(bookingId) {
    return (await del(`/bookings/${bookingId}`)).data;
  },
  async listByProduct(productId) {
    return (await get(`/bookings/product/${productId}`)).data || [];
  },
  async getById(bookingId) {
    return (await get(`/bookings/${bookingId}`)).data;
  },
};

const FavoritesAPI = {
  async list() {
    return (await get("/favorites")).data || [];
  },
  async add(productId) {
    return (await post(`/favorites/${productId}`)).data;
  },
  async remove(productId) {
    await del(`/favorites/${productId}`);
  },
};

const RatingsAPI = {
  async listByProduct(productId) {
    return (await get(`/ratings/product/${productId}`)).data || [];
  },
  async average(productId) {
    const avg = await get(`/ratings/product/${productId}/average`);
    return typeof avg.data === "number" ? avg.data : Number(avg.data) || 0;
  },
  async rate(productId, score, comment) {
    return (await post("/ratings", { productId, score, comment })).data;
  },
};

const AdminAPI = {
  async listAdmins() {
    return (await get("/admin/users/admins")).data || [];
  },
  async grantAdmin(email) {
    return (await post("/admin/users/grant-admin", { email })).data;
  },
  async revokeAdmin(email) {
    return (await post("/admin/users/revoke-admin", { email })).data;
  },
};

async function fetchCategories() {
  return (await get("/categories")).data;
}

async function removeCategory(id) {
  await del(`/categories/${id}`);
}

async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await post("/uploads/product-image", formData);
  return res.data;
}

async function uploadCategoryImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await post("/uploads/category-image", formData);
  return res.data;
}

async function createCategory(data) {
  const res = await post("/categories", data);
  return res.data;
}

const Api = {
  get,
  post,
  put,
  delete: del,
  getToken,
  setToken,
  clearToken,
  AuthAPI,
  BookingAPI,
  FavoritesAPI,
  RatingsAPI,
  AdminAPI,
  getFavorites: FavoritesAPI.list,
  addFavorite: FavoritesAPI.add,
  removeFavorite: FavoritesAPI.remove,
  getProductRating: async (productId) => ({ rating: await RatingsAPI.average(productId) }),
  rateProduct: (productId, score, comment) => RatingsAPI.rate(productId, score, comment),
  getCategories: fetchCategories,
  deleteCategory: removeCategory,
  uploadProductImage,
  uploadCategoryImage,
  createCategory,
};

export { AuthAPI, BookingAPI, FavoritesAPI, RatingsAPI, AdminAPI };
export default Api;
