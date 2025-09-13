package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Booking request payload with validation.
 * Project uses productId & customerId as Long, fields startDate / endDate.
 */
public class BookingRequestDTO {

    @NotNull(message = "Product id is required")
    private Long productId;

    @NotNull(message = "Customer id is required")
    private Long customerId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be today or in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @FutureOrPresent(message = "End date must be today or in the future")
    private LocalDate endDate;

    public BookingRequestDTO() {}

    public BookingRequestDTO(Long productId, Long customerId, LocalDate startDate, LocalDate endDate) {
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    // --- Getters & Setters ---
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}


