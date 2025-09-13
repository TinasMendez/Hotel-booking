package com.miapp.reservashotel.service;

import java.util.List;

/**
 * Favorites service contract.
 */
public interface FavoriteService {

    void addFavorite(Long userId, Long productId);

    void removeFavorite(Long userId, Long productId);

    boolean isFavorite(Long userId, Long productId);

    List<Long> getFavoriteProductIds(Long userId);

    /**
     * Optionally returns product IDs paginated (client-side paging is fine for now)
     */
    default List<Long> getFavoriteProductIdsPaged(Long userId, int page, int size) {
        List<Long> all = getFavoriteProductIds(userId);
        int from = Math.max(0, Math.min(page * size, all.size()));
        int to = Math.max(from, Math.min(from + size, all.size()));
        return all.subList(from, to);
    }
}
