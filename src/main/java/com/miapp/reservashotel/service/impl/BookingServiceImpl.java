package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        Booking booking = new Booking();
        booking.setProductId(requestDTO.getProductId());
        booking.setCustomerId(requestDTO.getCustomerId());
        booking.setStartDate(requestDTO.getStartDate());
        booking.setEndDate(requestDTO.getEndDate());
        booking.setStatus(BookingStatus.PENDING);
        bookingRepository.save(booking);

        return convertToDTO(booking);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return convertToDTO(booking);
    }

    @Override
    public BookingResponseDTO updateBooking(Long id, BookingRequestDTO requestDTO) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setProductId(requestDTO.getProductId());
        booking.setCustomerId(requestDTO.getCustomerId());
        booking.setStartDate(requestDTO.getStartDate());
        booking.setEndDate(requestDTO.getEndDate());
        booking.setStatus(BookingStatus.valueOf(requestDTO.getStatus().toUpperCase()));

        bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        bookingRepository.save(booking);
        return convertToDTO(booking);
    }

    @Override
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getBookingsByStatus(String status) {
        BookingStatus statusEnum = BookingStatus.valueOf(status.toUpperCase());
        return bookingRepository.findByStatus(statusEnum)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findByStartDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<Long> getMostBookedProductIds() {
        return bookingRepository.findMostBookedProductIds();
    }

    @Override
public boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
    List<Booking> bookings = bookingRepository.findByProductIdAndStatus(productId, BookingStatus.CONFIRMED);
    for (Booking booking : bookings) {
        boolean overlaps = !(endDate.isBefore(booking.getStartDate()) || startDate.isAfter(booking.getEndDate()));
        if (overlaps) {
            return false; // Dates overlap, not available
        }
    }
    return true; // No overlaps found, available
}


    private BookingResponseDTO convertToDTO(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getProductId(),
                booking.getCustomerId(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getStatus().name()
        );
    }
}




