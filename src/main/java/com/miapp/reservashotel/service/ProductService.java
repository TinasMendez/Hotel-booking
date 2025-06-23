package com.miapp.reservashotel.service;

import com.miapp.reservashotel.model.Product;

import java.util.List;

/**
 * Interfaz que define las operaciones del servicio de productos.
 */
public interface ProductService {

    Product crearProducto(Product product);

    List<Product> listarProductos();

    void eliminarProducto(Long id);

    Product actualizarProducto(Long id, Product productoActualizado);
}


