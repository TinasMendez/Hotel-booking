package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Implements the business logic for managing products.
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FeatureRepository featureRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;

    @Override
    public Product createProduct(Product product) {
        if (productRepository.existsByName(product.getName())) {
            throw new ResourceNotFoundException("Product with this name already exists.");
        }

        // Validate and assign Category
        Long categoryId = product.getCategory().getId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        product.setCategory(category);

        // Validate and assign City
        Long cityId = product.getCity().getId();
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + cityId));
        product.setCity(city);

        return productRepository.save(product);
    }

    @Override
    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setImageUrl(updatedProduct.getImageUrl());
        existing.setPrice(updatedProduct.getPrice());
        existing.setAvailable(updatedProduct.isAvailable());

        // Validate and update Category
        Long categoryId = updatedProduct.getCategory().getId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        existing.setCategory(category);

        // Validate and update City
        Long cityId = updatedProduct.getCity().getId();
        City city = cityRepository.findById(cityId)
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + cityId));
        existing.setCity(city);

        // Optional: Validate features if present
        if (updatedProduct.getFeatures() != null) {
            Set<Feature> validatedFeatures = new HashSet<>();
            for (Feature feature : updatedProduct.getFeatures()) {
                Feature validatedFeature = featureRepository.findById(feature.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Feature not found with ID: " + feature.getId()));
                validatedFeatures.add(validatedFeature);
            }
            existing.setFeatures(validatedFeatures);
        }

        return productRepository.save(existing);
    }

    @Override
    public void assignFeaturesToProduct(Long productId, Set<Long> featureIds) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        Set<Feature> features = new HashSet<>();
        for (Long featureId : featureIds) {
            Feature feature = featureRepository.findById(featureId)
                    .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + featureId));
            features.add(feature);
        }

        product.setFeatures(features);
        productRepository.save(product);
    }

    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> findProductsByCity(String cityName) {
        return productRepository.findByCity_NameIgnoreCase(cityName);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}
