package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserIdAndProductId(Long userId, Long productId);
    Optional<Favorite> findByUserIdAndProductId(Long userId, Long productId);
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}
