package com.miapp.reservashotel.dto;

public class FavoriteDTO {
    private Long id;
    private Long userId;
    private Long productId;

    public FavoriteDTO() {}
    public FavoriteDTO(Long id, Long userId, Long productId) {
        this.id = id; this.userId = userId; this.productId = productId;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}

