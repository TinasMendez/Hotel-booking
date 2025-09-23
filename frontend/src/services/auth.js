import Api, { AuthAPI } from "/src/services/api.js";

function extractToken(data) {
  return (
    data?.token ||
    data?.jwt ||
    data?.accessToken ||
    data?.id_token ||
    data?.authorization ||
    null
  );
}

function authError(e) {
  if (e?.response) {
    const { status, data } = e.response;
    const msg = typeof data === "string" ? data : data?.message || "Forbidden";
    return new Error(`HTTP ${status} during login: ${msg}`);
  }
  if (e?.request) return new Error("Network error (no response) during login");
  return new Error(e?.message || "Unknown error during login");
}

/** Returns { token, username, roles } */
export async function loginUser({ email, password }) {
  try {
    const data = await AuthAPI.login({ email, password });
    const token = extractToken(data);
    if (!token) throw new Error("No token in response");
    Api.setToken(token);
    const username =
      data?.username ||
      data?.user?.username ||
      data?.user?.email ||
      data?.email ||
      email;
    const roles = data?.roles || data?.authorities || data?.user?.roles || [];
    return { token, username, roles };
  } catch (e) {
    throw authError(e);
  }
}

// Alias for convenience
export const login = loginUser;
