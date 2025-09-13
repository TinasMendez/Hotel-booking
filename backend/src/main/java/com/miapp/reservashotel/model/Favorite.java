package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Favorite entity mapping user-product bookmarks.
 * We keep only ids to avoid heavy relationships and accidental fetches.
 */
@Entity
@Table(name = "favorites",
       uniqueConstraints = @UniqueConstraint(name = "uk_fav_user_product", columnNames = {"user_id", "product_id"}))
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Favorite() {
        // JPA
    }

    public Favorite(Long userId, Long productId) {
        this.userId = userId;
        this.productId = productId;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

