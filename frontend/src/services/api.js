// frontend/src/services/api.js

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:8080/api";

/* Token */
const TOKEN_KEY = "auth_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}
export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {}
}
export function clearToken() {
  setToken("");
}

/* URL helpers */
export function resolveApiUrl(path) {
  const base = BASE_URL.replace(/\/+$/, "");
  const suffix = String(path || "").replace(/^\/+/, "");
  return `${base}/${suffix}`;
}
function buildUrl(path, params) {
  const url = new URL(resolveApiUrl(path));
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, v);
      }
    });
  }
  return url.toString();
}

/* HTTP */
async function request(method, path, { body, auth = true, json = true, params } = {}) {
  const headers = new Headers();
  if (json) headers.set("Content-Type", "application/json");
  if (auth) {
    const t = getToken();
    if (t) headers.set("Authorization", `Bearer ${t}`);
  }

  const opts = { method, headers, credentials: "include" };
  if (body !== undefined) opts.body = json ? JSON.stringify(body) : body;

  const res = await fetch(buildUrl(path, params), opts);

  let parsed = null;
  const txt = await res.text();
  if (txt) {
    try {
      parsed = JSON.parse(txt);
    } catch {
      parsed = txt;
    }
  }

  if (!res.ok) {
    const err = new Error(
      (parsed && (parsed.message || parsed.error || parsed.code)) || `HTTP ${res.status}`
    );
    err.status = res.status;
    err.data = parsed;
    throw err;
  }

  // Return Axios-like shape to keep existing code working.
  return { data: parsed, status: res.status, ok: true };
}

const get = (p, o) => request("GET", p, o);
const post = (p, b, o) => request("POST", p, { ...o, body: b });
const put  = (p, b, o) => request("PUT", p, { ...o, body: b });
const del  = (p, o) => request("DELETE", p, o);

/* Auth */
export const AuthAPI = {
  async login({ email, password }) {
    const { data } = await post("/auth/login", { email, password }, { auth: false });
    if (data && data.token) setToken(data.token);
    return data;
  },
  async me() {
    const { data } = await get("/auth/me");
    return data;
  },
  logout() {
    clearToken();
    return Promise.resolve();
  },
};

/* Reviews */
export const ReviewsAPI = {
  async listByProduct(productId) {
    const { data } = await get(`/reviews/product/${productId}`, { auth: false });
    return data;
  },
  async create({ productId, rating, comment }) {
    const { data } = await post("/reviews", { productId, rating, comment });
    return data;
  },
  add(payload) { return this.create(payload); }, // alias
};

/* Favorites */
export const FavoritesAPI = {
  async list() {
    const { data } = await get("/favorites");
    return data;
  },
  async add(productId) {
    const { data } = await post(`/favorites/${productId}`);
    return data;
  },
  async remove(productId) {
    const { data } = await del(`/favorites/${productId}`);
    return data;
  },
  async isFavorite(productId) {
    try {
      await get(`/favorites/by-product/${productId}`);
      return true;
    } catch (e) {
      if (e && e.status === 404) return false;
      throw e;
    }
  },
  listMine() { return this.list(); },                 // alias
  addFavorite(id) { return this.add(id); },           // alias
  removeFavorite(id) { return this.remove(id); },     // alias
};

/* Bookings */
export const BookingAPI = {
  async listByProduct(productId) {
    const { data } = await get(`/bookings/product/${productId}`, { auth: false });
    return data;
  },
};

/* Admin */
export const AdminAPI = {
  async listUsers() {
    const { data } = await get("/admin/users");
    return data;
  },
  async grantAdmin(userId) {
    const { data } = await post(`/admin/users/${userId}/roles`, { role: "ROLE_ADMIN" });
    return data;
  },
  async revokeAdmin(userId) {
    const { data } = await del(`/admin/users/${userId}/roles/ROLE_ADMIN`);
    return data;
  },
};

/* Convenience methods on the default Api (expected by some components) */
const Api = {
  get, post, put, del,
  resolveApiUrl,
  getToken, setToken, clearToken,

  // Used by CategoryFilter.jsx (returns raw JSON: page object or array)
  async getCategories() {
    const { data } = await get("/categories");
    return data;
  },

  // Favorites shortcuts used by useFavorites()
  async getFavorites() {
    return FavoritesAPI.list();
  },
  async addFavorite(productId) {
    return FavoritesAPI.add(productId);
  },
  async removeFavorite(productId) {
    return FavoritesAPI.remove(productId);
  },
};

export default Api;
export { Api };
