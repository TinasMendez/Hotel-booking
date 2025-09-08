package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.ProductFeature;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductFeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductFeatureService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for the product-feature link.
 * Matches the interface: assignFeatureToProduct(...) returns void.
 * No Lombok; manual constructor and methods.
 */
@Service
@Transactional
public class ProductFeatureServiceImpl implements ProductFeatureService {

    private final ProductFeatureRepository productFeatureRepository;
    private final ProductRepository productRepository;
    private final FeatureRepository featureRepository;

    public ProductFeatureServiceImpl(ProductFeatureRepository productFeatureRepository,
                                     ProductRepository productRepository,
                                     FeatureRepository featureRepository) {
        this.productFeatureRepository = productFeatureRepository;
        this.productRepository = productRepository;
        this.featureRepository = featureRepository;
    }

    @Override
    public ProductFeature save(ProductFeature productFeature) {
        return productFeatureRepository.save(productFeature);
    }

    @Override
    public void delete(Long id) {
        if (!productFeatureRepository.existsById(id)) {
            throw new ResourceNotFoundException("ProductFeature not found id=" + id);
        }
        productFeatureRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductFeature findById(Long id) {
        return productFeatureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ProductFeature not found id=" + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductFeature> findAll() {
        return productFeatureRepository.findAll();
    }

    @Override
    public List<ProductFeature> listAllProductFeatures() {
        return findAll();
    }

    /**
     * Creates the relation between a product and a feature.
     * Contract: returns void (consistent with ProductFeatureService).
     */
    @Override
    public void assignFeatureToProduct(Long productId, Long featureId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + productId));
        Feature feature = featureRepository.findById(featureId)
                .orElseThrow(() -> new ResourceNotFoundException("Feature not found id=" + featureId));

        ProductFeature link = new ProductFeature();
        link.setProduct(product);
        link.setFeature(feature);
        productFeatureRepository.save(link);
    }

    @Override
    public void deleteProductFeature(Long productFeatureId) {
        delete(productFeatureId);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductFeature getProductFeatureById(Long id) {
        return findById(id);
    }
}



