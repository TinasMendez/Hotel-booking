package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ProductRequestDTO;
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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final FeatureRepository featureRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;

    @Override
    public Product createProductFromDTO(ProductRequestDTO dto) {
        if (productRepository.existsByName(dto.getName())) {
            throw new ResourceNotFoundException("Product with this name already exists.");
        }

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        City city = cityRepository.findById(dto.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found with ID: " + dto.getCityId()));

        Set<Feature> features = new HashSet<>();
        if (dto.getFeatureIds() != null) {
            for (Long featureId : dto.getFeatureIds()) {
                Feature feature = featureRepository.findById(featureId)
                        .orElseThrow(() -> new ResourceNotFoundException("Feature not found with ID: " + featureId));
                features.add(feature);
            }
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setImageUrl(dto.getImageUrl());
        product.setPrice(dto.getPrice());
        product.setAvailable(dto.getAvailable()); // <--- Boolean usa getAvailable() con Lombok
        product.setCategory(category);
        product.setCity(city);
        product.setFeatures(features);

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product updatedProduct) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setImageUrl(updatedProduct.getImageUrl());
        existing.setPrice(updatedProduct.getPrice());
        existing.setAvailable(updatedProduct.getAvailable()); // <--- igual que arriba
        existing.setCategory(updatedProduct.getCategory());
        existing.setCity(updatedProduct.getCity());
        existing.setFeatures(updatedProduct.getFeatures());

        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public List<Product> listProducts() {
        return productRepository.findAll();
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
    public List<Product> findAvailableProducts() {
        return productRepository.findByAvailableTrue();
    }

    @Override
    public List<Product> findProductsByPriceRange(BigDecimal min, BigDecimal max) {
        return productRepository.findByPriceBetween(min, max);
    }

    @Override
    public List<Product> findProductsByFeatureName(String featureName) {
        return productRepository.findByFeatures_NameIgnoreCase(featureName);
    }

    @Override
    public List<Product> findAvailableProductsByCity(String city) {
        return productRepository.findByAvailableTrueAndCity_NameIgnoreCase(city);
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}

