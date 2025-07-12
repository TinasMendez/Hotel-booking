package com.miapp.reservashotel;

import com.miapp.reservashotel.dto.ProductResponseDTO;
import com.miapp.reservashotel.service.ProductService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ProductServiceTest {

    @MockBean
    private ProductService productService;

    @Test
    void sampleTest() {
        // Aquí va un test real más adelante
        assertThat(productService).isNotNull();
    }
}





