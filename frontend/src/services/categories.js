import { api } from "./api";

/** Return an array of categories: [{id, name, ...}] */
export async function getCategories() {
    const { data } = await api.get("/api/categories");
    // Accept either a list or a Page wrapper
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
    }
