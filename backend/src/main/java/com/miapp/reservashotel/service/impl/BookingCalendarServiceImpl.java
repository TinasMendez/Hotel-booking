package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.service.BookingCalendarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

/**
 * Builds a canonical list of blocked dates for a product's calendar.
 * Uses repository filtering already excluding CANCELLED bookings.
 */
@Service
@Transactional(readOnly = true)
public class BookingCalendarServiceImpl implements BookingCalendarService {

    private final BookingRepository bookingRepository;

    public BookingCalendarServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public List<String> getBlockedDates(Long productId, LocalDate from, LocalDate to) {
        if (productId == null) {
            return List.of();
        }

        // Normalize optional window
        LocalDate windowStart = from;
        LocalDate windowEnd = to;
        if (windowStart != null && windowEnd != null && windowEnd.isBefore(windowStart)) {
            // Swap if caller sent reversed range
            LocalDate tmp = windowStart;
            windowStart = windowEnd;
            windowEnd = tmp;
        }

        List<Booking> bookings = bookingRepository.findByProductId(productId);

        // Use LinkedHashSet to keep insertion order while deduplicating; then sort for deterministic output.
        Set<String> acc = new LinkedHashSet<>();

        for (Booking b : bookings) {
            LocalDate start = b.getStartDate();
            LocalDate end = b.getEndDate();
            if (start == null || end == null) continue;

            // Optional window trimming
            LocalDate effStart = windowStart != null && start.isBefore(windowStart) ? windowStart : start;
            LocalDate effEnd = windowEnd != null && end.isAfter(windowEnd) ? windowEnd : end;
            if (effEnd.isBefore(effStart)) continue;

            LocalDate d = effStart;
            while (!d.isAfter(effEnd)) {
                acc.add(d.toString()); // ISO-8601 yyyy-MM-dd
                d = d.plusDays(1);
            }
        }

        List<String> result = new ArrayList<>(acc);
        result.sort(Comparator.naturalOrder());
        return result;
    }
}
