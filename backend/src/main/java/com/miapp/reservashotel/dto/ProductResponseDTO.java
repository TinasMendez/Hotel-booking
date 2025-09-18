package com.miapp.reservashotel.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public class ProductResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal price;
    private Long categoryId;
    private Long cityId;
    private Set<Long> featureIds;
    private List<String> imageUrls;

    public ProductResponseDTO() {
    }

    public ProductResponseDTO(Long id, String name, String description, String imageUrl, BigDecimal price,
                              Long categoryId, Long cityId, Set<Long> featureIds, List<String> imageUrls) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.categoryId = categoryId;
        this.cityId = cityId;
        this.featureIds = featureIds;
        this.imageUrls = imageUrls;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public Long getCityId() { return cityId; }
    public void setCityId(Long cityId) { this.cityId = cityId; }

    public Set<Long> getFeatureIds() { return featureIds; }
    public void setFeatureIds(Set<Long> featureIds) { this.featureIds = featureIds; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
}

