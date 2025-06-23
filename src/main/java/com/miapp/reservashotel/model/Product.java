package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

/**
 * Entity that represents a product available for reservation.
 */
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product name
    @NotBlank(message = "Name is required")
    private String nombre;

    // Product description
    @NotBlank(message = "Description is required")
    private String descripcion;

    // Product image URL
    @NotBlank(message = "Image URL is required")
    @Pattern(regexp = "^(http|https)://.*$", message = "Image URL must be a valid URL")
    private String imagenUrl;

    // Category to which this product belongs
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Features associated with this product
    @ManyToMany
    @JoinTable(
        name = "product_features", // Join table name
        joinColumns = @JoinColumn(name = "product_id"), // FK to Product
        inverseJoinColumns = @JoinColumn(name = "feature_id") // FK to Feature
    )
    private Set<Feature> features = new HashSet<>();
}
