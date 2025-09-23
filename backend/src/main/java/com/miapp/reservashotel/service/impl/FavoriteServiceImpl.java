// backend/src/main/java/com/miapp/reservashotel/service/impl/FavoriteServiceImpl.java
package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.FavoriteResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Favorite;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.FavoriteRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.FavoriteService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- IMPORTANTE

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Favorite service:
 * - Uses SecurityContext to resolve the authenticated user (username = email).
 * - Validates product existence before creating a favorite.
 * - Converts entity Instant -> DTO LocalDateTime for createdAt.
 */
@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteServiceImpl(
            FavoriteRepository favoriteRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional // <-- escribe (create or get existing)
    public FavoriteResponseDTO addFavorite(Long productId) {
        Long userId = currentUserId();

        // Ensure product exists
        productRepository.findById(productId).orElseThrow(
                () -> new ResourceNotFoundException("Product not found with id: " + productId)
        );

        // Create if not exists; otherwise return existing
        Favorite f = favoriteRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> favoriteRepository.save(new Favorite(userId, productId)));

        return new FavoriteResponseDTO(
                f.getId(),
                f.getProductId(),
                toLocalDateTime(f.getCreatedAt())
        );
    }

    @Override
    @Transactional // <-- escribe (delete); si no existe, borra 0 filas y no lanza excepción
    public void removeFavorite(Long productId) {
        Long userId = currentUserId();
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
        // idempotente: no importa si no existía, devolvemos 204 desde el controller
    }

    @Override
    @Transactional(readOnly = true) // <-- solo lectura
    public List<FavoriteResponseDTO> listMyFavorites() {
        Long userId = currentUserId();
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(f -> new FavoriteResponseDTO(
                        f.getId(),
                        f.getProductId(),
                        toLocalDateTime(f.getCreatedAt())
                ))
                .collect(Collectors.toList());
    }

    /** Resolve current user id from SecurityContext (principal = email). */
    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("No authenticated user in context");
        }
        String email = auth.getName();
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
        return u.getId();
    }

    private static LocalDateTime toLocalDateTime(Instant instant) {
        if (instant == null) return null;
        return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
    }
}
