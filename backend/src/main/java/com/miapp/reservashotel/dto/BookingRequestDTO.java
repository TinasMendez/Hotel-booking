package com.miapp.reservashotel.dto;

import com.miapp.reservashotel.model.BookingStatus;

import java.time.LocalDate;

/**
 * Request DTO for creating/updating a booking.
 * Uses manual constructors, getters and setters (no Lombok).
 */
public class BookingRequestDTO {

    private Long productId;
    private Long customerId; // Optional: can be set from JWT user on server
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status; // Optional on create; default PENDING

    public BookingRequestDTO() {
    }

    public BookingRequestDTO(Long productId, Long customerId, LocalDate startDate, LocalDate endDate, BookingStatus status) {
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // ---- Getters / Setters ----

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }
}

