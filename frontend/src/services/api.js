// /frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export function getToken(){return localStorage.getItem("token") ?? "";}
export function saveToken(t){ if(t) localStorage.setItem("token", t); }
export function clearToken(){ localStorage.removeItem("token"); }

async function request(path,{method="GET",body,auth=false}={}){ /* ... como te pasé ... */ }

export const Api = {
  login:(email,password)=>request(`/api/auth/login`,{method:"POST",body:{email,password}}),
  register:(payload)=>request(`/api/auth/register`,{method:"POST",body:payload}),
  me:()=>request(`/api/auth/me`,{auth:true}),
  getProductById:(id)=>request(`/api/products/${id}`),
  getProductAvailability:(id,startDate,endDate)=>request(`/api/bookings/availability?productId=${id}&startDate=${startDate}&endDate=${endDate}`),
  getCategories:()=>request(`/api/categories`),
  deleteCategory:(id)=>request(`/api/categories/${id}`,{method:"DELETE",auth:true}),
  getFavorites:()=>request(`/api/favorites`,{auth:true}),
  addFavorite:(productId)=>request(`/api/favorites`,{method:"POST",auth:true,body:{productId}}),
  removeFavorite:(productId)=>request(`/api/favorites/${productId}`,{method:"DELETE",auth:true}),
  getProductRating:(id)=>request(`/api/products/${id}/rating`),
  rateProduct:(id,stars)=>request(`/api/products/${id}/rating`,{method:"POST",auth:true,body:{rating:stars}})
};

// ===== Legacy helpers to keep old code working (Axios-like) =====
// Allow calls like Api.get("/api/products/3")
Api.get = (path, opts) => request(path, { ...(opts || {}), method: "GET" });

Api.post = (path, body, opts) =>
  request(path, { ...(opts || {}), method: "POST", body });

Api.put = (path, body, opts) =>
  request(path, { ...(opts || {}), method: "PUT", body });

Api.delete = (path, opts) =>
  request(path, { ...(opts || {}), method: "DELETE" });

// Optional: keep { api } named import alive
export const api = Api;

export default Api;
