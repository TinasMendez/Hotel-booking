package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Bookings.
 * Exposes endpoints to check product availability and to create/manage bookings.
 * Availability endpoint is GET and can be public; creating a booking typically requires JWT.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    // Manual constructor (no Lombok)
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * GET /api/bookings/availability?productId=1&startDate=2025-09-20&endDate=2025-09-22
     * Returns: { "available": true/false }
     */
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @RequestParam("productId") Long productId,
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        boolean available = bookingService.isProductAvailable(productId, start, end);
        Map<String, Object> body = new HashMap<>();
        body.put("available", available);
        return ResponseEntity.ok(body);
    }

    /**
     * POST /api/bookings
     * Creates a booking. Expects valid JWT if your security rules demand it.
     */
    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(@RequestBody BookingRequestDTO request) {
        if (request.getStatus() == null) {
            request.setStatus(BookingStatus.PENDING);
        }
        BookingResponseDTO created = bookingService.createBooking(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponseDTO>> getByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(bookingService.getBookingsByCustomerId(customerId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponseDTO>> getByStatus(@PathVariable BookingStatus status) {
        return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
    }

    @GetMapping("/between")
    public ResponseEntity<List<BookingResponseDTO>> getBetween(
            @RequestParam("startDate") String startDate,
            @RequestParam("endDate") String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        return ResponseEntity.ok(bookingService.getBookingsBetweenDates(start, end));
    }
}
