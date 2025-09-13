package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Booking;
import com.miapp.reservashotel.model.BookingStatus;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Lightweight unit test focused on the Booking entity after the customerId→userId refactor.
 * It does not spin up Spring context to keep it fast and deterministic.
 */
class BookingServiceTest {

    @Test
    void bookingEntity_setsUserIdAndDates() {
        Booking b = new Booking();
        b.setProductId(9L);
        b.setUserId(55L);
        b.setStartDate(LocalDate.of(2025, 9, 21));
        b.setEndDate(LocalDate.of(2025, 9, 24));
        b.setStatus(BookingStatus.CONFIRMED);

        assertThat(b.getUserId()).isEqualTo(55L);
        assertThat(b.getProductId()).isEqualTo(9L);
        assertThat(b.getStartDate()).isEqualTo(LocalDate.of(2025, 9, 21));
        assertThat(b.getEndDate()).isEqualTo(LocalDate.of(2025, 9, 24));
        assertThat(b.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }
}