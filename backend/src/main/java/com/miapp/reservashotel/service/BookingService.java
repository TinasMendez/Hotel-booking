package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.BookingStatus;

import java.time.LocalDate;
import java.util.List;

/**
 * Booking service contract.
 * Contains availability check, CRUD-like operations and filters.
 */
public interface BookingService {

    /**
     * Checks if a product is available within the given date range.
     */
    boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate);

    /**
     * Creates a new booking from a request DTO.
     */
    BookingResponseDTO createBooking(BookingRequestDTO request);

    /**
     * Retrieves a booking by id.
     */
    BookingResponseDTO getBookingById(Long id);

    /**
     * Retrieves all bookings for a given customer id.
     */
    List<BookingResponseDTO> getBookingsByCustomerId(Long customerId);

    /**
     * Retrieves all bookings by status.
     */
    List<BookingResponseDTO> getBookingsByStatus(BookingStatus status);

    /**
     * Retrieves bookings that intersect with the given date range.
     */
    List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate);

    /**
     * Updates a booking fully (optional in this sprint, kept for completeness).
     */
    BookingResponseDTO updateBooking(Long id, BookingRequestDTO request);

    /**
     * Updates only the status of a booking.
     */
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus status);
}
