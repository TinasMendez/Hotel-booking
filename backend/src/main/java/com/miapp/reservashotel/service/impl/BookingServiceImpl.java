package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Booking service implementation.
 * Aligns strictly with the interface and repository to avoid compile/runtime errors.
 */
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    public BookingServiceImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // ---------------- Availability ----------------

    @Override
    @Transactional(readOnly = true)
    public boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        if (productId == null || startDate == null || endDate == null) return false;
        if (startDate.isAfter(endDate)) return false;
        return !bookingRepository.existsOverlapping(productId, startDate, endDate);
    }

    // ---------------- Create ----------------

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        if (request.getProductId() == null || request.getStartDate() == null || request.getEndDate() == null) {
            throw new IllegalArgumentException("productId, startDate and endDate are required");
        }
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("startDate must be before or equal to endDate");
        }
        if (!isProductAvailable(request.getProductId(), request.getStartDate(), request.getEndDate())) {
            throw new IllegalStateException("Product is not available for the selected dates");
        }

        Booking entity = new Booking();
        entity.setProductId(request.getProductId());
        // customerId may come from JWT in your security layer; here we accept the DTO value if present
        entity.setCustomerId(request.getCustomerId());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(request.getStatus() != null ? request.getStatus() : BookingStatus.PENDING);
        entity.setCreatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(entity);
        return toResponseDTO(saved);
    }

    // ---------------- Read ----------------

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toResponseDTO(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByCustomerId(Long customerId) {
        List<Booking> list = bookingRepository.findByCustomerId(customerId);
        return toResponseList(list);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByStatus(BookingStatus status) {
        List<Booking> list = bookingRepository.findByStatus(status);
        return toResponseList(list);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsBetweenDates(LocalDate startDate, LocalDate endDate) {
        List<Booking> list = bookingRepository.findIntersecting(startDate, endDate);
        return toResponseList(list);
    }

    // ---------------- Update ----------------

    @Override
    public BookingResponseDTO updateBooking(Long id, BookingRequestDTO request) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (request.getProductId() != null) {
            booking.setProductId(request.getProductId());
        }
        if (request.getCustomerId() != null) {
            booking.setCustomerId(request.getCustomerId());
        }
        if (request.getStartDate() != null) {
            booking.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            booking.setEndDate(request.getEndDate());
        }
        if (request.getStatus() != null) {
            booking.setStatus(request.getStatus());
        }

        Booking saved = bookingRepository.save(booking);
        return toResponseDTO(saved);
    }

    @Override
    public BookingResponseDTO updateBookingStatus(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        booking.setStatus(status);
        Booking saved = bookingRepository.save(booking);
        return toResponseDTO(saved);
    }

    // ---------------- Mappers ----------------

    private BookingResponseDTO toResponseDTO(Booking entity) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(entity.getId());
        dto.setProductId(entity.getProductId());
        dto.setCustomerId(entity.getCustomerId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private List<BookingResponseDTO> toResponseList(List<Booking> list) {
        List<BookingResponseDTO> out = new ArrayList<>();
        if (list != null) {
            for (Booking b : list) {
                out.add(toResponseDTO(b));
            }
        }
        return out;
    }
}
