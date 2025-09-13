package com.miapp.reservashotel.dto;

import java.time.LocalDate;

public class BookingResponseDTO {

    private Long id;
    private Long customerId;
    private Long productId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;

    public BookingResponseDTO() {}

    public BookingResponseDTO(Long id, Long customerId, Long productId, LocalDate checkInDate, LocalDate checkOutDate, String status) {
        this.id = id;
        this.customerId = customerId;
        this.productId = productId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}



