package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.bookings.BookingResponse;
import com.miapp.reservashotel.dto.bookings.CreateBookingRequest;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Booking service using JPA relations (Booking.product, Booking.user).
 * Provides availability, creation, and "my bookings".
 */
@Service
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          ProductRepository productRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    /** Returns blocked dates (inclusive) within a range for a product. */
    @Transactional(readOnly = true)
    public List<LocalDate> getBlockedDates(Long productId, LocalDate start, LocalDate end) {
        if (productId == null || start == null || end == null) {
            throw new IllegalArgumentException("productId, start and end are required");
        }
        if (end.isBefore(start)) {
            throw new IllegalArgumentException("end must be >= start");
        }
        List<Booking> overlaps = bookingRepository.findOverlapping(productId, start, end);
        Set<LocalDate> days = new LinkedHashSet<>();
        for (Booking b : overlaps) {
            LocalDate d = b.getStartDate();
            while (!d.isAfter(b.getEndDate())) {
                if (!d.isBefore(start) && !d.isAfter(end)) {
                    days.add(d);
                }
                d = d.plusDays(1);
            }
        }
        return new ArrayList<>(days);
    }

    /** Creates a booking for the authenticated user. */
    public BookingResponse create(CreateBookingRequest req, Authentication auth) {
        if (req == null || req.getProductId() == null || req.getStartDate() == null || req.getEndDate() == null) {
            throw new IllegalArgumentException("productId, startDate and endDate are required");
        }
        if (req.getEndDate().isBefore(req.getStartDate())) {
            throw new IllegalArgumentException("endDate must be >= startDate");
        }

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + req.getProductId()));

        String email = resolveEmail(auth);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found email=" + email));

        long conflicts = bookingRepository.countConflicts(product.getId(), req.getStartDate(), req.getEndDate());
        if (conflicts > 0) {
            throw new IllegalStateException("Selected dates overlap with an existing booking");
        }

        Booking b = new Booking();
        b.setProduct(product);
        b.setUser(user);
        b.setStartDate(req.getStartDate());
        b.setEndDate(req.getEndDate());
        b.setStatus(BookingStatus.CONFIRMED); // or PENDING if desired

        Booking saved = bookingRepository.save(b);
        return toResponse(saved);
    }

    /** Returns bookings of the authenticated user, newest first. */
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Authentication auth) {
        String email = resolveEmail(auth);
        // NOTE: method name matches repository exactly
        List<Booking> list = bookingRepository.findByUser_EmailOrderByCreatedAtDesc(email);
        return list.stream().map(this::toResponse).toList();
    }

    private String resolveEmail(Authentication auth) {
        if (auth != null && auth.getName() != null) return auth.getName();
        throw new IllegalArgumentException("Authentication is required");
    }

    private BookingResponse toResponse(Booking b) {
        BookingResponse r = new BookingResponse();
        r.setId(b.getId());
        r.setProductId(b.getProduct() != null ? b.getProduct().getId() : null);
        r.setUserEmail(b.getUser() != null ? b.getUser().getEmail() : null);
        r.setStartDate(b.getStartDate());
        r.setEndDate(b.getEndDate());
        r.setStatus(b.getStatus());
        r.setCreatedAt(b.getCreatedAt());
        r.setUpdatedAt(b.getUpdatedAt());
        return r;
    }
}

