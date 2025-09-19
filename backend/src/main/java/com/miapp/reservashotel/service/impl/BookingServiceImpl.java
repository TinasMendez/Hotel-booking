package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.BookingRequestDTO;
import com.miapp.reservashotel.dto.BookingResponseDTO;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import com.miapp.reservashotel.service.BookingMailService;
import com.miapp.reservashotel.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Booking service implementation.
 * All methods map Booking entity to DTOs and perform simple validations.
 */
@Service
public class BookingServiceImpl implements BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingServiceImpl.class);

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final BookingMailService bookingMailService;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              UserRepository userRepository,
                              ProductRepository productRepository,
                              BookingMailService bookingMailService) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.bookingMailService = bookingMailService;
    }

    @Override
    public boolean isProductAvailable(Long productId, LocalDate startDate, LocalDate endDate) {
        if (productId == null || startDate == null || endDate == null || endDate.isBefore(startDate)) {
            return false;
        }
        long overlaps = bookingRepository.countOverlapping(productId, startDate, endDate);
        return overlaps == 0;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByCustomerId(Long customerId) {
        if (customerId == null) return List.of();
        return bookingRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByProductId(Long productId) {
        if (productId == null) return List.of();
        return bookingRepository.findByProductId(productId)
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsForCurrentUser() {
        Long userId = currentUserId();
        return getBookingsByCustomerId(userId);
    }

    @Transactional
    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        if (request == null) throw new IllegalArgumentException("Request cannot be null");
        if (request.getProductId() == null) throw new IllegalArgumentException("productId is required");
        if (request.getCustomerId() == null) throw new IllegalArgumentException("customerId is required");
        if (request.getStartDate() == null || request.getEndDate() == null)
            throw new IllegalArgumentException("startDate and endDate are required");
        if (request.getEndDate().isBefore(request.getStartDate()))
            throw new IllegalArgumentException("endDate must be >= startDate");

        boolean available = isProductAvailable(request.getProductId(), request.getStartDate(), request.getEndDate());
        if (!available) throw new IllegalStateException("Selected dates are not available for this product");

        Booking entity = new Booking();
        entity.setProductId(request.getProductId());
        entity.setCustomerId(request.getCustomerId()); // mapped to user_id column
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(BookingStatus.CONFIRMED); // use PENDING if you prefer manual confirmation

        Booking saved = bookingRepository.save(entity);

        try {
            User customer = userRepository.findById(entity.getCustomerId()).orElse(null);
            com.miapp.reservashotel.model.Product product = productRepository.findById(entity.getProductId()).orElse(null);
            bookingMailService.sendBookingConfirmation(customer, product, saved);
        } catch (Exception ex) {
            log.error("Failed to dispatch booking confirmation email for booking {}", saved.getId(), ex);
        }

        return toResponseDto(saved);
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found id=" + bookingId));

        Long userId = currentUserId();
        boolean isOwner = booking.getCustomerId() != null && booking.getCustomerId().equals(userId);
        if (!isOwner && !currentUserIsAdmin()) {
            throw new AccessDeniedException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.CANCELLED) {
            booking.setStatus(BookingStatus.CANCELLED);
            bookingRepository.save(booking);
        }

        return toResponseDto(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponseDTO getBookingAccessibleToCurrentUser(Long bookingId) {
        if (bookingId == null) throw new IllegalArgumentException("bookingId is required");

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found id=" + bookingId));

        Long userId = currentUserId();
        boolean isOwner = booking.getCustomerId() != null && booking.getCustomerId().equals(userId);
        if (!isOwner && !currentUserIsAdmin()) {
            throw new AccessDeniedException("You can only access your own bookings");
        }

        return toResponseDto(booking);
    }

    // helper to map entity -> DTO
    private BookingResponseDTO toResponseDto(Booking b) {
        if (b == null) return null;
        return new BookingResponseDTO(
                b.getId(),
                b.getProductId(),
                b.getCustomerId(),
                b.getStartDate(),
                b.getEndDate(),
                b.getStatus()
        );
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth == null ? null : auth.getName();
        if (email == null) throw new AccessDeniedException("No authenticated user");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
        return user.getId();
    }

    private boolean currentUserIsAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> "ROLE_ADMIN".equals(a));
    }
}
