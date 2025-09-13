package com.miapp.reservashotel.repository;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Minimal JPA tests to validate conflict counting.
 * Uses the in-memory test configuration provided by Spring Boot.
 */
@DataJpaTest
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void countConflicts_detectsOverlap() {
        Booking seed = new Booking();
        seed.setProductId(1L);
        seed.setUserId(100L);
        seed.setStartDate(LocalDate.of(2025, 9, 21));
        seed.setEndDate(LocalDate.of(2025, 9, 24));
        seed.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(seed);

        long conflicts = bookingRepository.countConflicts(
                1L,
                LocalDate.of(2025, 9, 22),
                LocalDate.of(2025, 9, 23)
        );

        assertThat(conflicts).isGreaterThan(0);
    }

    @Test
    void countConflicts_noOverlap_returnsZero() {
        Booking seed = new Booking();
        seed.setProductId(2L);
        seed.setUserId(200L);
        seed.setStartDate(LocalDate.of(2025, 9, 10));
        seed.setEndDate(LocalDate.of(2025, 9, 12));
        seed.setStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(seed);

        long conflicts = bookingRepository.countConflicts(
                2L,
                LocalDate.of(2025, 9, 13),
                LocalDate.of(2025, 9, 15)
        );

        assertThat(conflicts).isZero();
    }
}