package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * City request payload with validation.
 */
public class CityRequestDTO {

    @NotBlank(message = "Name is required")
    @Size(max = 120, message = "Name must be at most 120 characters")
    private String name;

    @NotBlank(message = "Country is required")
    @Size(max = 120, message = "Country must be at most 120 characters")
    private String country;

    public CityRequestDTO() {}

    public CityRequestDTO(String name, String country) {
        this.name = name;
        this.country = country;
    }

    // --- Getters & Setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}



