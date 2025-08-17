package com.miapp.reservashotel.dto;

import java.math.BigDecimal;
import java.util.Set;

public class ProductRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Long cityId;
    private Long categoryId;
    private Set<Long> featureIds;

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getCityId() {
        return cityId;
    }

    public void setCityId(Long cityId) {
        this.cityId = cityId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Set<Long> getFeatureIds() {
        return featureIds;
    }

    public void setFeatureIds(Set<Long> featureIds) {
        this.featureIds = featureIds;
    }
}
