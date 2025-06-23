package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Service implementation for handling business logic related to products.
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Product createProduct(Product product) {
        if (productRepository.existsByName(product.getName())) {
            throw new RuntimeException("A product with that name already exists.");
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setImageUrl(updatedProduct.getImageUrl());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setAvailable(updatedProduct.isAvailable());
        existingProduct.setCategory(updatedProduct.getCategory());

        return productRepository.save(existingProduct);
    }

    @Override
    public void assignFeaturesToProduct(Long productId, Set<Long> featureIds) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Set<Feature> features = new HashSet<>();
        for (Long featureId : featureIds) {
            Feature feature = featureRepository.findById(featureId)
                    .orElseThrow(() -> new RuntimeException("Feature not found with id: " + featureId));
            features.add(feature);
        }

        product.setFeatures(features);
        productRepository.save(product);
    }
}


