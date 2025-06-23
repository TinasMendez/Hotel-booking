package com.miapp.reservashotel;

import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit test for ProductServiceImpl.
 * Uses Mockito to simulate ProductRepository behavior without touching the real database.
 */
public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateProduct_success() {
        Product product = new Product();
        product.setName("Test Hotel");
        product.setDescription("A test hotel");
        product.setImageUrl("https://url.com/hotel.jpg");

        when(productRepository.existsByName("Test Hotel")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product created = productService.createProduct(product);

        assertNotNull(created);
        assertEquals("Test Hotel", created.getName());

        verify(productRepository).save(product);
    }
}
