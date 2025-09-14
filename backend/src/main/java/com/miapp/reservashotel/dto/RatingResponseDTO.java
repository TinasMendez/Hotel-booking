// backend/src/main/java/com/miapp/reservashotel/dto/RatingResponseDTO.java
package com.miapp.reservashotel.dto;

import java.time.Instant;

/**
 * Response DTO for ratings.
 */
public class RatingResponseDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private int score;
    private String comment;
    private Instant createdAt;

    public RatingResponseDTO() {}

    public RatingResponseDTO(Long id, Long productId, Long userId, int score, String comment, Instant createdAt) {
        this.id = id;
        this.productId = productId;
        this.userId = userId;
        this.score = score;
        this.comment = comment;
        this.createdAt = createdAt;
    }

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
