// src/hooks/useFavorites.js
// Favorites state powered by services/api.js (uses the same token as the rest of the app)

import { useCallback, useEffect, useRef, useState } from "react";
import { Api } from "../services/api.js";

export default function useFavorites() {
  const mountedRef = useRef(false);
  const [list, setList] = useState([]); // array of productIds (numbers)
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const data = await Api.getFavorites(); // [{id, productId, createdAt}, ...]
      const ids = Array.isArray(data)
        ? data
            .map((f) =>
              typeof f === "object" ? Number(f.productId) : Number(f),
            )
            .filter((n) => Number.isFinite(n))
        : [];
      setList(ids);
      return ids;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      reload().catch(() => {});
    }
  }, [reload]);

  const isFavorite = useCallback(
    (productId) => list.includes(Number(productId)),
    [list],
  );

  const add = useCallback(
    async (productId) => {
      await Api.addFavorite(Number(productId));
      const ids = await reload();
      return ids.includes(Number(productId));
    },
    [reload],
  );

  const remove = useCallback(
    async (productId) => {
      await Api.removeFavorite(Number(productId));
      const ids = await reload();
      return ids.includes(Number(productId)) === false;
    },
    [reload],
  );

  const toggle = useCallback(
    async (productId) => {
      const pid = Number(productId);
      if (list.includes(pid)) {
        await Api.removeFavorite(pid);
      } else {
        await Api.addFavorite(pid);
      }
      const ids = await reload();
      return ids.includes(pid); // final state
    },
    [list, reload],
  );

  return { list, loading, isFavorite, add, remove, toggle, reload };
}
