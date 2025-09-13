package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;

import java.util.List;

public interface ReviewService {
    ReviewResponseDTO create(ReviewRequestDTO dto);
    ReviewResponseDTO update(Long reviewId, ReviewRequestDTO dto);
    void delete(Long reviewId);
    List<ReviewResponseDTO> listByProduct(Long productId);
}

