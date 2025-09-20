package com.miapp.reservashotel;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.exception.ResourceConflictException;
import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Feature;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.FeatureRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

/**
 * Minimal unit tests to cover name uniqueness and random listing.
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private CityRepository cityRepository;
    @Mock private FeatureRepository featureRepository;

    @InjectMocks
    private ProductServiceImpl service;

    private Category cat;
    private City city;
    private Feature feature;

    @BeforeEach
    void setup() {
        cat = new Category();
        cat.setId(1L);
        cat.setName("Hotels");

        city = new City();
        city.setId(1L);
        city.setName("Bogotá");

        feature = new Feature();
        feature.setId(1L);
        feature.setName("WiFi");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(cat));
        when(cityRepository.findById(1L)).thenReturn(Optional.of(city));
        when(featureRepository.findById(1L)).thenReturn(Optional.of(feature));
    }

    @Test
    void createProduct_shouldRejectDuplicateName() {
        Product existing = new Product();
        existing.setId(99L);
        existing.setName("Hotel One");
        when(productRepository.findByNameIgnoreCase("Hotel One"))
                .thenReturn(Optional.of(existing));

        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Hotel One");
        dto.setDescription("Nice place near the park.");
        dto.setPrice(new BigDecimal("100.00"));
        dto.setCityId(1L);
        dto.setCategoryId(1L);
        dto.setFeatureIds(List.of(1L));

        assertThatThrownBy(() -> service.createProduct(dto))
                .isInstanceOf(ResourceConflictException.class)
                .hasMessageContaining("Product name is already in use");
    }

    @Test
    void getRandomProducts_shouldReturnUpTo10UniqueAndValidIds() {
        // Provide a list of 20 products to pick from
        List<Product> repo = new ArrayList<>();
        for (long i = 1; i <= 20; i++) {
            Product p = new Product();
            p.setId(i);
            p.setName("P" + i);
            repo.add(p);
        }
        when(productRepository.findAll()).thenReturn(repo);

        List<ProductResponseDTO> out = service.getRandomProducts(100);
        assertThat(out).hasSizeLessThanOrEqualTo(10);

        Set<Long> seen = new HashSet<>();
        for (ProductResponseDTO dto : out) {
            assertThat(seen.add(dto.getId())).isTrue();
        }
    }
}
