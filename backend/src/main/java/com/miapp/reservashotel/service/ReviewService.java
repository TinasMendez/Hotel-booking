package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;

import java.util.List;

/**
 * Review service.
 * We keep the existing create(dto, email) for compatibility and add a robust
 * createForUser(dto, userId) that uses the JWT uid directly.
 */
public interface ReviewService {
    // New: create binding to a specific user id (preferred)
    ReviewResponseDTO createForUser(ReviewRequestDTO dto, Long userId);

    // Existing: fallback using authenticated email
    ReviewResponseDTO create(ReviewRequestDTO dto, String authenticatedEmail);

    ReviewResponseDTO update(Long reviewId, ReviewRequestDTO dto);
    void delete(Long reviewId);
    List<ReviewResponseDTO> listByProduct(Long productId);
}
