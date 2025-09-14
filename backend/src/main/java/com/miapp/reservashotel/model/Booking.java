package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking entity mapped to 'bookings' table.
 * Uses plain ids (productId, customerId) instead of heavy object relations.
 * No Lombok; manual constructors/getters/setters.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product foreign key (no relation object to keep it simple)
    @Column(name = "product_id", nullable = false)
    private Long productId;

    // Customer foreign key (tests refer to it as "userId"; see alias methods below)
    @Column(name = "customer_id")
    private Long customerId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private BookingStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // ---------------- Constructors ----------------

    public Booking() {
        // Required by JPA
    }

    public Booking(Long id,
                   Long productId,
                   Long customerId,
                   LocalDate startDate,
                   LocalDate endDate,
                   BookingStatus status,
                   LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.createdAt = createdAt;
    }

    // ---------------- Getters / Setters ----------------

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

    // ---------------- Alias methods for test compatibility ----------------
    // Some legacy tests call userId accessors. These delegate to customerId to avoid schema changes.

    /** Returns the same value as getCustomerId(). */
    public Long getUserId() {
        return this.customerId;
    }

    /** Sets the same field as setCustomerId(Long). */
    public void setUserId(Long userId) {
        this.customerId = userId;
    }

    /** Overload to match tests that pass primitive long. */
    public void setUserId(long userId) {
        this.customerId = userId;
    }
}
