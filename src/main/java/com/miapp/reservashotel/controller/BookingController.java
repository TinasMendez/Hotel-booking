package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.bookings.AvailabilityResponse;
import com.miapp.reservashotel.dto.bookings.BlockedDatesResponse;
import com.miapp.reservashotel.dto.bookings.BookingResponse;
import com.miapp.reservashotel.dto.bookings.CreateBookingRequest;
import com.miapp.reservashotel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // GET /api/bookings/availability?productId=2&start=2025-09-14&end=2025-09-15
    @GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long productId,
            @RequestParam LocalDate start,
            @RequestParam LocalDate end
    ) {
        return bookingService.checkAvailability(productId, start, end);
    }

    // GET /api/bookings/{productId}/blocked-dates
    @GetMapping("/{productId}/blocked-dates")
    public BlockedDatesResponse blockedDates(@PathVariable Long productId) {
        return bookingService.blockedDates(productId);
    }

    // GET /api/bookings/me  (lista de reservas del usuario autenticado)
    @GetMapping("/me")
    public ResponseEntity<?> myBookings(@RequestHeader("Authorization") String authHeader) {
        String email = JwtEmailExtractor.fromAuthorizationHeader(authHeader); // ver helper abajo
        return ResponseEntity.ok(bookingService.myBookings(email));
    }

    // POST /api/bookings   body: { "productId": 2, "startDate": "YYYY-MM-DD", "endDate": "YYYY-MM-DD" }
    @PostMapping
    public ResponseEntity<BookingResponse> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateBookingRequest req
    ) {
        String email = JwtEmailExtractor.fromAuthorizationHeader(authHeader);
        BookingResponse saved = bookingService.create(email, req);
        return ResponseEntity
                .created(URI.create("/api/bookings/" + saved.getId()))
                .body(saved);
    }

    /**
     * Minimal helper to read the username (email) from the already-validated JWT
     * that Spring Security put into the SecurityContext. If the header is present
     * and the token is valid, SecurityContext holds the Authentication.
     */
    static final class JwtEmailExtractor {
        static String fromAuthorizationHeader(String _auth) {
            // Rely on SecurityContext to have the authenticated principal
            var auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
            }
            return auth.getName(); // subject = email
        }
    }
}














