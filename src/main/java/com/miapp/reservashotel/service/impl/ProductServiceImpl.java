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

import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service implementation for Product operations.
 * No Lombok: explicit constructor injection and plain Java getters/setters.
 */
@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CityRepository cityRepository;
    private final FeatureRepository featureRepository;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            CityRepository cityRepository,
            FeatureRepository featureRepository
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.cityRepository = cityRepository;
        this.featureRepository = featureRepository;
    }

    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        if (dto == null) throw new IllegalArgumentException("ProductRequestDTO must not be null");
        Product p = new Product();
        applyDtoToEntity(p, dto);
        return toResponseDTO(productRepository.save(p));
    }

    /**
     * Utility used by tests that may pass different DTO shapes.
     */
    @Override
    public Product createProduct(Object requestDto) {
        if (requestDto == null) throw new IllegalArgumentException("requestDto must not be null");
        Product p = new Product();
        applyFlexibleDtoToEntity(p, requestDto);
        return productRepository.save(p);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toResponseDTO(p);
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO dto) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        applyDtoToEntity(p, dto);
        return toResponseDTO(productRepository.save(p));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    // ---------- Mapping helpers ----------

    private ProductResponseDTO toResponseDTO(Product p) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setImageUrl(p.getImageUrl());
        dto.setPrice(p.getPrice());
        dto.setCategoryId(p.getCategory() != null ? p.getCategory().getId() : null);
        dto.setCityId(p.getCity() != null ? p.getCity().getId() : null);

        Set<Long> featureIds = Optional.ofNullable(p.getFeatures())
                .orElseGet(Collections::emptySet)
                .stream()
                .map(Feature::getId)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        dto.setFeatureIds(featureIds);
        return dto;
    }

    private void applyDtoToEntity(Product target, ProductRequestDTO dto) {
        if (dto.getName() != null) target.setName(dto.getName());
        if (dto.getDescription() != null) target.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) target.setImageUrl(dto.getImageUrl());
        if (dto.getPrice() != null) target.setPrice(dto.getPrice());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));
            target.setCategory(category);
        }

        if (dto.getCityId() != null) {
            City city = cityRepository.findById(dto.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + dto.getCityId()));
            target.setCity(city);
        }

        if (dto.getFeatureIds() != null) {
            Set<Feature> features = new LinkedHashSet<>();
            for (Long fid : dto.getFeatureIds()) {
                Feature f = featureRepository.findById(fid)
                        .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + fid));
                features.add(f);
            }
            target.setFeatures(features);
        }
    }

    private void applyFlexibleDtoToEntity(Product target, Object flexibleDto) {
        // --- Basic fields (strings & numbers) ---
        String name = readStringWithFallbacks(flexibleDto, "getName", "name", "getTitle", "title");
        String description = readStringWithFallbacks(flexibleDto, "getDescription", "description", "getDetails", "details", "getSummary", "summary");
        String imageUrl = readStringWithFallbacks(flexibleDto, "getImageUrl", "imageUrl", "getImageURL", "imageURL", "getImage", "image");
        BigDecimal price = readBigDecimalWithFallbacks(flexibleDto, "getPrice", "price");

        if (name != null) target.setName(name);
        if (description != null) target.setDescription(description);
        if (imageUrl != null) target.setImageUrl(imageUrl);
        if (price != null) target.setPrice(price);

        // --- Category: accept id OR nested object ---
        Long categoryId = readLongWithFallbacks(flexibleDto, "getCategoryId", "categoryId");
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
            target.setCategory(category);
        } else {
            Object catObj = invokeGetter(flexibleDto, "getCategory", "category");
            if (catObj instanceof Category cat) {
                target.setCategory(cat);
            } else {
                Long nestedCatId = readLongWithFallbacks(catObj, "getId", "id");
                if (nestedCatId != null) {
                    Category category = categoryRepository.findById(nestedCatId)
                            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + nestedCatId));
                    target.setCategory(category);
                }
            }
        }

        // --- City: accept id OR nested object ---
        Long cityId = readLongWithFallbacks(flexibleDto, "getCityId", "cityId");
        if (cityId != null) {
            City city = cityRepository.findById(cityId)
                    .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + cityId));
            target.setCity(city);
        } else {
            Object cityObj = invokeGetter(flexibleDto, "getCity", "city");
            if (cityObj instanceof City c) {
                target.setCity(c);
            } else {
                Long nestedCityId = readLongWithFallbacks(cityObj, "getId", "id");
                if (nestedCityId != null) {
                    City city = cityRepository.findById(nestedCityId)
                            .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + nestedCityId));
                    target.setCity(city);
                }
            }
        }

        // --- Features: accept ids OR collection of Feature objects ---
        Set<Long> featureIds = readLongSetFlexible(flexibleDto, "getFeatureIds", "featureIds");
        if (featureIds == null) {
            Object feats = invokeGetter(flexibleDto, "getFeatures", "features");
            if (feats instanceof Collection<?> coll && !coll.isEmpty()) {
                Set<Long> tmp = new LinkedHashSet<>();
                for (Object it : coll) {
                    Long id = readLongWithFallbacks(it, "getId", "id");
                    if (id != null) tmp.add(id);
                }
                if (!tmp.isEmpty()) featureIds = tmp;
            }
        }
        if (featureIds != null) {
            Set<Feature> features = new LinkedHashSet<>();
            for (Long fid : featureIds) {
                Feature f = featureRepository.findById(fid)
                        .orElseThrow(() -> new ResourceNotFoundException("Feature not found with id: " + fid));
                features.add(f);
            }
            target.setFeatures(features);
        }
    }

    // ---------- Tiny reflection helpers ----------

    private String readStringWithFallbacks(Object obj, String... names) {
        if (obj == null) return null;
        for (String n : names) {
            Object v = invokeGetter(obj, n);
            if (v instanceof String s && !s.isBlank()) return s;
        }
        return null;
    }

    private BigDecimal readBigDecimalWithFallbacks(Object obj, String... names) {
        if (obj == null) return null;
        for (String n : names) {
            Object v = invokeGetter(obj, n);
            if (v instanceof BigDecimal bd) return bd;
            if (v instanceof Number num) return BigDecimal.valueOf(num.doubleValue());
            if (v instanceof String s) {
                try { return new BigDecimal(s); } catch (Exception ignored) {}
            }
        }
        return null;
    }

    private Long readLongWithFallbacks(Object obj, String... names) {
        if (obj == null) return null;
        for (String n : names) {
            Object v = invokeGetter(obj, n);
            if (v instanceof Long l) return l;
            if (v instanceof Number num) return num.longValue();
            if (v instanceof String s) {
                try { return Long.parseLong(s); } catch (Exception ignored) {}
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private Set<Long> readLongSetFlexible(Object obj, String... names) {
        if (obj == null) return null;
        for (String n : names) {
            Object v = invokeGetter(obj, n);
            if (v == null) continue;
            if (v instanceof Set<?> set) {
                Set<Long> out = new LinkedHashSet<>();
                for (Object it : set) {
                    Long val = convertToLong(it);
                    if (val != null) out.add(val);
                }
                return out.isEmpty() ? null : out;
            }
            if (v instanceof List<?> list) {
                Set<Long> out = new LinkedHashSet<>();
                for (Object it : list) {
                    Long val = convertToLong(it);
                    if (val != null) out.add(val);
                }
                return out.isEmpty() ? null : out;
            }
            if (v instanceof Long l) return new LinkedHashSet<>(Collections.singletonList(l));
            if (v instanceof Number num) return new LinkedHashSet<>(Collections.singletonList(num.longValue()));
            if (v instanceof String s) {
                String cleaned = s.replace("[", "").replace("]", "");
                Set<Long> out = new LinkedHashSet<>();
                for (String part : cleaned.split(",")) {
                    String t = part.trim();
                    if (!t.isEmpty()) {
                        try { out.add(Long.parseLong(t)); } catch (Exception ignored) {}
                    }
                }
                if (!out.isEmpty()) return out;
            }
        }
        return null;
    }

    private Long convertToLong(Object it) {
        if (it instanceof Long l) return l;
        if (it instanceof Number num) return num.longValue();
        if (it instanceof String s) {
            try { return Long.parseLong(s); } catch (Exception ignored) {}
        }
        return null;
    }

    /**
     * Overload that tries multiple possible getter names (varargs).
     * It will attempt:
     * 1) The name as-is (e.g., "getCity")
     * 2) If it doesn't start with "get", try "get" + capitalized (e.g., "city" -> "getCity")
     * If obj is null or nothing matches, returns null.
     */
    private Object invokeGetter(Object obj, String... names) {
        if (obj == null || names == null) return null;
        for (String name : names) {
            // Try exact name first
            Object value = invokeGetterSingle(obj, name);
            if (value != null) return value;

            // If the provided name doesn't start with "get", try bean-style "getXxx"
            if (!name.startsWith("get")) {
                String bean = "get" + Character.toUpperCase(name.charAt(0)) + name.substring(1);
                value = invokeGetterSingle(obj, bean);
                if (value != null) return value;
            }
        }
        return null;
    }

    /**
     * Helper that invokes a single no-arg method name. Returns null if not found or on error.
     */
    private Object invokeGetterSingle(Object obj, String name) {
        try {
            Method m = obj.getClass().getMethod(name);
            return m.invoke(obj);
        } catch (Exception ignored) {
            return null;
        }
    }
}








