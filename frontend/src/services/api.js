// frontend/src/services/api.js

// ---- Base URL ----
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

/* URL helper (accepts optional query params for compatibility with http.js) */
export function resolveApiUrl(path, params) {
  const base = BASE_URL.replace(/\/+$/, "");
  const suffix = String(path || "").replace(/^\/+/, "");
  let url = `${base}/${suffix}`;
  if (params && typeof params === "object") {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const s = qs.toString();
    if (s) url += (url.includes("?") ? "&" : "?") + s;
  }
  return url;
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

// multipart helper
async function postMultipart(path, formData, opts = {}) {
  return request("POST", path, { ...opts, body: formData, json: false });
}

/* ===================== AUTH ===================== */
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

  async register({ firstName, lastName, email, password }) {
    return post(
      "/auth/register",
      { firstName, lastName, email, password },
      { auth: false },
    );
  },

  me() {
    return get("/auth/me");
  },

  logout() {
    clearToken();
    return Promise.resolve();
  },
};

/* ===================== REVIEWS ===================== */
export const ReviewsAPI = {
  listByProduct(productId) {
    return get(`/reviews/product/${productId}`, { auth: false });
  },
  create({ productId, rating, comment }) {
    return post("/reviews", { productId, rating, comment });
  },
  add(payload) {
    return this.create(payload);
  },
};

/* ===================== FAVORITES ===================== */
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

/* ===================== BOOKINGS ===================== */
export const BookingAPI = {
  listByProduct(productId) {
    return get(`/bookings/product/${productId}`, { auth: false });
  },
  create(payload) {
    return post("/bookings", payload);
  },
  listMine() {
    return get("/bookings/mine");
  },
  cancel(bookingId) {
    return del(`/bookings/${bookingId}`);
  },
};

/* ===================== ADMIN (USERS/ROLES) ===================== */
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

/* ===================== ADMIN DASHBOARD ===================== */
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

/* ===================== CITIES (ADMIN CRUD) ===================== */
export const CitiesAPI = {
  list() {
    return get("/cities", { auth: false });
  },
  create({ name, country }) {
    return post("/cities", { name, country });
  },
  update(id, { name, country }) {
    return put(`/cities/${id}`, { name, country });
  },
  remove(id) {
    return del(`/cities/${id}`);
  },
};

/* ===================== CATEGORIES (ADMIN HELPERS) ===================== */
async function uploadCategoryImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  const candidates = [
    "/admin/uploads",
    "/admin/categories/upload",
    "/uploads",
  ];
  let lastErr = null;
  for (const ep of candidates) {
    try {
      const res = await postMultipart(ep, fd, { auth: true });
      if (res && typeof res === "object" && res.url) return res;
      if (typeof res === "string" && res.startsWith("http")) return { url: res };
      if (res) return res;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr || new Error("Upload failed");
}

/**
 * Create a category with defensive payload + endpoint fallback.
 */
async function createCategory(input) {
  // Normalize fields and send synonyms to satisfy varying DTOs.
  const name =
    String(input?.name ?? input?.title ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const img =
    String(
      input?.imageUrl ?? input?.image ?? input?.img ?? input?.url ?? "",
    ).trim();

  // Send multiple keys so whichever the backend expects is present.
  const body = {
    name,
    title: name,          // some DTOs use "title"
    description,
    imageUrl: img,
    image: img,
    img: img,
    url: img,
  };

  try {
    return await post("/admin/categories", body);
  } catch (e) {
    // If the admin route rejects due to mapping/handler/validation differences,
    // try the public path that many backends expose with role guards.
    const recoverable = [400, 404, 405, 415, 422, 500];
    if (recoverable.includes(e?.status)) {
      return await post("/categories", body);
    }
    throw e;
  }
}

async function updateCategory(id, input) {
  const name =
    String(input?.name ?? input?.title ?? "").trim();
  const description = String(input?.description ?? "").trim();
  const img =
    String(
      input?.imageUrl ?? input?.image ?? input?.img ?? input?.url ?? "",
    ).trim();

  const body = {
    name,
    title: name,
    description,
    imageUrl: img,
    image: img,
    img: img,
    url: img,
  };

  try {
    return await put(`/admin/categories/${id}`, body);
  } catch (e) {
    const recoverable = [400, 404, 405, 415, 422, 500];
    if (recoverable.includes(e?.status)) {
      return await put(`/categories/${id}`, body);
    }
    throw e;
  }
}

async function deleteCategory(id) {
  try {
    return await del(`/admin/categories/${id}`);
  } catch (e) {
    const recoverable = [404, 405, 500];
    if (recoverable.includes(e?.status)) {
      return await del(`/categories/${id}`);
    }
    throw e;
  }
}

/* ===================== DEFAULT EXPORT (with feature APIs) ===================== */
const Api = {
  get,
  post,
  put,
  del,
  resolveApiUrl,
  getToken,
  setToken,
  clearToken,

  AuthAPI,
  ReviewsAPI,
  FavoritesAPI,
  BookingAPI,
  AdminAPI,
  AdminDashboardAPI,
  CitiesAPI,

  // Categories admin helpers
  uploadCategoryImage,
  createCategory,
  updateCategory,
  deleteCategory,

  // ---- Safe aliases so legacy hooks/components keep working ----
  getFavorites: () => FavoritesAPI.list(),
  addFavorite: (id) => FavoritesAPI.add(id),
  removeFavorite: (id) => FavoritesAPI.remove(id),

  // Some places call this directly
  getCategories: () => get("/categories", { auth: false }),
  getCities: () => CitiesAPI.list(),
};

export default Api;
export { Api };
