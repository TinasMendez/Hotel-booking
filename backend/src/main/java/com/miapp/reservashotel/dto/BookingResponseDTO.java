package com.miapp.reservashotel.dto;

import com.miapp.reservashotel.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response DTO for bookings.
 * Mirrors main fields without exposing internal JPA details.
 */
public class BookingResponseDTO {

    private Long id;
    private Long productId;
    private Long customerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private LocalDateTime createdAt; // Optional if your entity has it

    public BookingResponseDTO() {
    }

    public BookingResponseDTO(Long id, Long productId, Long customerId, LocalDate startDate, LocalDate endDate,
                              BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    // ---- Getters / Setters ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
