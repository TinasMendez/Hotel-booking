package com.miapp.reservashotel.dto;

import java.time.LocalDate;

/**
 * Request DTO used by controller. `customerId` is optional:
 * if not provided, it will be resolved from the authenticated user.
 */
public class BookingRequestDTO {

    private Long productId;
    private Long customerId; // optional; resolved from auth if null
    private LocalDate startDate;
    private LocalDate endDate;

    public BookingRequestDTO() {}

    public BookingRequestDTO(Long productId, Long customerId, LocalDate startDate, LocalDate endDate) {
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
}
