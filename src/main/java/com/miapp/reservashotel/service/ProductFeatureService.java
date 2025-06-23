package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.ProductFeature;

import java.util.List;

public interface ProductFeatureService {
    ProductFeature save(ProductFeature productFeature);
    List<ProductFeature> findAll();
    ProductFeature findById(Long id);
    void delete(Long id);
}

