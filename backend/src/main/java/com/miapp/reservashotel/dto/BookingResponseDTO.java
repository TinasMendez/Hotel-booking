package com.miapp.reservashotel.dto;

import com.miapp.reservashotel.model.BookingStatus;
import java.time.LocalDate;

/**
 * Simple Booking response DTO.
 * No Lombok: manual constructors/getters/setters.
 */
public class BookingResponseDTO {

    private Long id;
    private Long productId;
    private Long customerId;
    private LocalDate startDate;
    private LocalDate endDate;
    private BookingStatus status;

    public BookingResponseDTO() {
    }

    // This is the constructor used by BookingServiceImpl
    public BookingResponseDTO(Long id,
                              Long productId,
                              Long customerId,
                              LocalDate startDate,
                              LocalDate endDate,
                              BookingStatus status) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
    }

    // ----------- Getters & Setters -----------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
