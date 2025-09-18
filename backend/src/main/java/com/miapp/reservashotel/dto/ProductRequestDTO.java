package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

/**
 * Product request payload with validation.
 * Note: Using IDs to bind relations (Category, City, Features).
 */
public class ProductRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be at most 120 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @Size(max = 255, message = "Image URL must be at most 255 characters")
    private String imageUrl;

    @NotNull(message = "Image URLs are required")
    @Size(min = 1, max = 20, message = "Provide between 1 and 20 images")
    private List<@NotBlank(message = "Image URL cannot be blank")
            @Size(max = 512, message = "Image URL must be at most 512 characters") String> imageUrls;

    @NotBlank(message = "Address is required")
    @Size(max = 255, message = "Address must be at most 255 characters")
    private String address;

    @NotNull(message = "City id is required")
    private Long cityId;

    @NotNull(message = "Category id is required")
    private Long categoryId;

    @NotNull(message = "Feature ids are required")
    @Size(min = 1, message = "At least one feature is required")
    private List<@NotNull(message = "Feature id cannot be null") Long> featureIds;

    public ProductRequestDTO() {}

    public ProductRequestDTO(String name, String description, BigDecimal price, String imageUrl,
                                String address, Long cityId, Long categoryId, List<Long> featureIds,
                                List<String> imageUrls) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.address = address;
        this.cityId = cityId;
        this.categoryId = categoryId;
        this.featureIds = featureIds;
        this.imageUrls = imageUrls;
    }

    // --- Getters & Setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Long getCityId() { return cityId; }
    public void setCityId(Long cityId) { this.cityId = cityId; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public List<Long> getFeatureIds() { return featureIds; }
    public void setFeatureIds(List<Long> featureIds) { this.featureIds = featureIds; }
}
