// backend/src/main/java/com/miapp/reservashotel/controller/RatingController.java
package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.RatingRequestDTO;
import com.miapp.reservashotel.dto.RatingResponseDTO;
import com.miapp.reservashotel.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Ratings REST controller.
 * Security rules (who can create/delete) are enforced in SecurityConfig.
 */
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<RatingResponseDTO> createOrUpdate(@Valid @RequestBody RatingRequestDTO dto) {
        return ResponseEntity.ok(ratingService.createOrUpdate(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ratingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RatingResponseDTO>> listByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.listByProduct(productId));
    }

    @GetMapping("/product/{productId}/average")
    public ResponseEntity<Double> average(@PathVariable Long productId) {
        return ResponseEntity.ok(ratingService.averageForProduct(productId));
    }
}
