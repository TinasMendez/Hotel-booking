import { api } from "./api";

/** Return an array of cities: [{id, name, ...}] */
export async function getCities() {
const { data } = await api.get("/api/cities");
if (Array.isArray(data)) return data;
if (Array.isArray(data?.content)) return data.content;
return [];
}
