package com.miapp.reservashotel.dto.admin;

/**
 * Small item model for product tables inside Admin (id + name).
 * Manual getters/setters (no Lombok).
 */
public class ProductListItemDTO {
    private Long id;
    private String name;

    public ProductListItemDTO() { }

    public ProductListItemDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
