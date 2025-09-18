package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate);

    BookingResponseDTO createBooking(BookingRequestDTO request);

    List<BookingResponseDTO> getBookingsByCustomerId(Long customerId);

    List<BookingResponseDTO> getBookingsByProductId(Long productId);

    List<BookingResponseDTO> getBookingsForCurrentUser();

    BookingResponseDTO cancelBooking(Long bookingId);

    BookingResponseDTO getBookingAccessibleToCurrentUser(Long bookingId);
}
