// frontend/src/services/api.js

const BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  "http://localhost:8080/api";

/* Token handling */
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

/* URL helper */
export function resolveApiUrl(path) {
  const base = BASE_URL.replace(/\/+$/, "");
  const suffix = String(path || "").replace(/^\/+/, "");
  return `${base}/${suffix}`;
}

/* Core request helper */
async function request(
  method,
  path,
  { body, auth = true, json = true, params } = {},
) {
  const headers = new Headers();
  if (json) headers.set("Content-Type", "application/json");
  if (auth) {
    const t = getToken();
    if (t) headers.set("Authorization", `Bearer ${t}`);
  }

  // simple querystring support
  let url = resolveApiUrl(path);
  if (params && typeof params === "object") {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const s = qs.toString();
    if (s) url += (url.includes("?") ? "&" : "?") + s;
  }

  const opts = { method, headers, credentials: "include" };
  if (body !== undefined) opts.body = json ? JSON.stringify(body) : body;

  const res = await fetch(url, opts);

  let data = null;
  const txt = await res.text();
  if (txt) {
    try {
      data = JSON.parse(txt);
    } catch {
      data = txt;
    }
  }

  if (!res.ok) {
    const err = new Error(
      (data && (data.message || data.error || data.code)) ||
        `HTTP ${res.status}`,
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const get = (p, o) => request("GET", p, o);
const post = (p, b, o) => request("POST", p, { ...o, body: b });
const put = (p, b, o) => request("PUT", p, { ...o, body: b });
const del = (p, o) => request("DELETE", p, o);

/* Auth */
export const AuthAPI = {
  async login({ email, password }) {
    const data = await post(
      "/auth/login",
      { email, password },
      { auth: false },
    );
    if (data && data.token) setToken(data.token);
    return data;
  },
  me() {
    return get("/auth/me");
  },
  logout() {
    clearToken();
    return Promise.resolve();
  },
};

/* Reviews */
export const ReviewsAPI = {
  listByProduct(productId) {
    // Public endpoint to read reviews
    return get(`/reviews/product/${productId}`, { auth: false });
  },
  create({ productId, rating, comment }) {
    return post("/reviews", { productId, rating, comment });
  },
  add(payload) {
    return this.create(payload); // alias
  },
};

/* Favorites */
export const FavoritesAPI = {
  list() {
    return get("/favorites");
  },
  add(productId) {
    return post(`/favorites/${productId}`);
  },
  remove(productId) {
    return del(`/favorites/${productId}`);
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
  listMine() {
    return this.list();
  },
  addFavorite(id) {
    return this.add(id);
  },
  removeFavorite(id) {
    return this.remove(id);
  },
};

/* Bookings */
export const BookingAPI = {
  // already used in the product details page
  listByProduct(productId) {
    return get(`/bookings/product/${productId}`, { auth: false });
  },
  // used by the booking flow
  create(payload) {
    return post("/bookings", payload);
  },
  // handy helpers some screens use
  listMine() {
    return get("/bookings/mine");
  },
  cancel(bookingId) {
    return del(`/bookings/${bookingId}`);
  },
};

/* Admin (users/roles by EMAIL – matches your AdminUserController) */
export const AdminAPI = {
  listAdmins() {
    return get("/admin/users/admins");
  },
  grantAdmin(email) {
    return post("/admin/users/grant-admin", { email });
  },
  revokeAdmin(email) {
    return post("/admin/users/revoke-admin", { email });
  },
};

/* Admin Dashboard helpers */
export const AdminDashboardAPI = {
  summary() {
    return get("/admin/dashboard/summary");
  },
  latestBookingsDetailed(limit = 5) {
    return get("/admin/dashboard/latest-bookings", { params: { limit } });
  },
  bookingBuckets(limit = 8, scan = 200) {
    return get("/admin/dashboard/booking-buckets", { params: { limit, scan } });
  },
  listCategoriesWithCount() {
    return get("/admin/categories");
  },
  listProductsByCategory(categoryId) {
    return get(`/admin/categories/${categoryId}/products`);
  },
};

/* Default + named Api (low-level helpers if you need them) */
const Api = {
  get,
  post,
  put,
  del,
  resolveApiUrl,
  getToken,
  setToken,
  clearToken,

  // ---- Added safe aliases so legacy hooks/components keep working ----
  getFavorites: () => FavoritesAPI.list(),
  addFavorite: (id) => FavoritesAPI.add(id),
  removeFavorite: (id) => FavoritesAPI.remove(id),

  // Some places call this directly
  getCategories: () => get("/categories", { auth: false }),
};

export default Api;
export { Api };
