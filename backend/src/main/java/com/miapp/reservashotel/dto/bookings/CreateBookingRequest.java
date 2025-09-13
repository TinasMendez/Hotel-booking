package com.miapp.reservashotel.dto.bookings;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

/** Payload to create a booking. Dates use ISO yyyy-MM-dd. */
public class CreateBookingRequest {

    @NotNull
    @Positive
    private Long productId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    public CreateBookingRequest() {
    }

    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
