package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponseDTO createBooking(BookingRequestDTO requestDTO);

    List<BookingResponseDTO> getAllBookings();

    BookingResponseDTO getBookingById(Long id);

    BookingResponseDTO updateBooking(Long id, BookingRequestDTO requestDTO);

    BookingResponseDTO updateBookingStatus(Long id, String status);

    void deleteBooking(Long id);

    List<BookingResponseDTO> getBookingsByCustomerId(Long customerId);

    List<BookingResponseDTO> getBookingsByStatus(String status);

    List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate);

    List<Long> getMostBookedProductIds();

    boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate);
}





