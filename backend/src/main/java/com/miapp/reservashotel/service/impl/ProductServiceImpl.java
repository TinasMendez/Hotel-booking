package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.exception.ResourceConflictException;
import com.miapp.reservashotel.exception.ResourceNotFoundException;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.model.ProductImage;
import com.miapp.reservashotel.repository.BookingRepository;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

/**
 * Product service implementation.
 * - No Lombok: manual code only.
 * - Loads Category, City and Feature relations explicitly.
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;
    private final FeatureRepository featureRepository;
    private final BookingRepository bookingRepository;

    private static final String DUPLICATE_NAME_MESSAGE = "Product name is already in use";

    public ProductServiceImpl(ProductRepository productRepository,
                              CategoryRepository categoryRepository,
                              CityRepository cityRepository,
                              FeatureRepository featureRepository,
                              BookingRepository bookingRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cityRepository = cityRepository;
        this.featureRepository = featureRepository;
        this.bookingRepository = bookingRepository;
    }

    /** Create a new product from a request DTO. */
    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        validateUniqueName(request.getName(), null);
        Product product = new Product();
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    /** Overload for tests that work directly with entities. */
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /** Update an existing product using a request DTO. */
    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + id));
        validateUniqueName(request.getName(), id);
        applyRequest(product, request);
        Product saved = productRepository.save(product);
        return toResponseDTO(saved);
    }

    /** Delete a product only if it has no bookings referencing it. */
    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found id=" + id);
        }
        // IMPORTANT: method name is countByProductId (no underscore)
        long refs = bookingRepository.countByProductId(id);
        if (refs > 0) {
            throw new ResourceConflictException(
                "PRODUCT_HAS_BOOKINGS",
                "Cannot delete product with existing bookings (id=" + id + ", refs=" + refs + ")"
            );
        }
        productRepository.deleteById(id);
    }

    /** Fetch a product by id and convert to response DTO. */
    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found id=" + id));
        return toResponseDTO(p);
    }

    /** Fetch all products using pageable defaults. */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> getAllProducts(Pageable pageable) {
        Pageable safePageable = sanitize(pageable);
        return productRepository.findAll(safePageable).map(this::toResponseDTO);
    }

    /**
     * Search products using optional filters. Delegates to a Specification so the database applies
     * pagination and avoids loading the full catalogue in memory.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ProductResponseDTO> searchProducts(Long categoryId,
                                                   Long cityId,
                                                   Long featureId,
                                                   java.math.BigDecimal minPrice,
                                                   java.math.BigDecimal maxPrice,
                                                   String q,
                                                   Pageable pageable) {
        Pageable safePageable = sanitize(pageable);
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();

        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("category", JoinType.LEFT).get("id"), categoryId));
        }
        if (cityId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.join("city", JoinType.LEFT).get("id"), cityId));
        }
        if (featureId != null) {
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                return cb.equal(root.join("features", JoinType.LEFT).get("id"), featureId);
            });
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }
        if (q != null && !q.isBlank()) {
            String needle = "%" + q.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> {
                Predicate nameMatch = cb.like(cb.lower(root.get("name")), needle);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), needle);
                return cb.or(nameMatch, descMatch);
            });
        }

        return productRepository.findAll(spec, safePageable).map(this::toResponseDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getRandomProducts(int limit) {
        int sanitizedLimit = Math.max(1, Math.min(limit, 10));
        List<Long> ids = productRepository.findAllIds();
        if (ids.isEmpty()) {
            return List.of();
        }

        List<Long> shuffledIds = new ArrayList<>(ids);
        Collections.shuffle(shuffledIds, ThreadLocalRandom.current());
        if (shuffledIds.size() > sanitizedLimit) {
            shuffledIds = shuffledIds.subList(0, sanitizedLimit);
        }

        List<Product> products = productRepository.findAllById(shuffledIds);
        Map<Long, ProductResponseDTO> mapped = products.stream()
                .collect(Collectors.toMap(Product::getId, this::toResponseDTO));

        List<ProductResponseDTO> ordered = new ArrayList<>(shuffledIds.size());
        for (Long id : shuffledIds) {
            ProductResponseDTO dto = mapped.get(id);
            if (dto != null) {
                ordered.add(dto);
            }
        }
        return ordered;
    }

    /* ============================== Helpers =============================== */

    private Pageable sanitize(Pageable pageable) {
        if (pageable == null) {
            return PageRequest.of(0, 10, Sort.by(Sort.Direction.ASC, "name"));
        }
        int pageNumber = Math.max(pageable.getPageNumber(), 0);
        int pageSize = Math.max(1, Math.min(pageable.getPageSize(), 10));
        Sort sort = pageable.getSort();
        if (sort == null || sort.isUnsorted()) {
            sort = Sort.by(Sort.Direction.ASC, "name");
        }
        return PageRequest.of(pageNumber, pageSize, sort);
    }

    /**
     * Apply DTO values into the entity.
     * This method loads referenced entities (Category, City, Features) safely.
     */
    private void applyRequest(Product product, ProductRequestDTO request) {
        // Basic attributes
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());

        // Category
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found id=" + request.getCategoryId()));
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }

        // City
        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found id=" + request.getCityId()));
            product.setCity(city);
        } else {
            product.setCity(null);
        }

        // Features
        if (request.getFeatureIds() != null) {
            Set<Feature> features = request.getFeatureIds().stream()
                    .map(fid -> featureRepository.findById(fid)
                            .orElseThrow(() -> new ResourceNotFoundException("Feature not found id=" + fid)))
                    .collect(Collectors.toCollection(LinkedHashSet::new));
            product.setFeatures(features);
        } else {
            product.setFeatures(Collections.emptySet());
        }

        List<String> normalizedImages = normalizeImageUrls(request);
        if (normalizedImages != null) {
            syncProductImages(product, normalizedImages);
        } else if (request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            product.setImageUrl(request.getImageUrl());
        }
    }

    private List<String> normalizeImageUrls(ProductRequestDTO request) {
        if (request == null) return null;
        List<String> raw = request.getImageUrls();
        if ((raw == null || raw.isEmpty()) && request.getImageUrl() != null && !request.getImageUrl().isBlank()) {
            raw = List.of(request.getImageUrl());
        }
        if (raw == null) {
            return null;
        }
        LinkedHashSet<String> dedup = new LinkedHashSet<>();
        for (String url : raw) {
            if (url == null) continue;
            String trimmed = url.trim();
            if (!trimmed.isEmpty()) {
                dedup.add(trimmed);
            }
        }
        return new ArrayList<>(dedup);
    }

    private void syncProductImages(Product product, List<String> imageUrls) {
        if (product.getImages() == null) {
            product.setImages(new ArrayList<>());
        }
        List<ProductImage> target = product.getImages();
        target.clear();
        int order = 0;
        for (String url : imageUrls) {
            ProductImage image = new ProductImage();
            image.setUrl(url);
            image.setSortOrder(order++);
            image.setProduct(product);
            target.add(image);
        }
        if (!target.isEmpty()) {
            product.setImageUrl(target.get(0).getUrl());
        } else {
            product.setImageUrl(null);
        }
    }

    private void validateUniqueName(String name, Long currentId) {
        if (name == null) {
            return;
        }
        String normalized = name.trim();
        if (normalized.isEmpty()) {
            return;
        }

        productRepository.findByNameIgnoreCase(normalized)
                .filter(existing -> currentId == null || !existing.getId().equals(currentId))
                .ifPresent(existing -> {
                    throw new ResourceConflictException("PRODUCT_NAME_DUPLICATE", DUPLICATE_NAME_MESSAGE);
                });
    }

    /** Convert entity to response DTO (IDs only for relations). */
    private ProductResponseDTO toResponseDTO(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());
        dto.setPrice(p.getPrice());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getId());
            dto.setCategoryName(p.getCategory().getName());
        } else {
            dto.setCategoryId(null);
            dto.setCategoryName(null);
        }
        if (p.getCity() != null) {
            dto.setCityId(p.getCity().getId());
            dto.setCityName(p.getCity().getName());
        } else {
            dto.setCityId(null);
            dto.setCityName(null);
        }

        Set<Long> featureIds = (p.getFeatures() == null)
                ? Collections.emptySet()
                : p.getFeatures().stream()
                    .map(Feature::getId)
                    .collect(Collectors.toCollection(LinkedHashSet::new));
        dto.setFeatureIds(featureIds);

        List<String> imageUrls = p.getImages() == null
                ? List.of()
                : p.getImages().stream()
                    .sorted((a, b) -> Integer.compare(a.getSortOrder(), b.getSortOrder()))
                    .map(ProductImage::getUrl)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        if ((imageUrls == null || imageUrls.isEmpty()) && p.getImageUrl() != null) {
            imageUrls = List.of(p.getImageUrl());
        }
        dto.setImageUrls(imageUrls);
        dto.setRatingAverage(p.getRatingAverage());
        dto.setRatingCount(p.getRatingCount());

        return dto;
    }
}
