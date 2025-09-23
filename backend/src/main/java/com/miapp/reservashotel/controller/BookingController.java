package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Booking controller exposes booking-related endpoints:
 * - check availability
 * - create booking (uses authenticated user if customerId not provided)
 * - get bookings by customer
 * - get bookings by product
 * - get bookings of the current authenticated user
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(BookingService bookingService, UserRepository userRepository) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/bookings/availability
     * Example: /api/bookings/availability?productId=1&startDate=2025-09-20&endDate=2025-09-22
     */
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> availability(
            @RequestParam Long productId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        boolean available = bookingService.isProductAvailable(productId, startDate, endDate);
        Map<String, Object> resp = new LinkedHashMap<>();
        resp.put("productId", productId);
        resp.put("startDate", startDate);
        resp.put("endDate", endDate);
        resp.put("available", available);
        return ResponseEntity.ok(resp);
    }

    /**
     * GET bookings for a customer (history).
     * Example: GET /api/bookings/customer/5
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }

    /**
     * GET bookings for a product (useful to build calendar of blocked dates).
     * Example: GET /api/bookings/product/3
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BookingResponseDTO>> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(bookingService.getBookingsByProductId(productId));
    }

    /**
     * GET bookings for the authenticated user ("My bookings" view).
     */
    @GetMapping("/me")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getBookingsForCurrentUser());
    }

    /**
     * Backward-compatibility alias for UIs that call /mine.
     */
    @GetMapping("/mine")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookingsAlias() {
        return getMyBookings();
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> getOne(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.getBookingAccessibleToCurrentUser(bookingId));
    }

    /**
     * Create a booking. If customerId is not provided in the DTO, resolve it from the authenticated user.
     */
    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(
            @RequestBody BookingRequestDTO dto,
            Authentication authentication
    ) {
        // If customerId not provided by frontend, resolve from authenticated user
        if (dto.getCustomerId() == null && authentication != null) {
            // We authenticate by email; principal name = email
            String email = authentication.getName();
            User u = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + email));
            dto.setCustomerId(u.getId());
        }

        BookingResponseDTO saved = bookingService.createBooking(dto);
        return ResponseEntity.ok(saved);
    }

    /**
     * Cancel a booking. Only booking owner or admin can cancel.
     */
    @DeleteMapping("/{bookingId}")
    public ResponseEntity<BookingResponseDTO> cancel(@PathVariable Long bookingId) {
        return ResponseEntity.ok(bookingService.cancelBooking(bookingId));
    }
}
