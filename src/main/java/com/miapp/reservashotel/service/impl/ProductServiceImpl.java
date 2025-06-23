package com.miapp.reservashotel.service.impl;

import com.miapp.reservashotel.model.Product;
import com.miapp.reservashotel.repository.ProductRepository;
import com.miapp.reservashotel.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementación de ProductService con la lógica de negocio para productos.
 */
@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product crearProducto(Product product) {
        // Validación: no permitir nombres duplicados
        if (productRepository.existsByNombre(product.getNombre())) {
            throw new RuntimeException("Ya existe un producto con ese nombre.");
        }
        return productRepository.save(product);
    }

    @Override
    public List<Product> listarProductos() {
        return productRepository.findAll();
    }

    @Override
    public void eliminarProducto(Long id) {
        productRepository.deleteById(id);
    }
    @Override
public Product actualizarProducto(Long id, Product productoActualizado) {
    Product productoExistente = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + id));

    productoExistente.setNombre(productoActualizado.getNombre());
    productoExistente.setDescripcion(productoActualizado.getDescripcion());
    productoExistente.setImagenUrl(productoActualizado.getImagenUrl());

    return productRepository.save(productoExistente);
}

}
