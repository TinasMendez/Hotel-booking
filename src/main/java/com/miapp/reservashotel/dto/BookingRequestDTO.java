package com.miapp.reservashotel.dto;

import java.time.LocalDate;

public class BookingRequestDTO {

    private Long productId;
    private Long customerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public BookingRequestDTO() {}

    public BookingRequestDTO(Long productId, Long customerId, LocalDate startDate, LocalDate endDate, String status) {
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

