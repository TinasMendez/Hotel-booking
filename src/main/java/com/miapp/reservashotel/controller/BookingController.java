package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.bookings.BookingResponse;
import com.miapp.reservashotel.dto.bookings.CreateBookingRequest;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    // /api/bookings/availability?productId=12&start=2025-09-14&end=2025-09-21
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> availability(@RequestParam Long productId,
                                                            @RequestParam LocalDate start,
                                                            @RequestParam LocalDate end) {
        List<LocalDate> blocked = service.getBlockedDates(productId, start, end);
        return ResponseEntity.ok(Map.of(
            "productId", productId,
            "blockedDates", blocked
        ));
    }

    @PostMapping
    public ResponseEntity<BookingResponse> create(@RequestBody CreateBookingRequest req,
                                                    Authentication auth) {
        BookingResponse r = service.create(req, auth);
        return ResponseEntity.ok(r);
    }

    @GetMapping("/me")
    public List<BookingResponse> myBookings(Authentication auth) {
        return service.getMyBookings(auth);
    }
}

