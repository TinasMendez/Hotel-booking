package com.miapp.reservashotel.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * Represents a product entity available for booking.
 */
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Name of the product (e.g. hotel name)
    private String nombre;

    // Description of the product
    private String descripcion;

    // URL to the product image
    private String imagenUrl;

    // List of features associated with this product
    @ManyToMany
    @JoinTable(
        name = "product_features", // Name of the join table
        joinColumns = @JoinColumn(name = "product_id"), // Foreign key to the product
        inverseJoinColumns = @JoinColumn(name = "feature_id") // Foreign key to the feature
    )
    private List<Feature> features;
}

