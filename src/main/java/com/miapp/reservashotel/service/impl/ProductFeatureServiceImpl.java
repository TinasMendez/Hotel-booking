package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.ProductFeature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductFeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductFeatureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductFeatureServiceImpl implements ProductFeatureService {

    private final ProductFeatureRepository productFeatureRepository;
    private final ProductRepository productRepository;
    private final FeatureRepository featureRepository;

    @Override
    public ProductFeature save(ProductFeature productFeature) {
        return productFeatureRepository.save(productFeature);
    }

    @Override
    public void delete(Long id) {
        productFeatureRepository.deleteById(id);
    }

    @Override
    public ProductFeature findById(Long id) {
        return productFeatureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found with id: " + id));
    }

    @Override
    public List<ProductFeature> findAll() {
        return productFeatureRepository.findAll();
    }

    @Override
    public List<ProductFeature> listAllProductFeatures() {
        return productFeatureRepository.findAll();
    }

    @Override
    public void assignFeatureToProduct(Long productId, Long featureId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        Feature feature = featureRepository.findById(featureId)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + featureId));

        ProductFeature productFeature = new ProductFeature();
        productFeature.setProduct(product);
        productFeature.setFeature(feature);
        productFeatureRepository.save(productFeature);
    }

    @Override
    public void deleteProductFeature(Long id) {
        productFeatureRepository.deleteById(id);
    }

    @Override
    public ProductFeature getProductFeatureById(Long id) {
        return productFeatureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Not found with id: " + id));
    }
}
