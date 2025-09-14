// backend/src/main/java/com/miapp/reservashotel/dto/RatingRequestDTO.java
package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating/updating a rating.
 */
public class RatingRequestDTO {
    @NotNull
    private Long productId;

    @Min(1) @Max(5)
    private int score;

    private String comment;

    public RatingRequestDTO() {}

    public RatingRequestDTO(Long productId, int score, String comment) {
        this.productId = productId;
        this.score = score;
        this.comment = comment;
    }

    public Long getProductId() { return productId; }

    public void setProductId(Long productId) { this.productId = productId; }

    public int getScore() { return score; }

    public void setScore(int score) { this.score = score; }

    public String getComment() { return comment; }

    public void setComment(String comment) { this.comment = comment; }
}
