package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Product service implementation.
 * Adds an overload createProduct(Product) returning the entity
 * to satisfy the existing unit test.
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;
    private final FeatureRepository featureRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                                CategoryRepository categoryRepository,
                                CityRepository cityRepository,
                                FeatureRepository featureRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cityRepository = cityRepository;
        this.featureRepository = featureRepository;
    }

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        Product product = new Product();
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    /** Overload used by the test: accepts an entity and returns the entity. */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + id));
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found id=" + id);
        }
        productRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + id));
        return toResponseDTO(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> searchProducts(Long categoryId,
                                                   Long cityId,
                                                   Long featureId,
                                                   BigDecimal minPrice,
                                                   BigDecimal maxPrice,
                                                   String q) {
        List<Product> all = productRepository.findAll();

        return all.stream()
                .filter(p -> categoryId == null || (p.getCategory() != null && Objects.equals(p.getCategory().getId(), categoryId)))
                .filter(p -> cityId == null || (p.getCity() != null && Objects.equals(p.getCity().getId(), cityId)))
                .filter(p -> featureId == null || (p.getFeatures() != null && p.getFeatures().stream().anyMatch(f -> Objects.equals(f.getId(), featureId))))
                .filter(p -> minPrice == null || (p.getPrice() != null && p.getPrice().compareTo(minPrice) >= 0))
                .filter(p -> maxPrice == null || (p.getPrice() != null && p.getPrice().compareTo(maxPrice) <= 0))
                .filter(p -> {
                    if (q == null || q.isBlank()) return true;
                    String needle = q.trim().toLowerCase();
                    String name = p.getName() == null ? "" : p.getName().toLowerCase();
                    String desc = p.getDescription() == null ? "" : p.getDescription().toLowerCase();
                    return name.contains(needle) || desc.contains(needle);
                })
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /* -------------------- helpers -------------------- */

    /** Applies fields from a DTO into an entity, resolving relations. */
    private void applyRequest(Product product, ProductRequestDTO request) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setPrice(request.getPrice());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found id=" + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found id=" + request.getCityId()));
            product.setCity(city);
        } else {
            product.setCity(null);
        }

        if (request.getFeatureIds() != null) {
            // Use LinkedHashSet to preserve order and match Set<Long> on DTO.
            Set<Feature> features = request.getFeatureIds().stream()
                    .map(id -> featureRepository.findById(id)
                            .orElseThrow(() -> new ResourceNotFoundException("Feature not found id=" + id)))
                    .collect(Collectors.toCollection(LinkedHashSet::new));
            product.setFeatures(features);
        } else {
            product.setFeatures(Collections.emptySet());
        }
    }

    /** Maps entity to response DTO (featureIds as Set<Long>). */
    private ProductResponseDTO toResponseDTO(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());
        dto.setPrice(p.getPrice());
        dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
        dto.setCityId(p.getCity() != null ? p.getCity().getId() : null);

        Set<Long> featureIds = (p.getFeatures() == null)
                ? Collections.emptySet()
                : p.getFeatures().stream()
                    .map(Feature::getId)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        dto.setFeatureIds(featureIds);

        return dto;
    }
}












