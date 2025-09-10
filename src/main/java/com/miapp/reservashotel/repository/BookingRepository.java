package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        select count(b) from Booking b
        where b.product.id = :productId
        and b.status = com.miapp.reservashotel.model.BookingStatus.CONFIRMED
        and not (b.endDate < :start or b.startDate > :end)
    """)
    long countConflicts(@Param("productId") Long productId,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end);

    List<Booking> findByUserEmailOrderByCreatedAtDesc(String email);

    List<Booking> findByProductIdAndStatus(Long productId, BookingStatus status);
}






