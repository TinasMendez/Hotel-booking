import { api } from "./api";

/** Fetch paginated products (backed by Spring Page<>). */
export async function getProducts({
  page = 0,
  size = 12,
  q,
  cityId,
  categoryId,
  start,
  end,
} = {}) {
  const params = { page, size };
  if (q) params.q = q;
  if (cityId) params.cityId = cityId;
  if (categoryId) params.categoryId = categoryId;
  if (start) params.start = start;   // expected by your backend advanced search
  if (end) params.end = end;

  const { data } = await api.get("/api/products", { params });

  const content = Array.isArray(data?.content) ? data.content : (Array.isArray(data) ? data : []);
  return {
    items: content,
    total: data?.totalElements ?? content.length ?? 0,
    page: data?.number ?? page,
    size: data?.size ?? size,
  };
}

/** Single product by id. */
export async function getProduct(id) {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
}

export default { getProducts, getProduct };
