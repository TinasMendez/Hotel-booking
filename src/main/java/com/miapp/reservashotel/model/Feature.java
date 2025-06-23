package com.miapp.reservashotel.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Entity
@Table(name = "features")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties("products") // Prevents circular references during JSON serialization
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

    @ManyToMany(mappedBy = "features")
    private Set<Product> products;
}
