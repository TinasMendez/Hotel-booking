package com.miapp.reservashotel.dto;

import jakarta.validation.constraints.NotBlank;

public class CityRequestDTO {
    @NotBlank(message = "City name is required")
    private String name;

    @NotBlank(message = "Country is required")
    private String country;

    public CityRequestDTO() {}

    public CityRequestDTO(String name, String country) {
        this.name = name;
        this.country = country;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}


