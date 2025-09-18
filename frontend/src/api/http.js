// src/api/http.js
// Fetch wrapper aligned with services/api.js helpers.

import { getToken, resolveApiUrl } from "../services/api.js";

function buildHeaders(includeJson = true) {
  const headers = includeJson ? { "Content-Type": "application/json" } : {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function parseResponse(res) {
  if (res.status === 204) return null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  if (contentType.startsWith("text/")) {
    return res.text();
  }
  return null;
}

function toError(res, payload) {
  const message = payload?.message || payload?.error || `${res.status} ${res.statusText}`;
  const error = new Error(message);
  error.response = { status: res.status, data: payload };
  return error;
}

export async function httpGet(path, { params, headers } = {}) {
  const url = resolveApiUrl(path, params);
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: { ...buildHeaders(false), ...headers },
  });
  const payload = await parseResponse(res);
  if (!res.ok) throw toError(res, payload);
  return payload;
}

export async function httpPost(path, body, { params, headers } = {}) {
  const url = resolveApiUrl(path, params);
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { ...buildHeaders(!(body instanceof FormData)), ...headers },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  const payload = await parseResponse(res);
  if (!res.ok) throw toError(res, payload);
  return payload;
}

export async function httpPut(path, body, { params, headers } = {}) {
  const url = resolveApiUrl(path, params);
  const res = await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: { ...buildHeaders(!(body instanceof FormData)), ...headers },
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
  const payload = await parseResponse(res);
  if (!res.ok) throw toError(res, payload);
  return payload;
}

export async function httpDelete(path, { params, headers } = {}) {
  const url = resolveApiUrl(path, params);
  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: { ...buildHeaders(false), ...headers },
  });
  const payload = await parseResponse(res);
  if (!res.ok) throw toError(res, payload);
  return payload;
}
