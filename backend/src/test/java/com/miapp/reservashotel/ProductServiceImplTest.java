package com.miapp.reservashotel;

import com.miapp.reservashotel.model.Category;
import com.miapp.reservashotel.model.City;
import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.CategoryRepository;
import com.miapp.reservashotel.repository.CityRepository;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(ProductServiceImpl.class)
public class ProductServiceImplTest {

    @Autowired
    private ProductServiceImpl productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CityRepository cityRepository;

    private Category defaultCategory;
    private City defaultCity;

    @BeforeEach
    void setUp() {
        // Reset state to ensure deterministic tests
        productRepository.deleteAll();
        categoryRepository.deleteAll();
        cityRepository.deleteAll();

        // Seed a Category required by ProductServiceImpl
        defaultCategory = new Category();
        defaultCategory.setName("Default Category");
        defaultCategory.setDescription("Category for tests");
        defaultCategory = categoryRepository.save(defaultCategory);

        // Seed a City required by ProductServiceImpl
        defaultCity = new City();
        defaultCity.setName("Test City");
        defaultCity.setCountry("Testland");
        defaultCity = cityRepository.save(defaultCity);
    }

    @Test
    void createProduct_returnsEntity_andPersists() {
        // Build a minimal valid Product for creation
        Product product = new Product();
        product.setName("Test Product");
        product.setDescription("Test description");
        product.setPrice(BigDecimal.valueOf(100));
        product.setCategory(defaultCategory);
        product.setCity(defaultCity);

        // Execute
        Product saved = productService.createProduct(product);

        // Verify returned entity
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Test Product");
        assertThat(saved.getCategory()).isNotNull();
        assertThat(saved.getCategory().getName()).isEqualTo("Default Category");
        assertThat(saved.getCity()).isNotNull();
        assertThat(saved.getCity().getName()).isEqualTo("Test City");

        // Verify it was persisted
        Product fromDb = productRepository.findById(saved.getId()).orElseThrow();
        assertThat(fromDb.getName()).isEqualTo("Test Product");
        assertThat(fromDb.getCategory().getId()).isEqualTo(defaultCategory.getId());
        assertThat(fromDb.getCity().getId()).isEqualTo(defaultCity.getId());
    }
}








