    package com.miapp.reservashotel.repository;

    import com.miapp.reservashotel.model.Booking;
    import com.miapp.reservashotel.model.BookingStatus;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;

    import java.time.LocalDate;
    import java.util.List;

    /**
     * Booking repository.
     * Notes:
     * - This project stores product linkage as a Long field (productId) instead of @ManyToOne Product.
     * - Queries below use productId directly, which matches the Booking entity shape.
     */
    public interface BookingRepository extends JpaRepository<Booking, Long> {

        List<Booking> findByCustomerId(Long customerId);

        List<Booking> findByStatus(BookingStatus status);

        List<Booking> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

        List<Booking> findByProductIdAndStatus(Long productId, BookingStatus status);

        /**
         * Returns product ids ordered by number of bookings (desc).
         * This is used to surface most-booked products.
         */
        @Query("SELECT b.productId FROM Booking b GROUP BY b.productId ORDER BY COUNT(b.id) DESC")
        List<Long> findMostBookedProductIds();

        /**
         * Checks whether there is any overlapping booking for a given product and date range,
         * ignoring CANCELLED bookings.
         *
         * Overlap rule (inclusive): [startDate, endDate] overlaps when
         * (existing.startDate <= endDate) AND (existing.endDate >= startDate)
         *
         * IMPORTANT: This version uses b.productId (Long), not b.product.id.
         * It also avoids hardcoding enum FQN; instead, uses a parameter for CANCELLED.
         */
        @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.productId = :productId
            AND b.status <> :cancelled
            AND b.startDate <= :endDate
            AND b.endDate   >= :startDate
        """)
        boolean existsOverlapping(@Param("productId") Long productId,
                                @Param("startDate") LocalDate startDate,
                                @Param("endDate") LocalDate endDate,
                                @Param("cancelled") BookingStatus cancelled);

        /**
         * Same as existsOverlapping but excluding a specific booking id.
         * This is required for updates to avoid self-overlap on the edited booking.
         */
        @Query("""
            SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END
            FROM Booking b
            WHERE b.productId = :productId
            AND b.id <> :bookingId
            AND b.status <> :cancelled
            AND b.startDate <= :endDate
            AND b.endDate   >= :startDate
        """)
        boolean existsOverlappingExcludingId(@Param("bookingId") Long bookingId,
                                            @Param("productId") Long productId,
                                            @Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate,
                                            @Param("cancelled") BookingStatus cancelled);
    }
