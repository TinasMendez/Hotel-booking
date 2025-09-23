package com.miapp.reservashotel.dto.admin;

/**
 * DTO to show category with the amount of products in it.
 * Manual getters/setters (no Lombok).
 */
public class CategoryWithCountDTO {
    private Long id;
    private String name;
    private long productsCount;

    public CategoryWithCountDTO() {
    }

    public CategoryWithCountDTO(Long id, String name, long productsCount) {
        this.id = id;
        this.name = name;
        this.productsCount = productsCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public long getProductsCount() { return productsCount; }
    public void setProductsCount(long productsCount) { this.productsCount = productsCount; }
}

