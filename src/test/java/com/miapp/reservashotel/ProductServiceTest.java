package com.miapp.reservashotel;

import com.miapp.reservashotel.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.assertj.core.api.Assertions.assertThat;

class ProductServiceTest {

    @Test
    void sampleTest() {
        ProductService productService = Mockito.mock(ProductService.class);
        assertThat(productService).isNotNull();
    }
}








