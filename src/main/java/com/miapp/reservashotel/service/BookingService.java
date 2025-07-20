package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO getBookingById(Long id);
    BookingResponseDTO updateBooking(Long id, BookingRequestDTO bookingRequestDTO);
    void deleteBooking(Long id);

    BookingResponseDTO updateBookingStatus(Long id, String status);
    List<BookingResponseDTO> getBookingsByCustomerId(Long customerId);
    List<BookingResponseDTO> getBookingsByStatus(String status);
    List<BookingResponseDTO> getBookingsBetweenDates(LocalDate start, LocalDate end);
    List<Long> getMostBookedProductIds();
}



