package com.miapp.reservashotel.dto;

public class PolicyResponseDTO {
    private Long id;
    private Long productId;
    private String title;
    private String description;

    public PolicyResponseDTO() {}

    public PolicyResponseDTO(Long id, Long productId, String title, String description) {
        this.id = id;
        this.productId = productId;
        this.title = title;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

