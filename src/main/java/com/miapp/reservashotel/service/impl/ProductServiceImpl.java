package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
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

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
    public ProductResponseDTO createProduct(ProductRequestDTO productRequestDTO) {
        Product saved = createProduct((Object) productRequestDTO);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));
        return toResponse(product);
    }

    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO productRequestDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + id));

        String name = readStringWithFallbacks(productRequestDTO, "getName", "name", "getTitle", "title");
        String description = readStringWithFallbacks(productRequestDTO, "getDescription", "description", "getDetails", "details", "getSummary", "summary");
        BigDecimal price = readBigDecimalWithFallbacks(productRequestDTO, "getPrice", "price");

        Long categoryId = readLongFlexible(productRequestDTO, "getCategoryId", "categoryId", "getCategory", "category");
        Long cityId = readLongFlexible(productRequestDTO, "getCityId", "cityId", "getCity", "city");
        Set<Long> featureIds = readLongSetWithFallbacks(productRequestDTO, "getFeatureIds", "featureIds");

        if (name != null) product.setName(name);
        if (description != null) product.setDescription(description);
        if (price != null) product.setPrice(price);
        if (categoryId != null) product.setCategory(findCategory(categoryId));
        if (cityId != null) product.setCity(findCity(cityId));
        if (featureIds != null) product.setFeatures(findFeatures(featureIds));

        Product saved = productRepository.save(product);
        return toResponse(saved);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public Product createProduct(Object requestDto) {
        if (requestDto == null) {
            throw new IllegalArgumentException("requestDto must not be null");
        }

        String name = readStringWithFallbacks(requestDto, "getName", "name", "getTitle", "title");
        String description = readStringWithFallbacks(requestDto, "getDescription", "description", "getDetails", "details", "getSummary", "summary");
        BigDecimal price = readBigDecimalWithFallbacks(requestDto, "getPrice", "price");

        Long categoryId = readLongFlexible(requestDto, "getCategoryId", "categoryId", "getCategory", "category");
        Long cityId = readLongFlexible(requestDto, "getCityId", "cityId", "getCity", "city");
        if (categoryId == null) throw new IllegalArgumentException("categoryId is required");
        if (cityId == null) throw new IllegalArgumentException("cityId is required");

        Set<Long> featureIds = readLongSetWithFallbacks(requestDto, "getFeatureIds", "featureIds");

        Category category = findCategory(categoryId);
        City city = findCity(cityId);
        Set<Feature> features = findFeatures(featureIds);

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        if (price != null) product.setPrice(price);
        product.setCategory(category);
        product.setCity(city);
        if (features != null && !features.isEmpty()) product.setFeatures(features);

        return productRepository.save(product);
    }

    private Category findCategory(Long id) {
        Optional<Category> opt = categoryRepository.findById(id);
        return opt.orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
    }

    private City findCity(Long id) {
        Optional<City> opt = cityRepository.findById(id);
        return opt.orElseThrow(() -> new IllegalArgumentException("City not found: " + id));
    }

    private Set<Feature> findFeatures(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) return new HashSet<>();
        Set<Feature> out = new HashSet<>();
        for (Long id : ids) {
            if (id == null) continue;
            featureRepository.findById(id).ifPresent(out::add);
        }
        return out;
    }

    private ProductResponseDTO toResponse(Product product) {
        ProductResponseDTO dto = new ProductResponseDTO();
        tryInvokeSetter(dto, "setId", Long.class, product.getId());
        tryInvokeSetter(dto, "setName", String.class, product.getName());
        tryInvokeSetter(dto, "setDescription", String.class, product.getDescription());
        tryInvokeSetter(dto, "setPrice", BigDecimal.class, product.getPrice());

        Long categoryId = (product.getCategory() != null) ? product.getCategory().getId() : null;
        Long cityId = (product.getCity() != null) ? product.getCity().getId() : null;
        tryInvokeSetter(dto, "setCategoryId", Long.class, categoryId);
        tryInvokeSetter(dto, "setCityId", Long.class, cityId);

        Set<Long> featureIds = new HashSet<>();
        if (product.getFeatures() != null) {
            for (Feature f : product.getFeatures()) {
                if (f != null && f.getId() != null) featureIds.add(f.getId());
            }
        }
        tryInvokeSetter(dto, "setFeatureIds", Set.class, featureIds);
        return dto;
    }

    private static Object safeInvoke(Object target, String methodName) {
        if (target == null || methodName == null) return null;
        Class<?> clazz = target.getClass();
        try {
            Method m;
            try {
                m = clazz.getMethod(methodName);
            } catch (NoSuchMethodException ignore) {
                m = clazz.getDeclaredMethod(methodName);
                m.setAccessible(true);
            }
            return m.invoke(target);
        } catch (Throwable t) {
            return null;
        }
    }

    private static void tryInvokeSetter(Object target, String setterName, Class<?> paramType, Object arg) {
        if (target == null || setterName == null) return;
        Class<?> clazz = target.getClass();
        try {
            Method m = clazz.getMethod(setterName, paramType);
            m.invoke(target, arg);
            return;
        } catch (Throwable ignore) {
        }
        try {
            Field f = findFieldBySetterFallback(clazz, setterName);
            if (f != null) {
                f.setAccessible(true);
                f.set(target, arg);
            }
        } catch (Throwable ignore) {
        }
    }

    private static Field findFieldBySetterFallback(Class<?> clazz, String setterName) {
        if (!setterName.startsWith("set") || setterName.length() <= 3) return null;
        String base = setterName.substring(3);
        String candidate1 = Character.toLowerCase(base.charAt(0)) + base.substring(1);
        try {
            return clazz.getDeclaredField(candidate1);
        } catch (NoSuchFieldException e) {
            return null;
        }
    }

    private static String readStringWithFallbacks(Object obj, String... getters) {
        for (String g : getters) {
            Object v = safeInvoke(obj, g);
            if (v instanceof String s && !s.isBlank()) return s;
            if (v != null) return v.toString();
        }
        return null;
    }

    private static BigDecimal readBigDecimalWithFallbacks(Object obj, String... getters) {
        for (String g : getters) {
            Object v = safeInvoke(obj, g);
            if (v == null) continue;
            if (v instanceof BigDecimal bd) return bd;
            if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
            if (v instanceof String s && !s.isBlank()) return new BigDecimal(s);
        }
        return null;
    }

    private static Long readLongFlexible(Object obj, String... gettersOrObjectProps) {
        for (String g : gettersOrObjectProps) {
            Object v = safeInvoke(obj, g);
            Long id = toLong(v);
            if (id != null) return id;
        }
        return null;
    }

    private static Set<Long> readLongSetWithFallbacks(Object obj, String... getters) {
        for (String g : getters) {
            Object v = safeInvoke(obj, g);
            if (v == null) continue;
            if (v instanceof Set<?> set) {
                Set<Long> out = new HashSet<>();
                for (Object o : set) {
                    Long val = toLong(o);
                    if (val != null) out.add(val);
                }
                return out;
            }
        }
        return new HashSet<>();
    }

    private static Long toLong(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.longValue();
        if (v instanceof String s && !s.isBlank()) return Long.valueOf(s);
        Object id = safeInvoke(v, "getId");
        if (id == null) id = safeInvoke(v, "id");
        if (id instanceof Number n2) return n2.longValue();
        if (id instanceof String s2 && !s2.isBlank()) return Long.valueOf(s2);
        return null;
    }
}





