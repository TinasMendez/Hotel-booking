package com.miapp.reservashotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * Join entity for Product <-> Feature ManyToMany relation.
 * No Lombok: plain Java boilerplate for clarity and portability.
 */
@Entity
@Table(name = "product_features")
public class ProductFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @ManyToOne
    @JoinColumn(name = "feature_id")
    private Feature feature;

    public ProductFeature() {}

    public ProductFeature(Product product, Feature feature) {
        this.product = product;
        this.feature = feature;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Feature getFeature() { return feature; }
    public void setFeature(Feature feature) { this.feature = feature; }
}


