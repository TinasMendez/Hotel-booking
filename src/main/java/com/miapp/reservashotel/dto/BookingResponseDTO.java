package com.miapp.reservashotel.dto;

import java.time.LocalDate;

public class BookingResponseDTO {

    private Long id;
    private Long productId;
    private Long customerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    // Default constructor
    public BookingResponseDTO() {}

    // Parameterized constructor
    public BookingResponseDTO(Long id, Long productId, Long customerId, LocalDate startDate, LocalDate endDate, String status) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // Getters and setters
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}



