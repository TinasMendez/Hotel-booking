package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotBlank;

public class FeatureRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Icon is required")
    private String icon;

    @NotBlank(message = "Description is required")
    private String description;

    public FeatureRequestDTO() {}

    public FeatureRequestDTO(String name, String icon, String description) {
        this.name = name;
        this.icon = icon;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}




