package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;
import com.miapp.reservashotel.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Reviews endpoints:
 * - Public GET by product
 * - Authenticated POST/PUT/DELETE
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    public ReviewController(ReviewService reviewService) { this.reviewService = reviewService; }

    @PostMapping
    public ResponseEntity<ReviewResponseDTO> create(@Valid @RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.ok(reviewService.create(dto));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDTO> update(@PathVariable Long reviewId,
                                                    @Valid @RequestBody ReviewRequestDTO dto) {
        return ResponseEntity.ok(reviewService.update(reviewId, dto));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewId) {
        reviewService.delete(reviewId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponseDTO>> listByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.listByProduct(productId));
    }
}

