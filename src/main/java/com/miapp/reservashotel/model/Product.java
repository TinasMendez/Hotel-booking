package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

/**
 * Represents a hotel product available for booking.
 */
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name of the product (e.g. hotel name)
    private String nombre;

    // Description of the product
    private String descripcion;

    // Image URL of the product
    private String imagenUrl;

    // List of features associated with this product (e.g. WiFi, Pool, etc.)
    @ManyToMany
    @JoinTable(
        name = "product_features", // Name of the join table
        joinColumns = @JoinColumn(name = "product_id"), // Foreign key to Product
        inverseJoinColumns = @JoinColumn(name = "feature_id") // Foreign key to Feature
    )
    private Set<Feature> features = new HashSet<>();
}
