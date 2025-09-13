package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.FavoriteRequestDTO;
import com.miapp.reservashotel.model.Favorite;
import com.miapp.reservashotel.service.impl.FavoriteServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

  private final FavoriteServiceImpl favoriteService;

  public FavoriteController(FavoriteServiceImpl favoriteService) {
    this.favoriteService = favoriteService;
  }

  @PostMapping("/{productId}")
  public ResponseEntity<Void> add(@PathVariable Long productId, @RequestBody FavoriteRequestDTO dto) {
    favoriteService.addFavorite(dto.getUserId(), productId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{productId}")
  public ResponseEntity<Void> remove(@PathVariable Long productId, @RequestBody FavoriteRequestDTO dto) {
    favoriteService.removeFavorite(dto.getUserId(), productId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping
  public ResponseEntity<List<Favorite>> list(@RequestParam("userId") Long userId) {
    return ResponseEntity.ok(favoriteService.listFavorites(userId));
  }

  @GetMapping("/is-favorite/{productId}")
  public ResponseEntity<Boolean> isFavorite(@PathVariable Long productId, @RequestParam("userId") Long userId) {
    return ResponseEntity.ok(favoriteService.isFavorite(userId, productId));
  }
}


