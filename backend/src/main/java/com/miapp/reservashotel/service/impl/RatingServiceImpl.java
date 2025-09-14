// backend/src/main/java/com/miapp/reservashotel/service/impl/RatingServiceImpl.java
package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.RatingRequestDTO;
import com.miapp.reservashotel.dto.RatingResponseDTO;
import com.miapp.reservashotel.model.Rating;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.RatingRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.RatingService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

/**
 * Rating service using simple foreign keys in the entity (userId, productId).
 * Resolves the authenticated user via email as username.
 */
@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepo;
    private final UserRepository userRepo;

    public RatingServiceImpl(RatingRepository ratingRepo, UserRepository userRepo) {
        this.ratingRepo = ratingRepo;
        this.userRepo = userRepo;
    }

    @Override
    public RatingResponseDTO createOrUpdate(RatingRequestDTO dto) {
        Long userId = currentUserId();

        Rating rating = ratingRepo.findByUserIdAndProductId(userId, dto.getProductId())
                .orElseGet(Rating::new);

        // Map fields
        rating.setUserId(userId);
        rating.setProductId(dto.getProductId());
        rating.setScore(dto.getScore());
        rating.setComment(dto.getComment());
        if (rating.getCreatedAt() == null) {
            rating.setCreatedAt(Instant.now());
        }

        Rating saved = ratingRepo.save(rating);
        return toDto(saved);
    }

    @Override
    public void delete(Long ratingId) {
        ratingRepo.deleteById(ratingId);
    }

    @Override
    public List<RatingResponseDTO> listByProduct(Long productId) {
        return ratingRepo.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public Double averageForProduct(Long productId) {
        return ratingRepo.averageScoreByProductId(productId);
    }

    // ----------------- helpers -----------------

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth == null ? null : auth.getName();
        if (email == null) throw new IllegalStateException("No authenticated user");
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        return user.getId();
    }

    private RatingResponseDTO toDto(Rating r) {
        return new RatingResponseDTO(
                r.getId(),
                r.getProductId(),
                r.getUserId(),
                r.getScore(),
                r.getComment(),
                r.getCreatedAt()
        );
    }
}
