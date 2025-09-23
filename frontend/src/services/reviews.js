// frontend/src/services/reviews.js
// Reviews API client kept separate to avoid touching your shared api.js.
// Uses the same base URL logic you ya usas: window.ENV o VITE_API_BASE_URL o relativo.

const BASE =
  (typeof window !== "undefined" && window.ENV && window.ENV.API_BASE_URL) ||
  import.meta?.env?.VITE_API_BASE_URL ||
  "";

/** Helper to build URLs with /api/v1 prefix consistently */
function v1(path) {
  // ensures single slash and /api/v1 prefix
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}/api/v1${p}`;
}

/** Standard headers (JSON) */
function jsonHeaders() {
  const h = { "Content-Type": "application/json" };
  try {
    const raw = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    if (raw) h.Authorization = `Bearer ${raw}`;
  } catch { /* ignore */ }
  return h;
}

/** GET /api/v1/reviews/product/:productId */
export async function listByProduct(productId) {
  const res = await fetch(v1(`/reviews/product/${productId}`), {
    method: "GET",
    headers: jsonHeaders(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(text || `Failed to load reviews (${res.status})`);
    err.response = { status: res.status, data: text };
    throw err;
  }
  return res.json();
}

/** POST /api/v1/reviews  { productId, rating, comment } */
export async function create({ productId, rating, comment }) {
  const res = await fetch(v1(`/reviews`), {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify({ productId, rating, comment }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(text || `Failed to create review (${res.status})`);
    err.response = { status: res.status, data: text };
    throw err;
  }
  return res.json();
}
