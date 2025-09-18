import Api from "/src/services/api.js";

/** Return an array of cities: [{id, name, ...}] */
export async function getCities() {
const { data } = await Api.get("/cities");
if (Array.isArray(data)) return data;
if (Array.isArray(data?.content)) return data.content;
return [];
}
