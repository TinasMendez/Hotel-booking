// frontend/src/services/products.js
// Centralized product-related API helpers. Keeps responses consistent across the app.

import Api from "./api.js";

/** Fetch a single product by id. */
export async function getProduct(id) {
  // Api.get returns the parsed body directly
  const data = await Api.get(`/products/${id}`);
  return data;
}

/** Fetch all categories. Accepts both paged and plain-array backends. */
export async function getCategories() {
  const data = await Api.get("/categories");
  if (Array.isArray(data?.content)) return data.content;
  return Array.isArray(data) ? data : [];
}

/**
 * Fetch all products for the Home page.
 * 1) Try GET /products (paged or array).
 * 2) If that yields nothing, fall back to /products/search with no filters.
 */
export async function getAllProducts({ page = 0, size = 100 } = {}) {
  try {
    const data = await Api.get("/products", { params: { page, size } });
    let list = Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data)
        ? data
        : [];
    if (list.length) return list;
  } catch (_) {}
  try {
    const data = await Api.get("/products/search", { params: { page, size } });
    return Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data)
        ? data
        : [];
  } catch (_) {
    return [];
  }
}

/** Fetch up to `limit` random products. */
export async function getRandomProducts(limit = 10) {
  const data = await Api.get("/products/random", { params: { limit } });
  return Array.isArray(data) ? data : [];
}

/** Search products with optional filters; returns the backend page object. */
export async function searchProducts(params = {}) {
  const query = {
    categoryId: params.categoryId ?? undefined,
    cityId: params.cityId ?? undefined,
    featureId: params.featureId ?? undefined,
    minPrice: params.minPrice ?? undefined,
    maxPrice: params.maxPrice ?? undefined,
    q: params.q ?? undefined,
    page: params.page ?? 0,
    size: params.size ?? 100,
  };
  const data = await Api.get("/products/search", { params: query });
  return data; // may be page object or array depending on backend
}

/** Admin helpers */
export async function createProduct(payload) {
  const data = await Api.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const data = await Api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  await Api.delete(`/products/${id}`);
}
