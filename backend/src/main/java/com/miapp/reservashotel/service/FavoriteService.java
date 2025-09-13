package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.FavoriteResponseDTO;

import java.util.List;

public interface FavoriteService {
    FavoriteResponseDTO addFavorite(Long productId);
    void removeFavorite(Long productId);
    List<FavoriteResponseDTO> listMyFavorites();
}
