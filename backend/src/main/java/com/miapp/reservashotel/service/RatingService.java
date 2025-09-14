// backend/src/main/java/com/miapp/reservashotel/service/RatingService.java
package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.RatingRequestDTO;
import com.miapp.reservashotel.dto.RatingResponseDTO;

import java.util.List;

/**
 * Ratings business operations.
 */
public interface RatingService {
    RatingResponseDTO createOrUpdate(RatingRequestDTO dto);

    void delete(Long ratingId);

    List<RatingResponseDTO> listByProduct(Long productId);

    Double averageForProduct(Long productId);
}
