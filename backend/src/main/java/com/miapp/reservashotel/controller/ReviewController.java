package com.miapp.reservashotel.controller;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Reviews controller placeholder.
 *
 * This controller is disabled by default via @ConditionalOnProperty.
 * When reviews feature is implemented, set features.reviews.enabled=true
 * and replace this placeholder with the real implementation.
 */
@RestController
@RequestMapping("/api/reviews")
@ConditionalOnProperty(name = "features.reviews.enabled", havingValue = "true", matchIfMissing = false)
public class ReviewController {

    /** Returns 501 to indicate the feature is intentionally disabled for now. */
    @GetMapping
    public ResponseEntity<?> list() {
        return ResponseEntity.status(501).body(Map.of("message", "Reviews feature is disabled"));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> listByProduct(@PathVariable Long productId) {
        return ResponseEntity.status(501).body(Map.of("message", "Reviews feature is disabled"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> myReviews() {
        return ResponseEntity.status(501).body(Map.of("message", "Reviews feature is disabled"));
    }

    @PostMapping
    public ResponseEntity<?> create() {
        return ResponseEntity.status(501).body(Map.of("message", "Reviews feature is disabled"));
    }
}


