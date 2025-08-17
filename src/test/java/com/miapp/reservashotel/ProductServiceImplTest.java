package com.miapp.reservashotel;

import com.miapp.reservashotel.dto.ProductRequestDTO;
import com.miapp.reservashotel.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;

import static org.mockito.Mockito.*;

public class ProductServiceImplTest {

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateProduct() {
        ProductRequestDTO dto = new ProductRequestDTO();
        dto.setName("Test Product");
        dto.setDescription("Test Description");
        dto.setImageUrl("http://example.com");
        dto.setPrice(BigDecimal.valueOf(100.00));
        dto.setCategoryId(1L);
        dto.setCityId(1L);
        // Puedes agregar más campos si es necesario

        productService.createProduct(dto);

        verify(productService, times(1)).createProduct(dto);
    }
}

