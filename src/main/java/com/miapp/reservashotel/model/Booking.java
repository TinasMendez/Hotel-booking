package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Booking entity with explicit relations to Product and User.
 * Includes compatibility accessors (get/setProductId, get/setUserId) so
 * existing services/tests that use IDs continue to compile and work.
 */
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false) // DB column is customer_id
    private User user;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ---------- Standard getters/setters ----------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // ---------- Compatibility accessors used by legacy code/tests ----------
    /** Returns product id or null if product is not set. */
    public Long getProductId() {
        return (product != null) ? product.getId() : null;
    }

    /** Sets product by id without loading it (uses a reference entity with only id). */
    public void setProductId(Long productId) {
        if (productId == null) {
            this.product = null;
        } else {
            Product p = new Product();
            p.setId(productId);
            this.product = p;
        }
    }

    /** Returns user id or null if user is not set. */
    public Long getUserId() {
        return (user != null) ? user.getId() : null;
    }

    /** Sets user by id without loading it (uses a reference entity with only id). */
    public void setUserId(Long userId) {
        if (userId == null) {
            this.user = null;
        } else {
            User u = new User();
            u.setId(userId);
            this.user = u;
        }
    }
}
