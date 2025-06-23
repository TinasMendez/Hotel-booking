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
 * Test unitario para ProductServiceImpl.
 * Usamos Mockito para simular el comportamiento de ProductRepository sin tocar la base de datos real.
 */
public class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        // Inicializa los mocks antes de cada test
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCrearProducto_exitoso() {
        // Arrange
        Product producto = new Product();
        producto.setNombre("Hotel Nuevo");
        producto.setDescripcion("Un hotel de prueba");
        producto.setImagenUrl("https://url.com/hotel.jpg");

        // El repositorio no debería encontrar otro producto con el mismo nombre
        when(productRepository.existsByNombre("Hotel Nuevo")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(producto);

        // Act
        Product creado = productService.crearProducto(producto);

        // Assert
        assertNotNull(creado);
        assertEquals("Hotel Nuevo", creado.getNombre());

        verify(productRepository).save(producto); // Verifica que se haya llamado a .save()
    }
}
