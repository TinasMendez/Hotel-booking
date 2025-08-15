package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    List<Booking> findByProductIdAndStatus(Long productId, BookingStatus status); // 👈 MÉTODO QUE FALTABA

    @Query("SELECT b.productId FROM Booking b GROUP BY b.productId ORDER BY COUNT(b.id) DESC")
    List<Long> findMostBookedProductIds();
}



