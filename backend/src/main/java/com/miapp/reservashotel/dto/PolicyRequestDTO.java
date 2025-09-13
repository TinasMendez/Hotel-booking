package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PolicyRequestDTO {

    @NotNull
    private Long productId;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    public PolicyRequestDTO() {}

    public PolicyRequestDTO(Long productId, String title, String description) {
        this.productId = productId;
        this.title = title;
        this.description = description;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
