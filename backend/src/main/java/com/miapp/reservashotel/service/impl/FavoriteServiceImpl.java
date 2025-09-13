package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Favorite;
import com.miapp.reservashotel.repository.FavoriteRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteServiceImpl {

  private final FavoriteRepository favoriteRepository;
  private final ProductRepository productRepository;

  public FavoriteServiceImpl(FavoriteRepository favoriteRepository, ProductRepository productRepository) {
    this.favoriteRepository = favoriteRepository;
    this.productRepository = productRepository;
  }

  @Transactional
  public void addFavorite(Long userId, Long productId) {
    if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
      Favorite fav = new Favorite();
      fav.setUserId(userId);
      fav.setProductId(productId);
      favoriteRepository.save(fav);
    }
  }

  @Transactional
  public void removeFavorite(Long userId, Long productId) {
    favoriteRepository.deleteByUserIdAndProductId(userId, productId);
  }

  public boolean isFavorite(Long userId, Long productId) {
    return favoriteRepository.existsByUserIdAndProductId(userId, productId);
  }

  public List<Favorite> listFavorites(Long userId) {
    return favoriteRepository.findByUserId(userId);
  }
}


