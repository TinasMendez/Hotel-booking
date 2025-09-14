package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.model.BookingStatus;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    // Availability
    boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate);

    // Create
    BookingResponseDTO createBooking(BookingRequestDTO request);

    // Read
    BookingResponseDTO getBookingById(Long id);
    List<BookingResponseDTO> getBookingsByCustomerId(Long customerId);
    List<BookingResponseDTO> getBookingsByStatus(BookingStatus status);
    List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate);

    // Update
    BookingResponseDTO updateBooking(Long id, BookingRequestDTO request);
    BookingResponseDTO updateBookingStatus(Long id, BookingStatus status);
}
