package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;
import com.miapp.reservashotel.service.ReviewService;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;

/**
 * Reviews endpoints.
 * We now prefer userId from JWT claims ("uid") for unambiguous attribution.
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviews;

    public ReviewController(ReviewService reviews) {
        this.reviews = reviews;
    }

    /** GET /api/reviews/product/{productId} -> 200 [ ] if none */
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> listByProduct(@PathVariable Long productId) {
        try {
            List<ReviewResponseDTO> list = reviews.listByProduct(productId);
            return ResponseEntity.ok(list);
        } catch (UnsupportedOperationException ex) { // feature toggled off
            return ResponseEntity.status(501).body(Map.of("message", "Reviews feature is disabled"));
        }
    }

    /** POST /api/reviews  (uses authenticated user via JWT "uid" claim) */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReviewRequestDTO dto, Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Long userId = null;
        try {
            Object details = auth.getDetails();
            if (details instanceof Claims claims) {
                Object uidObj = claims.get("uid");
                if (uidObj instanceof Number n) {
                    userId = n.longValue();
                } else if (uidObj instanceof String s && !s.isBlank()) {
                    userId = Long.parseLong(s);
                }
            }
        } catch (Exception ignored) {}

        ReviewResponseDTO saved;
        if (userId != null) {
            // Strongest attribution: by user id from token
            saved = reviews.createForUser(dto, userId);
        } else {
            // Fallback: by email (Authentication#getName)
            saved = reviews.create(dto, auth.getName());
        }

        return ResponseEntity.created(URI.create("/api/reviews/" + saved.getId())).body(saved);
    }

    /** (optional) PUT /api/reviews/{id} */
    @PutMapping("/{reviewId}")
    public ResponseEntity<?> update(@PathVariable Long reviewId, @RequestBody ReviewRequestDTO dto) {
        ReviewResponseDTO saved = reviews.update(reviewId, dto);
        return ResponseEntity.ok(saved);
    }

    /** (optional) DELETE /api/reviews/{id} */
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> delete(@PathVariable Long reviewId) {
        reviews.delete(reviewId);
        return ResponseEntity.noContent().build();
    }
}
