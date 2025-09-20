// frontend/src/services/products.js
// Centralized product-related API helpers. Keeps responses consistent across the app.

import Api from "./api.js";

/** Fetch a single product by id. */
export async function getProduct(id) {
  const { data } = await Api.get(`/products/${id}`);
  const featureSummaries = Array.isArray(data?.featureSummaries)
    ? data.featureSummaries
    : Array.isArray(data?.features)
    ? data.features
    : [];
  return { ...data, featureSummaries };
}

/** Fetch all categories. Accepts both paged and plain-array backends. */
export async function getCategories() {
  const { data } = await Api.get("/categories");
  if (Array.isArray(data?.content)) return data.content;
  return Array.isArray(data) ? data : [];
}

/** Fetch up to 10 random products, guaranteed as an array. */
export async function getRandomProducts(limit = 10) {
  const { data } = await Api.get("/products/random", { params: { limit } });
  return Array.isArray(data) ? data : [];
}

/** Search products with optional filters; returns the page object from backend. */
export async function searchProducts(params = {}) {
  const query = {
    categoryId: params.categoryId ?? undefined,
    cityId: params.cityId ?? undefined,
    featureId: params.featureId ?? undefined,
    minPrice: params.minPrice ?? undefined,
    maxPrice: params.maxPrice ?? undefined,
    q: params.q ?? undefined,
    page: params.page ?? 0,
    size: params.size ?? 10,
  };
  const { data } = await Api.get("/products/search", { params: query });
  return data;
}

/** Admin helpers */
export async function createProduct(payload) {
  const { data } = await Api.post("/products", payload);
  return data;
}

export async function updateProduct(id, payload) {
  const { data } = await Api.put(`/products/${id}`, payload);
  return data;
}

export async function deleteProduct(id) {
  await Api.delete(`/products/${id}`);
}
