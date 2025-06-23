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
public void testCrearProducto() {
    // Generate a unique name to avoid conflicts with duplicate names
    String uniqueName = "Hotel_Test_" + UUID.randomUUID();

    Product product = new Product();
    product.setNombre(uniqueName);
    product.setDescripcion("Test hotel description");
    product.setImagenUrl("https://url-test.com/hotel.jpg");

    Product created = productService.crearProducto(product);

    assertNotNull(created.getId());
    assertEquals(uniqueName, created.getNombre());
}


    @Test
    public void testListarProductos() {
        List<Product> productos = productService.listarProductos();
        assertNotNull(productos);
        assertTrue(productos.size() >= 0); // Al menos que no falle por null
    }
}
