package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.FeatureSummaryDTO;
import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.exception.ResourceConflictException;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Production implementation aligned with the project's ProductService interface.
 * Notes:
 * - Uses only fields available on Product entity (no address/imageUrls).
 * - Enforces unique name on create/update.
 * - getRandomProducts returns up to 10 unique products.
 * - searchProducts is implemented in-memory for compatibility (repository-agnostic).
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;
    private final FeatureRepository featureRepository;

    private final SecureRandom random = new SecureRandom();

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              CityRepository cityRepository,
                              FeatureRepository featureRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cityRepository = cityRepository;
        this.featureRepository = featureRepository;
    }

    /* ===================== CRUD ===================== */

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        String normalized = normalizeName(dto.getName());
        productRepository.findByNameIgnoreCase(normalized).ifPresent(p -> {
            throw new ResourceConflictException("Product name is already in use");
        });

        Product entity = new Product();
        entity.setName(normalized);
        apply(dto, entity);

        Product saved = productRepository.save(entity);
        return toDto(saved);
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product entity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String newName = normalizeName(dto.getName());
        if (!entity.getName().equalsIgnoreCase(newName)) {
            productRepository.findByNameIgnoreCase(newName).ifPresent(p -> {
                if (!Objects.equals(p.getId(), id)) {
                    throw new ResourceConflictException("Product name is already in use");
                }
            });
            entity.setName(newName);
        }

        apply(dto, entity);

        Product saved = productRepository.save(entity);
        return toDto(saved);
    }

    @Override
    public void deleteProduct(Long id) {
        Product entity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        productRepository.delete(entity);
    }

    /* ===================== Queries (match your interface) ===================== */

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product entity = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        Page<Product> page = productRepository.findAll(pageable);
        List<ProductResponseDTO> content = page.getContent().stream().map(this::toDto).toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRandomProducts(int limit) {
        int n = Math.max(1, Math.min(10, limit));
        List<Product> all = productRepository.findAll();
        if (all.isEmpty()) return List.of();

        List<Product> copy = new ArrayList<>(all);
        Collections.shuffle(copy, random);

        // Distinct by ID, keep order
        Set<Long> seen = new HashSet<>();
        List<Product> pick = new ArrayList<>();
        for (Product p : copy) {
            if (p.getId() != null && seen.add(p.getId())) {
                pick.add(p);
                if (pick.size() == n) break;
            }
        }

        return pick.stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(
            Long categoryId,
            Long cityId,
            Long featureId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String query,
            Pageable pageable
    ) {
        // Repository-agnostic in-memory filtering to avoid coupling with custom queries.
        // For large datasets, replace with a proper repository search.
        List<Product> all = productRepository.findAll();

        List<Product> filtered = all.stream()
                .filter(p -> categoryId == null || (p.getCategory() != null && Objects.equals(p.getCategory().getId(), categoryId)))
                .filter(p -> cityId == null || (p.getCity() != null && Objects.equals(p.getCity().getId(), cityId)))
                .filter(p -> {
                    if (featureId == null) return true;
                    if (p.getFeatures() == null) return false;
                    for (Feature f : p.getFeatures()) {
                        if (Objects.equals(f.getId(), featureId)) return true;
                    }
                    return false;
                })
                .filter(p -> minPrice == null || (p.getPrice() != null && p.getPrice().compareTo(minPrice) >= 0))
                .filter(p -> maxPrice == null || (p.getPrice() != null && p.getPrice().compareTo(maxPrice) <= 0))
                .filter(p -> {
                    if (query == null || query.isBlank()) return true;
                    String q = query.toLowerCase(Locale.ROOT);
                    String name = Optional.ofNullable(p.getName()).orElse("").toLowerCase(Locale.ROOT);
                    String desc = Optional.ofNullable(p.getDescription()).orElse("").toLowerCase(Locale.ROOT);
                    return name.contains(q) || desc.contains(q);
                })
                .toList();

        int offset = (int) pageable.getOffset();
        int end = Math.min(offset + pageable.getPageSize(), filtered.size());
        List<ProductResponseDTO> pageContent = offset >= filtered.size()
                ? List.of()
                : filtered.subList(offset, end).stream().map(this::toDto).toList();

        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    /* ===================== Helpers ===================== */

    private String normalizeName(String name) {
        return Optional.ofNullable(name).orElse("").trim();
    }

    private void apply(ProductRequestDTO dto, Product entity) {
        entity.setDescription(Optional.ofNullable(dto.getDescription()).orElse("").trim());
        entity.setPrice(dto.getPrice());

        if (dto.getCategoryId() != null) {
            Category cat = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            entity.setCategory(cat);
        } else {
            entity.setCategory(null);
        }

        if (dto.getCityId() != null) {
            City city = cityRepository.findById(dto.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found"));
            entity.setCity(city);
        } else {
            entity.setCity(null);
        }

        if (dto.getFeatureIds() != null) {
            Set<Feature> features = dto.getFeatureIds().stream()
                    .map(fid -> featureRepository.findById(fid)
                            .orElseThrow(() -> new ResourceNotFoundException("Feature not found: " + fid)))
                    .collect(Collectors.toCollection(LinkedHashSet::new));
            entity.setFeatures(features);
        } else {
            entity.setFeatures(Collections.emptySet());
        }

        // Intentionally not setting address/imageUrls as they are not part of Product in this project schema.
        // If a single imageUrl exists in DTO and entity supports it, it can be set here.
    }

    private ProductResponseDTO toDto(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setPrice(p.getPrice());

        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            try {
                dto.setCategoryName(p.getCategory().getName());
            } catch (Throwable ignored) { /* optional */ }
        }
        if (p.getCity() != null) {
            dto.setCityId(p.getCity().getId());
            try {
                dto.setCityName(p.getCity().getName());
            } catch (Throwable ignored) { /* optional */ }
        }

        // Feature IDs as a Set<Long> to match DTO signature
        Set<Long> featureIds = p.getFeatures() == null
                ? Collections.emptySet()
                : p.getFeatures().stream().map(Feature::getId)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        List<FeatureSummaryDTO> featureSummaries = p.getFeatures() == null
                ? Collections.emptyList()
                : p.getFeatures().stream()
                        .map(f -> new FeatureSummaryDTO(f.getId(), f.getName(), f.getIcon()))
                        .toList();
        try {
            dto.setFeatureIds(featureIds);
            dto.setFeatures(featureSummaries);
        } catch (Throwable ignored) { /* DTO may not expose setter in some variants */ }

        // Ratings are optional on the entity
        try {
            dto.setRatingAverage(p.getRatingAverage());
            dto.setRatingCount(p.getRatingCount());
        } catch (Throwable ignored) { /* optional */ }

        // Avoid referencing imageUrls APIs that do not exist in this schema.
        try {
            dto.setImageUrl(p.getImageUrl());
        } catch (Throwable ignored) { /* optional */ }

        return dto;
    }
}
