package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;
import com.miapp.reservashotel.model.Review;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.ReviewRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.ReviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * ReviewServiceImpl
 * - Prefer createForUser(dto, userId) to avoid ambiguity.
 * - Map DTO including userName computed from User (firstName + lastName).
 */
@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository repo;
    private final UserRepository users;

    public ReviewServiceImpl(ReviewRepository repo, UserRepository users) {
        this.repo = repo;
        this.users = users;
    }

    @Override
    @Transactional
    public ReviewResponseDTO createForUser(ReviewRequestDTO dto, Long userId) {
        if (userId == null) throw new IllegalArgumentException("userId is required");
        User u = users.findById(userId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: id=" + userId));

        // Enforce single review per user per product
        repo.findByUserIdAndProductId(u.getId(), dto.getProductId()).ifPresent(r -> {
            throw new IllegalStateException("You have already reviewed this product.");
        });

        Review r = new Review(dto.getProductId(), u.getId(), u.getEmail(), dto.getRating(), dto.getComment());
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(null);

        Review saved = repo.save(r);
        return toDTO(saved, u);
    }

    @Override
    @Transactional
    public ReviewResponseDTO create(ReviewRequestDTO dto, String authenticatedEmail) {
        if (authenticatedEmail == null || authenticatedEmail.isBlank()) {
            throw new IllegalArgumentException("Authenticated email is required");
        }
        User u = users.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + authenticatedEmail));

        // Enforce single review per user per product
        repo.findByUserIdAndProductId(u.getId(), dto.getProductId()).ifPresent(r -> {
            throw new IllegalStateException("You have already reviewed this product.");
        });

        Review r = new Review(dto.getProductId(), u.getId(), u.getEmail(), dto.getRating(), dto.getComment());
        r.setCreatedAt(LocalDateTime.now());
        r.setUpdatedAt(null);

        Review saved = repo.save(r);
        return toDTO(saved, u);
    }

    @Override
    @Transactional
    public ReviewResponseDTO update(Long reviewId, ReviewRequestDTO dto) {
        Review r = repo.findById(reviewId).orElseThrow(() -> new NoSuchElementException("Review not found: " + reviewId));
        r.setRating(dto.getRating());
        r.setComment(dto.getComment());
        r.setUpdatedAt(LocalDateTime.now());

        Review saved = repo.save(r);

        User u = users.findById(saved.getUserId()).orElse(null);
        return toDTO(saved, u);
    }

    @Override
    @Transactional
    public void delete(Long reviewId) {
        repo.deleteById(reviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponseDTO> listByProduct(Long productId) {
        List<Review> list = repo.findByProductIdOrderByCreatedAtDesc(productId);
        if (list.isEmpty()) return List.of();

        // Batch-load users to avoid N+1
        Set<Long> userIds = list.stream().map(Review::getUserId).collect(Collectors.toSet());
        Map<Long, User> usersById = users.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, u -> u));

        List<ReviewResponseDTO> out = new ArrayList<>(list.size());
        for (Review r : list) {
            out.add(toDTO(r, usersById.get(r.getUserId())));
        }
        return out;
    }

    /** Map entity to DTO, computing userName from User when available. */
    private ReviewResponseDTO toDTO(Review r, User u) {
        String userName = null;
        if (u != null) {
            String fn = Optional.ofNullable(u.getFirstName()).orElse("").trim();
            String ln = Optional.ofNullable(u.getLastName()).orElse("").trim();
            String full = (fn + " " + ln).trim();
            userName = full.isEmpty() ? null : full;
        }

        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(r.getId());
        dto.setProductId(r.getProductId());
        dto.setUserEmail(r.getUserEmail());
        dto.setUserName(userName); // display name
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }
}
