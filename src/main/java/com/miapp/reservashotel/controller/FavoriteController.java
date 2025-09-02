package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.FavoriteResponseDTO;
import com.miapp.reservashotel.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Favorites endpoints for the authenticated user
 */
@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity<FavoriteResponseDTO> add(@PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.addFavorite(productId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> remove(@PathVariable Long productId) {
        favoriteService.removeFavorite(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavoriteResponseDTO>> listMine() {
        return ResponseEntity.ok(favoriteService.listMyFavorites());
    }
}

