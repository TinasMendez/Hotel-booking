import Api from "/src/services/api.js";

/** Return an array of categories: [{id, name, ...}] */
export async function getCategories() {
    const { data } = await Api.get("/api/categories");
    // Accept either a list or a Page wrapper
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
    }
