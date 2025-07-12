package com.miapp.reservashotel.dto;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO for City creation and update requests.
 */
@Getter
@Setter
public class CityRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Country is required")
    private String country;
}


