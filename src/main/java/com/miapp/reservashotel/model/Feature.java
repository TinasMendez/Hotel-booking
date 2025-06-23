package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a feature that a product can have (e.g., WiFi, Pool, Breakfast).
 */
@Entity
@Table(name = "features")
@Getter
@Setter
@NoArgsConstructor
public class Feature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Feature name (e.g., "Free WiFi")
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    // Icon URL for the feature (should be a valid URL)
    @NotBlank(message = "Icon is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Icon must be a valid URL")
    private String icon;
}
