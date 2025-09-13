package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Minimal DTO to create a favorite entry.
 */
public class FavoriteRequestDTO {

    @NotNull
    private Long productId;

    public FavoriteRequestDTO() {}

    public FavoriteRequestDTO(Long productId) {
        this.productId = productId;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}

