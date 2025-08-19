package com.miapp.reservashotel;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.context.ActiveProfiles;

import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.impl.ProductServiceImpl;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class ProductServiceImplTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CityRepository cityRepository;
    @Mock private FeatureRepository featureRepository;

    @InjectMocks private ProductServiceImpl productService;

    /**
     * Happy path: the service should build a Product from the DTO-like request,
     * resolve references (category, city, features), and persist it.
     */
    @Test
    void createProduct_returnsEntity_andPersists() {
        // --- Arrange repository returns
        Long categoryId = 1L;
        Long cityId = 2L;

        Category category = new Category();
        City city = new City();

        Feature f1 = new Feature();
        Feature f2 = new Feature();

        when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(category));
        when(cityRepository.findById(cityId)).thenReturn(Optional.of(city));
        when(featureRepository.findById(10L)).thenReturn(Optional.of(f1));
        when(featureRepository.findById(11L)).thenReturn(Optional.of(f2));

        // Save returns the same entity instance (no need to set an id)
        when(productRepository.save(any(Product.class)))
                .thenAnswer(inv -> inv.getArgument(0, Product.class));

        // DTO-like request used via reflection by the service
        var req = new ProductCreateRequest(
                "Ocean View",
                "Nice room with sea view",
                new BigDecimal("199.99"),
                categoryId,
                cityId,
                Set.of(10L, 11L)
        );

        // --- Act
        Product saved = productService.createProduct(req);

        // --- Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getName()).isEqualTo("Ocean View");
        assertThat(saved.getDescription()).isEqualTo("Nice room with sea view");
        assertThat(saved.getPrice()).isEqualByComparingTo("199.99");

        // The same resolved references must be set on the entity
        assertThat(saved.getCategory()).isSameAs(category);
        assertThat(saved.getCity()).isSameAs(city);
        assertThat(saved.getFeatures()).hasSize(2).contains(f1, f2);

        // Verify repository interactions
        verify(categoryRepository, times(1)).findById(categoryId);
        verify(cityRepository, times(1)).findById(cityId);
        verify(featureRepository, times(1)).findById(10L);
        verify(featureRepository, times(1)).findById(11L);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    /**
     * Minimal DTO-like request object for the test.
     * The service reads these values via reflection (getXxx methods).
     */
    static class ProductCreateRequest {
        private final String name;
        private final String description;
        private final BigDecimal price;
        private final Long categoryId;
        private final Long cityId;
        private final Set<Long> featureIds;

        ProductCreateRequest(String name, String description, BigDecimal price,
                            Long categoryId, Long cityId, Set<Long> featureIds) {
            this.name = name;
            this.description = description;
            this.price = price;
            this.categoryId = categoryId;
            this.cityId = cityId;
            this.featureIds = featureIds;
        }

        // --- getters discovered by reflection ---
        public String getName() { return name; }
        public String getDescription() { return description; }
        public BigDecimal getPrice() { return price; }
        public Long getCategoryId() { return categoryId; }
        public Long getCityId() { return cityId; }
        public Set<Long> getFeatureIds() { return featureIds; }
    }
}



