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

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private FeatureRepository featureRepository;

    @Override
    public Product createProduct(Product product) {
        if (productRepository.existsByNombre(product.getNombre())) {
            throw new RuntimeException("A product with this name already exists.");
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
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existing.setNombre(updatedProduct.getNombre());
        existing.setDescripcion(updatedProduct.getDescripcion());
        existing.setImagenUrl(updatedProduct.getImagenUrl());
        existing.setFeatures(updatedProduct.getFeatures());

        return productRepository.save(existing);
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

