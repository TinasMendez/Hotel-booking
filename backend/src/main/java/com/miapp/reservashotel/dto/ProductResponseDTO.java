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
    private String categoryName;
    private Long cityId;
    private String cityName;
    private List<FeatureSummaryDTO> features;
    private Set<Long> featureIds;
    private List<String> imageUrls = List.of();
    private Double ratingAverage;
    private Long ratingCount;

    public ProductResponseDTO() {
    }

    public ProductResponseDTO(Long id, String name, String description, String imageUrl, BigDecimal price,
                              Long categoryId, String categoryName,
                              Long cityId, String cityName,
                              List<FeatureSummaryDTO> features, Set<Long> featureIds, List<String> imageUrls,
                              Double ratingAverage, Long ratingCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.cityId = cityId;
        this.cityName = cityName;
        this.features = features;
        this.featureIds = featureIds;
        this.imageUrls = imageUrls != null ? List.copyOf(imageUrls) : List.of();
        this.ratingAverage = ratingAverage;
        this.ratingCount = ratingCount;
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

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Long getCityId() { return cityId; }
    public void setCityId(Long cityId) { this.cityId = cityId; }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public List<FeatureSummaryDTO> getFeatures() { return features; }
    public void setFeatures(List<FeatureSummaryDTO> features) { this.features = features; }

    public Set<Long> getFeatureIds() { return featureIds; }
    public void setFeatureIds(Set<Long> featureIds) { this.featureIds = featureIds; }
    public List<String> getImageUrls() { return imageUrls == null ? List.of() : imageUrls; }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls != null ? List.copyOf(imageUrls) : List.of();
    }
    public Double getRatingAverage() { return ratingAverage; }
    public void setRatingAverage(Double ratingAverage) { this.ratingAverage = ratingAverage; }
    public Long getRatingCount() { return ratingCount; }
    public void setRatingCount(Long ratingCount) { this.ratingCount = ratingCount; }
}
