package com.miapp.reservashotel.controller;

import com.miapp.reservashotel.dto.bookings.BlockedDatesResponse;
import com.miapp.reservashotel.service.BookingCalendarService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Public calendar endpoint that returns blocked ISO dates for a product.
 * Path is nested under /api/bookings/product/** so it stays permitted by security config.
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingCalendarController {

    private final BookingCalendarService bookingCalendarService;

    public BookingCalendarController(BookingCalendarService bookingCalendarService) {
        this.bookingCalendarService = bookingCalendarService;
    }

    /**
     * GET /api/bookings/product/{productId}/blocked-dates?from=YYYY-MM-DD&to=YYYY-MM-DD
     * Both "from" and "to" are optional; if present they constrain the date set.
     */
    @GetMapping("/product/{productId}/blocked-dates")
    public ResponseEntity<BlockedDatesResponse> getBlockedDates(
            @PathVariable Long productId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<String> dates = bookingCalendarService.getBlockedDates(productId, from, to);
        return ResponseEntity.ok(new BlockedDatesResponse(dates));
    }
}
