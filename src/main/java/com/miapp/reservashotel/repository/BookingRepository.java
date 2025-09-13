package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            select count(b) from Booking b
            where b.product.id = :productId
                and b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED
                and (b.startDate <= :end and b.endDate >= :start)
            """)
    long countConflicts(@Param("productId") Long productId,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end);

    @Query("""
            select b from Booking b
            where b.product.id = :productId
                and b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED
                and (b.startDate <= :end and b.endDate >= :start)
            """)
        List<Booking> findOverlapping(@Param("productId") Long productId,
                                    @Param("start") LocalDate start,
                                    @Param("end") LocalDate end);

    long countByProduct_Id(Long productId);

    // Both variants supported so Service can use either one.
    List<Booking> findByUserEmailOrderByCreatedAtDesc(String email);
    List<Booking> findByUser_EmailOrderByCreatedAtDesc(String email);
}
