// backend/src/main/java/com/miapp/reservashotel/model/Rating.java
package com.miapp.reservashotel.model;

import jakarta.persistence.*;

import java.time.Instant;

/**
 * Rating entity using simple foreign keys (userId, productId).
 * This avoids extra joins and keeps the service straightforward.
 */
@Entity
@Table(
    name = "ratings",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_ratings_product_user", columnNames = {"product_id", "user_id"})
    }
)
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = true, length = 1000)
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public Rating() {}

    public Rating(Long productId, Long userId, int score, String comment, Instant createdAt) {
        this.productId = productId;
        this.userId = userId;
        this.score = score;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    // Getters & setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }

    public void setProductId(Long productId) { this.productId = productId; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public int getScore() { return score; }

    public void setScore(int score) { this.score = score; }

    public String getComment() { return comment; }

    public void setComment(String comment) { this.comment = comment; }

    public Instant getCreatedAt() { return createdAt; }

    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
