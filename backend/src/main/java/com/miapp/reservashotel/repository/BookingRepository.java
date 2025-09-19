package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for Booking entity.
 *
 * Contains convenience queries used by tests and services:
 *  - findByCustomerId
 *  - findByProductId (exclude CANCELLED)
 *  - countOverlapping / countConflicts (used by tests)
 *  - countByProductId (used by ProductServiceImpl)
 *  - findBookingsBetweenDates (returns bookings overlapping a window)
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // --- simple lookups -------------------------------------------------

    @Query("SELECT b FROM Booking b WHERE b.customerId = :customerId")
    List<Booking> findByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT b FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED")
    List<Booking> findByProductId(@Param("productId") Long productId);

    // --- count of bookings for a product (exclude cancelled) ----------
    // Used by ProductServiceImpl: countByProductId(Long)
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED")
    long countByProductId(@Param("productId") Long productId);

    // --- overlapping detection -----------------------------------------
    // Count bookings for a product that overlap the given date range.
    // Overlap criterion: NOT (existing.end < start OR existing.start > end)
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND NOT (b.endDate < :startDate OR b.startDate > :endDate)")
    long countOverlapping(@Param("productId") Long productId,
                          @Param("startDate") LocalDate startDate,
                          @Param("endDate") LocalDate endDate);

    /**
     * Some older tests or code call countConflicts(long, LocalDate, LocalDate).
     * Provide this method signature to satisfy them (primitive long).
     * We keep the same JPQL as countOverlapping.
     */
    @Query("SELECT COUNT(b) FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND NOT (b.endDate < :startDate OR b.startDate > :endDate)")
    long countConflicts(@Param("productId") long productId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

    // --- return actual bookings overlapping a window -------------------
    @Query("SELECT b FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND (" +
           "   (b.startDate BETWEEN :startDate AND :endDate) " +
           "   OR (b.endDate BETWEEN :startDate AND :endDate) " +
           "   OR (b.startDate <= :startDate AND b.endDate >= :endDate) " +
           ") " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED")
    List<Booking> findBookingsBetweenDates(@Param("productId") Long productId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Booking b " +
           "WHERE b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND NOT (b.endDate < :startDate OR b.startDate > :endDate)")
    List<Booking> findConflictingBookingsForUpdate(@Param("productId") Long productId,
                                                   @Param("startDate") LocalDate startDate,
                                                   @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.customerId = :customerId " +
           "AND b.productId = :productId " +
           "AND b.status <> com.miapp.reservashotel.model.BookingStatus.CANCELLED " +
           "AND b.endDate < :referenceDate")
    boolean existsCompletedBooking(@Param("customerId") Long customerId,
                                   @Param("productId") Long productId,
                                   @Param("referenceDate") LocalDate referenceDate);
}
