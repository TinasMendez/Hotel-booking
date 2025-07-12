package com.miapp.reservashotel.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class ProductRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be non-negative")
    private BigDecimal price;

    @NotNull(message = "Available status is required")
    private Boolean available;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "City ID is required")
    private Long cityId;

    // Set of Feature IDs to associate with the Product
    private Set<Long> featureIds;
}

