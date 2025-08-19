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

/**
 * Booking service implementation designed for:
 *  - Using productId and customerId as Long (no Product object).
 *  - Overlap validation on create/update.
 *  - Filtering by status and date ranges.
 */
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    // Manual constructor injection
    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO) {
        // Validate availability before creating
        if (!isProductAvailable(requestDTO.getProductId(), requestDTO.getStartDate(), requestDTO.getEndDate())) {
            throw new IllegalArgumentException("Product is not available for the selected date range");
        }

        Booking b = new Booking();
        b.setProductId(requestDTO.getProductId());
        b.setCustomerId(requestDTO.getCustomerId());
        b.setStartDate(requestDTO.getStartDate());
        b.setEndDate(requestDTO.getEndDate());

        // Default status if client didn't send it
        if (requestDTO.getStatus() == null || requestDTO.getStatus().isBlank()) {
            b.setStatus(BookingStatus.PENDING);
        } else {
            b.setStatus(BookingStatus.valueOf(requestDTO.getStatus().toUpperCase()));
        }

        Booking saved = bookingRepository.save(b);
        return toDTO(saved);
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toDTO(b);
    }

    @Override
    public BookingResponseDTO updateBooking(Long id, BookingRequestDTO requestDTO) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // Check availability excluding the current booking
        boolean available = bookingRepository.findAll().stream()
                .filter(existing -> !existing.getId().equals(id))
                .filter(existing -> existing.getProductId().equals(requestDTO.getProductId()))
                .filter(existing -> existing.getStatus() != BookingStatus.CANCELLED)
                .anyMatch(existing -> overlaps(existing.getStartDate(), existing.getEndDate(), requestDTO.getStartDate(), requestDTO.getEndDate()))
                ? false : true;

        if (!available) {
            throw new IllegalArgumentException("Product is not available for the selected date range");
        }

        b.setProductId(requestDTO.getProductId());
        b.setCustomerId(requestDTO.getCustomerId());
        b.setStartDate(requestDTO.getStartDate());
        b.setEndDate(requestDTO.getEndDate());

        if (requestDTO.getStatus() != null && !requestDTO.getStatus().isBlank()) {
            b.setStatus(BookingStatus.valueOf(requestDTO.getStatus().toUpperCase()));
        }

        Booking saved = bookingRepository.save(b);
        return toDTO(saved);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, String status) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        b.setStatus(BookingStatus.valueOf(status.toUpperCase()));
        Booking saved = bookingRepository.save(b);
        return toDTO(saved);
    }

    @Override
    public void deleteBooking(Long id) {
        Booking b = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        bookingRepository.delete(b);
    }

    @Override
    public List<BookingResponseDTO> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerId(customerId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getBookingsByStatus(String status) {
        BookingStatus st = BookingStatus.valueOf(status.toUpperCase());
        return bookingRepository.findByStatus(st)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findByStartDateBetween(startDate, endDate)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<Long> getMostBookedProductIds() {
        return bookingRepository.findMostBookedProductIds();
    }

    @Override
    public boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        // product is available if there is NO overlapping booking with status != CANCELLED
        return bookingRepository.findAll().stream()
                .filter(b -> b.getProductId().equals(productId))
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED)
                .noneMatch(b -> overlaps(b.getStartDate(), b.getEndDate(), startDate, endDate));
    }

    // ===== Helpers =====

    private boolean overlaps(LocalDate aStart, LocalDate aEnd, LocalDate bStart, LocalDate bEnd) {
        // Two [start,end] ranges overlap if (aStart <= bEnd) and (bStart <= aEnd)
        return (aStart.isBefore(bEnd) || aStart.equals(bEnd))
                && (bStart.isBefore(aEnd) || bStart.equals(aEnd));
    }

    private BookingResponseDTO toDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());
        dto.setCustomerId(b.getCustomerId());
        dto.setProductId(b.getProductId());
        // The project uses startDate/endDate in model; DTO historically used checkIn/Out.
        // Both set as names consistently as "checkInDate"/"checkOutDate".
        dto.setCheckInDate(b.getStartDate());
        dto.setCheckOutDate(b.getEndDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().name() : null);
        return dto;
    }
}







