package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Booking entity.
 * Includes overlap checks and counters required by services and tests.
 */
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Returns true if an overlapping non-cancelled booking exists for the product.
     * Overlap: (startDate <= :end) AND (endDate >= :start)
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END " +
           "FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND b.startDate <= :end " +
           "AND b.endDate >= :start")
    boolean existsOverlapping(@Param("productId") Long productId,
                              @Param("start") LocalDate start,
                              @Param("end") LocalDate end);

    /**
     * Counts overlapping non-cancelled bookings for tests and analytics.
     */
    @Query("SELECT COUNT(b) " +
           "FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND b.startDate <= :end " +
           "AND b.endDate >= :start")
    long countConflicts(@Param("productId") long productId,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end);

    /**
     * Compatibility method expected by ProductServiceImpl:
     * counts non-cancelled bookings for a product.
     * Note: Method name uses underscore to preserve existing call sites.
     */
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED")
    long countByProduct_Id(@Param("productId") Long productId);

    // ---- Filters used elsewhere ----

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByStatus(BookingStatus status);

    @Query("SELECT b FROM Booking b " +
           "WHERE b.startDate <= :end " +
           "AND b.endDate >= :start")
    List<Booking> findIntersecting(@Param("start") LocalDate start,
                                   @Param("end") LocalDate end);
}
