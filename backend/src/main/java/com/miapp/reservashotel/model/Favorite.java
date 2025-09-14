package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import java.time.Instant;

/** User's favorite product (userId + productId is unique). */
@Entity
@Table(name = "favorites", uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorite_user_product", columnNames = {"user_id", "product_id"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Favorite() { }

    public Favorite(Long userId, Long productId) {
        this.userId = userId;
        this.productId = productId;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}


