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

import java.util.List;
import java.util.stream.Collectors;

/**
 * Favorite service:
 * - Authenticated user is retrieved from SecurityContext (username = email)
 * - We validate product existence to avoid orphan favorites
 */
@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository,
                               ProductRepository productRepository,
                               UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public FavoriteResponseDTO addFavorite(Long productId) {
        Long userId = currentUserId();
        productRepository.findById(productId).orElseThrow(() ->
                new ResourceNotFoundException("Product not found with id: " + productId));

        if (!favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            Favorite f = new Favorite(userId, productId);
            f = favoriteRepository.save(f);
            return new FavoriteResponseDTO(f.getId(), f.getProductId(), f.getCreatedAt());
        } else {
            Favorite f = favoriteRepository.findByUserIdAndProductId(userId, productId).get();
            return new FavoriteResponseDTO(f.getId(), f.getProductId(), f.getCreatedAt());
        }
    }

    @Override
    public void removeFavorite(Long productId) {
        Long userId = currentUserId();
        favoriteRepository.deleteByUserIdAndProductId(userId, productId);
    }

    @Override
    public List<FavoriteResponseDTO> listMyFavorites() {
        Long userId = currentUserId();
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(f -> new FavoriteResponseDTO(f.getId(), f.getProductId(), f.getCreatedAt()))
                .collect(Collectors.toList());
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // we set email as username
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
        return u.getId();
    }
}

