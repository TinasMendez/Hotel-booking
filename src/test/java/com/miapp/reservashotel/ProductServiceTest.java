package com.miapp.reservashotel;

import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Test
    public void testCreateProduct() {
        String uniqueName = "Hotel_Test_" + UUID.randomUUID();

        Product product = new Product();
        product.setName(uniqueName);
        product.setDescription("Test hotel description");
        product.setImageUrl("https://url-test.com/hotel.jpg");

        Product created = productService.createProduct(product);

        assertNotNull(created.getId());
        assertEquals(uniqueName, created.getName());
    }

    @Test
    public void testListProducts() {
        List<Product> products = productService.listProducts();
        assertNotNull(products);
        assertTrue(products.size() >= 0); // Make sure it doesn't return null
    }
}

