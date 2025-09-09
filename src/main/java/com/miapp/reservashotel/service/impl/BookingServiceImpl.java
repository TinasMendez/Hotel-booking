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
 *  - Using productId and customerId as Long (no Product relation in the entity).
 *  - Overlap validation delegated to the repository (DB-side) for efficiency.
 *  - Filtering by status and date ranges.
 *
 * IMPORTANT:
 * - Availability is computed via repository queries (existsOverlapping / existsOverlappingExcludingId)
 *   which align with the Booking entity fields (productId, startDate, endDate, status).
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
        // Validate request dates consistency
        validateDates(requestDTO.getStartDate(), requestDTO.getEndDate());

        // Validate availability before creating using DB-side overlap check
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

        // Validate request dates consistency
        validateDates(requestDTO.getStartDate(), requestDTO.getEndDate());

        // Check availability excluding the current booking to avoid self-overlap
        boolean overlapExists = bookingRepository.existsOverlappingExcludingId(
                id,
                requestDTO.getProductId(),
                requestDTO.getStartDate(),
                requestDTO.getEndDate(),
                BookingStatus.CANCELLED
        );
        if (overlapExists) {
            throw new IllegalArgumentException("Product is not available for the selected date range");
        }

        // Update fields
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
        // Validate request dates first
        validateDates(startDate, endDate);

        // Product is available if there is NO overlapping booking with status != CANCELLED
        boolean overlapExists = bookingRepository.existsOverlapping(
                productId,
                startDate,
                endDate,
                BookingStatus.CANCELLED
        );
        return !overlapExists;
    }

    // ===== Helpers =====

    /**
     * Validates that startDate <= endDate.
     * This keeps the API defensive against bad client input.
     */
    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("startDate and endDate are required");
        }
        if (endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate cannot be before startDate");
        }
    }

    private BookingResponseDTO toDTO(Booking b) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());
        dto.setCustomerId(b.getCustomerId());
        dto.setProductId(b.getProductId());
        // The project uses startDate/endDate in the entity; DTO exposes checkInDate/checkOutDate.
        dto.setCheckInDate(b.getStartDate());
        dto.setCheckOutDate(b.getEndDate());
        dto.setStatus(b.getStatus() != null ? b.getStatus().name() : null);
        return dto;
    }
}






