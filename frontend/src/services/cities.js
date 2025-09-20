import Api from "/src/services/api.js";

/**
 * Recupera un listado de ciudades.
 * Cuando el backend soporta filtrado por texto, se envía el parámetro `q`.
 */
export async function getCities(query = "", options = {}) {
  const paramsFromOptions = options?.params && typeof options.params === "object"
    ? options.params
    : undefined;
  const params = {
    ...(paramsFromOptions || {}),
    ...(query ? { q: query } : {}),
  };

  const requestOptions = {
    ...options,
    ...(Object.keys(params).length ? { params } : {}),
  };

  const { data } = await Api.get("/cities", requestOptions);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}
