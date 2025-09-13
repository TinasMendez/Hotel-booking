package com.miapp.reservashotel.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for favorites
 */
public class FavoriteResponseDTO {
    private Long id;
    private Long productId;
    private LocalDateTime createdAt;

    public FavoriteResponseDTO() {}

    public FavoriteResponseDTO(Long id, Long productId, LocalDateTime createdAt) {
        this.id = id;
        this.productId = productId;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

