package com.miapp.reservashotel.service;

import java.time.LocalDate;
import java.util.List;

/**
 * Calendar-oriented read-only operations for bookings.
 */
public interface BookingCalendarService {

    /**
     * Returns the set of blocked ISO dates (yyyy-MM-dd) for the given product.
     * If from/to are provided, the list is constrained to that window (inclusive).
     */
    List<String> getBlockedDates(Long productId, LocalDate from, LocalDate to);
}

