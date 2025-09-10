package com.miapp.reservashotel.dto.bookings;

import com.miapp.reservashotel.model.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {

    private Long id;
    private Long productId;
    private String productName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;
    private LocalDateTime createdAt;

    public BookingResponse() {}

    public BookingResponse(Long id, Long productId, String productName,
                            LocalDate startDate, LocalDate endDate,
                            BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


