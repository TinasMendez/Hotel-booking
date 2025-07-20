package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by customer ID
    List<Booking> findByCustomerId(Long customerId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings by check-in date range
    List<Booking> findByCheckInDateBetween(LocalDate startDate, LocalDate endDate);

    // Optional: Find by productId and date range (for advanced availability logic)
    List<Booking> findByProductIdAndCheckInDateBetween(Long productId, LocalDate startDate, LocalDate endDate);
}

