package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.ProductFeature;

import java.util.List;

public interface ProductFeatureService {
    ProductFeature save(ProductFeature productFeature);
    void delete(Long id);
    ProductFeature findById(Long id);
    List<ProductFeature> findAll();
    List<ProductFeature> listAllProductFeatures();
    void assignFeatureToProduct(Long productId, Long featureId);
    void deleteProductFeature(Long id);
    ProductFeature getProductFeatureById(Long id);
}


