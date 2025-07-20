package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO request);

    BookingResponseDTO getBookingById(Long id);

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO updateBooking(Long id, BookingRequestDTO request);

    void deleteBooking(Long id);

    BookingResponseDTO updateBookingStatus(Long id, String status);

    List<BookingResponseDTO> getBookingsByCustomer(Long customerId);

    List<BookingResponseDTO> getBookingsByStatus(String status);

    List<BookingResponseDTO> getBookingsByDateRange(LocalDate checkIn, LocalDate checkOut);
}

