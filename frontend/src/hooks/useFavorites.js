import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

/**
 * Encapsulates favorites CRUD with optimistic UI and error handling.
 * Expected backend routes:
 *  - GET    /api/v1/favorites           -> [{ productId }]
 *  - POST   /api/v1/favorites/:id       -> 201
 *  - DELETE /api/v1/favorites/:id       -> 204
 */
export function useFavorites(enabled = true) {
  const [ids, setIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const { data } = await api.get("/api/v1/favorites");
      const set = new Set((data || []).map((x) => Number(x.productId || x)));
      setIds(set);
    } catch {
      // Keep UI usable even if favorites fail to load
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isFav = useCallback((productId) => ids.has(Number(productId)), [ids]);

  const toggle = useCallback(
    async (productId) => {
      const id = Number(productId);
      const optimistic = new Set(ids);
      const already = optimistic.has(id);

      if (already) optimistic.delete(id);
      else optimistic.add(id);
      setIds(optimistic);

      try {
        if (already) await api.delete(`/api/v1/favorites/${id}`);
        else await api.post(`/api/v1/favorites/${id}`);
      } catch {
        const revert = new Set(ids);
        setIds(revert);
      }
    },
    [ids]
  );

  return { ids, isFav, toggle, loading, refresh: fetchAll };
}
