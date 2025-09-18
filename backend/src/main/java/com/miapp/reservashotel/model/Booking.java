package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking entity mapped to table `bookings`.
 * IMPORTANT:
 * - Database legacy column for the customer is `user_id`.
 * - We intentionally map `customerId` -> column `user_id` to avoid 500 errors.
 * - No Lombok (manual constructors/getters/setters).
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Keep plain ID fields (no relations by design in this project)
    @Column(name = "product_id", nullable = false)
    private Long productId;

    // Legacy schema still exposes both columns (customer_id and user_id)
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "user_id", nullable = false)
    private Long legacyUserId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Booking() {
    }

    public Booking(Long id, Long productId, Long customerId, LocalDate startDate, LocalDate endDate, BookingStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.legacyUserId = customerId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status == null ? BookingStatus.PENDING : status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = BookingStatus.PENDING;
    }

    // --------- Getters & Setters (manual, no Lombok) ---------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    /** Keep customerId in sync with legacy column. */
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
        this.legacyUserId = customerId;
    }

    public Long getLegacyUserId() { return legacyUserId; }
    public void setLegacyUserId(Long legacyUserId) {
        this.legacyUserId = legacyUserId;
        this.customerId = legacyUserId;
    }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    /* -------- Optional legacy alias (some old tests may call userId) ------- */
    @Transient
    public Long getUserId() { return this.customerId; }
    public void setUserId(Long userId) {
        this.customerId = userId;
        this.legacyUserId = userId;
    }
}
