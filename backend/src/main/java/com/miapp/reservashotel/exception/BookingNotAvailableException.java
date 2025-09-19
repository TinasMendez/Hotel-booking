package com.miapp.reservashotel.exception;

import java.time.LocalDate;
import java.util.List;

/**
 * Signals that a booking could not be created because the requested dates overlap
 * with existing reservations. Maps to HTTP 422 (Unprocessable Entity).
 */
public class BookingNotAvailableException extends RuntimeException {

    private final Long productId;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final List<BookingConflict> conflicts;

    public BookingNotAvailableException(String message,
                                        Long productId,
                                        LocalDate startDate,
                                        LocalDate endDate,
                                        List<BookingConflict> conflicts) {
        super(message);
        this.productId = productId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.conflicts = conflicts == null ? List.of() : List.copyOf(conflicts);
    }

    public Long getProductId() {
        return productId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public List<BookingConflict> getConflicts() {
        return conflicts;
    }

    /**
     * Lightweight projection of an overlapping booking window to help the frontend
     * explain which ranges are unavailable.
     */
    public record BookingConflict(Long bookingId, LocalDate startDate, LocalDate endDate) {}
}
