package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Feature request payload with validation.
 */
public class FeatureRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 80, message = "Name must be at most 80 characters")
    private String name;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be at most 255 characters")
    private String description;

    @NotBlank(message = "Icon is required")
    @Size(max = 80, message = "Icon must be at most 80 characters")
    private String icon;

    public FeatureRequestDTO() {}

    public FeatureRequestDTO(String name, String description, String icon) {
        this.name = name;
        this.description = description;
        this.icon = icon;
    }

    // --- Getters & Setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}





