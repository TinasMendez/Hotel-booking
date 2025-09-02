package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ReviewRequestDTO;
import com.miapp.reservashotel.dto.ReviewResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.model.Review;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.CustomerRepository;
import com.miapp.reservashotel.repository.ReviewRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.ReviewService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Review rules:
 * - Only authenticated users
 * - Must have at least one booking for the product (by matching Customer.email == User.email)
 *   and booking ended in the past (endDate < today) and not CANCELLED.
 */
@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             UserRepository userRepository,
                             CustomerRepository customerRepository,
                             BookingRepository bookingRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public ReviewResponseDTO create(ReviewRequestDTO dto) {
        User u = currentUser();
        // Validate booking condition
        validateBookingRight(u.getEmail(), dto.getProductId());

        Review r = reviewRepository.findByUserIdAndProductId(u.getId(), dto.getProductId())
                .orElse(new Review(dto.getProductId(), u.getId(), u.getEmail(), dto.getRating(), dto.getComment()));

        // If existed, update; otherwise create
        r.setRating(dto.getRating());
        r.setComment(dto.getComment());
        if (r.getId() == null) {
            r = reviewRepository.save(r);
        } else {
            r.setUpdatedAt(LocalDateTime.now());
            r = reviewRepository.save(r);
        }
        return toDTO(r);
    }

    @Override
    public ReviewResponseDTO update(Long reviewId, ReviewRequestDTO dto) {
        User u = currentUser();
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
        if (!r.getUserId().equals(u.getId())) {
            throw new RuntimeException("You can only update your own reviews");
        }
        r.setRating(dto.getRating());
        r.setComment(dto.getComment());
        r.setUpdatedAt(LocalDateTime.now());
        r = reviewRepository.save(r);
        return toDTO(r);
    }

    @Override
    public void delete(Long reviewId) {
        User u = currentUser();
        Review r = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found: " + reviewId));
        if (!r.getUserId().equals(u.getId())) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public List<ReviewResponseDTO> listByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void validateBookingRight(String userEmail, Long productId) {
        var customerOpt = customerRepository.findByEmail(userEmail);
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("You need at least one booking for this product to review it");
        }
        var customer = customerOpt.get();
        List<Booking> bookings = bookingRepository.findByCustomerId(customer.getId());
        boolean ok = bookings.stream().anyMatch(b ->
                productId.equals(b.getProductId())
                        && b.getEndDate() != null
                        && b.getEndDate().isBefore(LocalDate.now())
                        && b.getStatus() != BookingStatus.CANCELLED
        );
        if (!ok) {
            throw new RuntimeException("You need a past booking for this product to review it");
        }
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
        }
    private ReviewResponseDTO toDTO(Review r) {
        return new ReviewResponseDTO(r.getId(), r.getProductId(), r.getUserEmail(),
                r.getRating(), r.getComment(), r.getCreatedAt(), r.getUpdatedAt());
    }
}

