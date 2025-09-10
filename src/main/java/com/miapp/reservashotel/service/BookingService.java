package com.miapp.reservashotel.service;

import com.miapp.reservashotel.dto.bookings.AvailabilityResponse;
import com.miapp.reservashotel.dto.bookings.BlockedDatesResponse;
import com.miapp.reservashotel.dto.bookings.BookingResponse;
import com.miapp.reservashotel.dto.bookings.CreateBookingRequest;
import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.User;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

/** Application service for bookings (concrete @Service class). */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                            ProductRepository productRepository,
                            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public AvailabilityResponse checkAvailability(Long productId, LocalDate start, LocalDate end) {
        if (start == null || end == null || start.isAfter(end)) {
            return new AvailabilityResponse(false);
        }
        long conflicts = bookingRepository.countConflicts(productId, start, end);
        return new AvailabilityResponse(conflicts == 0);
    }

    @Transactional
    public BookingResponse create(String email, CreateBookingRequest req) {
        if (req.getStartDate() == null || req.getEndDate() == null) {
            throw new IllegalArgumentException("startDate and endDate are required");
        }
        if (req.getStartDate().isAfter(req.getEndDate())) {
            throw new IllegalArgumentException("startDate must be <= endDate");
        }

        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long conflicts = bookingRepository.countConflicts(req.getProductId(), req.getStartDate(), req.getEndDate());
        if (conflicts > 0) {
            throw new IllegalStateException("Selected dates are not available");
        }

        Booking b = new Booking();
        b.setProduct(product);
        b.setUser(user);
        b.setStartDate(req.getStartDate());
        b.setEndDate(req.getEndDate());
        b.setStatus(BookingStatus.CONFIRMED); // business default

        try {
            // save + flush so any DB constraint/type problems show up immediately
            Booking saved = bookingRepository.saveAndFlush(b);
            return new BookingResponse(
                    saved.getId(),
                    saved.getProduct().getId(),
                    resolveProductName(product),
                    saved.getStartDate(),
                    saved.getEndDate(),
                    saved.getStatus(),
                    saved.getCreatedAt()
            );
        } catch (DataIntegrityViolationException ex) {
            // Re-throw with a clearer message; GlobalExceptionHandler will format it
            throw new IllegalStateException("Database constraint violation while saving booking", ex);
        }
    }

    public List<BookingResponse> myBookings(String email) {
        var list = bookingRepository.findByUserEmailOrderByCreatedAtDesc(email);
        List<BookingResponse> out = new ArrayList<>();
        for (Booking b : list) {
            out.add(new BookingResponse(
                    b.getId(), b.getProduct().getId(), resolveProductName(b.getProduct()),
                    b.getStartDate(), b.getEndDate(), b.getStatus(), b.getCreatedAt()
            ));
        }
        return out;
    }

    public BlockedDatesResponse blockedDates(Long productId) {
        var list = bookingRepository.findByProductIdAndStatus(productId, BookingStatus.CONFIRMED);
        List<String> dates = new ArrayList<>();
        for (Booking b : list) {
            LocalDate d = b.getStartDate();
            while (!d.isAfter(b.getEndDate())) {
                dates.add(d.toString());
                d = d.plusDays(1);
            }
        }
        return new BlockedDatesResponse(dates);
    }

    /** Safe label that does not rely on a getTitle() method. */
    private String resolveProductName(Product p) {
        try {
            var m = Product.class.getMethod("getName");
            Object name = m.invoke(p);
            if (name instanceof String s && !s.isBlank()) return s;
        } catch (Exception ignored) {}
        return "Product #" + p.getId();
    }
}


